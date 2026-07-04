#!/bin/bash
# ============================================================
# SAP パンダ先生 — リモートデプロイスクリプト (SSR 対応 v2.4)
# ローカル → 本番サーバー rsync
#
# 使用方法:
#   1. deploy/config/remote.env にサーバー情報を設定
#   2. bash deploy/scripts/deploy-remote.sh
#
# デプロイ対象:
#   - WordPress プラグイン (sap-panda-api)
#   - WordPress テーマ (sap-panda): HTML/CSS/JS/画像
#   - SSR サーバーバンドル (Node.js): dist/server/ + server/
#   - Nginx 設定 (SSR 対応)
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$PROJECT_DIR/deploy/config/remote.env"

# デフォルト値
REMOTE_SERVER=""
REMOTE_USER="root"
REMOTE_WP_PATH="/var/www/html"
REMOTE_PORT="22"
REMOTE_SSR_PATH="/opt/sap-panda-ssr"
SSR_PORT="${SSR_PORT:-3000}"

# 設定ファイルの読み込み
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
    echo "  ✅ Loaded config: $CONFIG_FILE"
else
    echo "  ⚠️  No config file found at $CONFIG_FILE"
    echo "  🔧 Creating template..."
    mkdir -p "$(dirname "$CONFIG_FILE")"
    cat > "$CONFIG_FILE" << 'EOF'
# ============================================================
# リモートサーバー設定
# このファイルを編集してからデプロイしてください
# ============================================================
REMOTE_SERVER="sap-panda.com"
REMOTE_USER="root"
REMOTE_WP_PATH="/var/www/html"
REMOTE_PORT="22"
REMOTE_SSR_PATH="/opt/sap-panda-ssr"
SSR_PORT="3000"
EOF
    echo "  ✏️  Please edit $CONFIG_FILE and re-run this script"
    exit 1
fi

RSYNC_OPTS="-avz --delete --progress -e 'ssh -p $REMOTE_PORT'"
SERVER="$REMOTE_USER@$REMOTE_SERVER"

echo "============================================"
echo "  🐼 SAP Panda Academy — Remote Deploy (SSR)"
echo "============================================"
echo "  Server : $REMOTE_SERVER"
echo "  WP Path: $REMOTE_WP_PATH"
echo "  SSR Dir: $REMOTE_SSR_PATH"
echo "============================================"
echo ""

# --------------------------------------------------
# 1. SSH 接続確認
# --------------------------------------------------
echo "[1/7] Testing SSH connection..."
ssh -p "$REMOTE_PORT" -o ConnectTimeout=5 "$SERVER" "echo OK" || {
    echo "  ❌ Cannot connect to $SERVER"
    exit 1
}
echo "  ✅ SSH connection OK"
echo ""

# --------------------------------------------------
# 2. React ビルド (CSR + SSR)
# --------------------------------------------------
echo "[2/7] Building React (client + SSR)..."
cd "$PROJECT_DIR/admin-react"
npm ci
npm run build:ssr
echo "  ✅ Build complete"
echo ""

# --------------------------------------------------
# 3. カスタムプラグインをデプロイ
# --------------------------------------------------
echo "[3/7] Deploying plugin (sap-panda-api)..."
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/wordpress/wp-content/plugins/sap-panda-api/" \
  "$SERVER:$REMOTE_WP_PATH/wp-content/plugins/sap-panda-api/"
echo "  ✅ Plugin deployed"
echo ""

# --------------------------------------------------
# 4. WordPress テーマをデプロイ (クライアントアセットのみ)
# --------------------------------------------------
echo "[4/7] Deploying theme (sap-panda)..."
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/wordpress/wp-content/themes/sap-panda/" \
  "$SERVER:$REMOTE_WP_PATH/wp-content/themes/sap-panda/"
echo "  ✅ Theme deployed"
echo ""

# --------------------------------------------------
# 5. SSR サーバーバンドルをデプロイ
# --------------------------------------------------
echo "[5/7] Deploying SSR server bundle..."
# サーバー上に SSR ディレクトリを作成
ssh -p "$REMOTE_PORT" "$SERVER" "mkdir -p $REMOTE_SSR_PATH/dist $REMOTE_SSR_PATH/server"

# SSR バンドル + クライアント HTML テンプレートを転送
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/admin-react/dist/server/" \
  "$SERVER:$REMOTE_SSR_PATH/dist/server/"
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/admin-react/dist/client/index.html" \
  "$SERVER:$REMOTE_SSR_PATH/dist/client/"
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/admin-react/server/" \
  "$SERVER:$REMOTE_SSR_PATH/server/"
echo "  ✅ SSR bundle deployed"
echo ""

# --------------------------------------------------
# 6. SSR サーバー再起動 (PM2)
# --------------------------------------------------
echo "[6/7] Restarting SSR server..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    # SSR ディレクトリに package.json があれば npm ci を実行
    if [ -f $REMOTE_SSR_PATH/package.json ]; then
        cd $REMOTE_SSR_PATH
        if [ ! -d node_modules ]; then
            npm ci --production
        fi
    fi

    # PM2 で再起動
    if command -v pm2 &>/dev/null; then
        if pm2 describe sap-panda-ssr &>/dev/null 2>&1; then
            pm2 restart sap-panda-ssr --update-env
        else
            pm2 start $REMOTE_SSR_PATH/server/index.js \
                --name sap-panda-ssr --time \
                --env PORT=$SSR_PORT
        fi
        pm2 save
        echo '  ✅ SSR server restarted via PM2'
    else
        echo '  ⚠️  PM2 not found. Install: npm install -g pm2'
    fi
" 2>&1
echo "  ✅ SSR server managed"
echo ""

# --------------------------------------------------
# 7. パーミッション修正
# --------------------------------------------------
echo "[7/7] Fixing permissions..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    chown -R www-data:www-data $REMOTE_WP_PATH/wp-content/plugins/sap-panda-api
    chown -R www-data:www-data $REMOTE_WP_PATH/wp-content/themes/sap-panda
    find $REMOTE_WP_PATH/wp-content/plugins/sap-panda-api -type d -exec chmod 755 {} \;
    find $REMOTE_WP_PATH/wp-content/plugins/sap-panda-api -type f -exec chmod 644 {} \;
    find $REMOTE_WP_PATH/wp-content/themes/sap-panda -type d -exec chmod 755 {} \;
    find $REMOTE_WP_PATH/wp-content/themes/sap-panda -type f -exec chmod 644 {} \;
" 2>&1
echo "  ✅ Permissions fixed"
echo ""

echo "============================================"
echo "  ✅ Deploy complete!"
echo "============================================"
echo "  📍 $REMOTE_SERVER"
echo ""
echo "  サイト: https://$REMOTE_SERVER"
echo "  管理画面: https://$REMOTE_SERVER/wp-admin"
echo "  SSR: 127.0.0.1:${SSR_PORT} (internal)"
echo ""
echo "  🔍 動作確認:"
echo "    curl -s https://$REMOTE_SERVER/wp-json/sap/v1 | head"
echo "    curl -s -o /dev/null -w '%{http_code}' https://$REMOTE_SERVER/"
echo "    # クローラー (SSR 確認):"
echo "    curl -s -H 'User-Agent: Googlebot/2.1' https://$REMOTE_SERVER/ | head -c 200"
echo ""
echo "  📋 初回のみ必要なセットアップ:"
echo "    ssh $SERVER 'bash -s' < ${SCRIPT_DIR}/setup-ssr.sh"
echo "============================================"
