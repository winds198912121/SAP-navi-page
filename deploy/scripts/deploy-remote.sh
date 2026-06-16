#!/bin/bash
# ============================================================
# SAP パンダ先生 — リモートデプロイスクリプト
# ローカル → 本番サーバー rsync
#
# 使用方法:
#   1. deploy/config/remote.env にサーバー情報を設定
#   2. bash deploy/scripts/deploy-remote.sh
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
EOF
    echo "  ✏️  Please edit $CONFIG_FILE and re-run this script"
    exit 1
fi

RSYNC_OPTS="-avz --delete --progress -e 'ssh -p $REMOTE_PORT'"
SERVER="$REMOTE_USER@$REMOTE_SERVER"

echo "============================================"
echo "  🐼 SAP Panda Academy — Remote Deploy"
echo "============================================"
echo "  Server : $REMOTE_SERVER"
echo "  Path   : $REMOTE_WP_PATH"
echo "  Port   : $REMOTE_PORT"
echo "============================================"
echo ""

# 接続確認
echo "[1/5] Testing SSH connection..."
ssh -p "$REMOTE_PORT" -o ConnectTimeout=5 "$SERVER" "echo OK" || {
    echo "  ❌ Cannot connect to $SERVER"
    exit 1
}
echo "  ✅ SSH connection OK"
echo ""

# React ビルド
echo "[2/5] Building React frontend..."
cd "$PROJECT_DIR/admin-react"
bash build.sh 2>&1 | tail -3
echo "  ✅ Build complete"
echo ""

# カスタムプラグインをデプロイ
echo "[3/5] Deploying plugin (sap-panda-api)..."
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/wordpress/wp-content/plugins/sap-panda-api/" \
  "$SERVER:$REMOTE_WP_PATH/wp-content/plugins/sap-panda-api/"
echo "  ✅ Plugin deployed"
echo ""

# React SPA テーマをデプロイ
echo "[4/5] Deploying theme (sap-panda)..."
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/wordpress/wp-content/themes/sap-panda/" \
  "$SERVER:$REMOTE_WP_PATH/wp-content/themes/sap-panda/"
echo "  ✅ Theme deployed"
echo ""

# パーミッション修正
echo "[5/5] Fixing permissions..."
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
echo "  👉 WordPress管理画面で以下を有効化:"
echo "     1. プラグイン → SAP Panda API"
echo "     2. 外観 > テーマ → SAP Panda Academy"
echo ""
echo "  🔍 動作確認:"
echo "     curl -s https://$REMOTE_SERVER/wp-json/sap/v1 | head"
echo "     curl -s -o /dev/null -w '%{http_code}' https://$REMOTE_SERVER/"
echo "============================================"
