#!/bin/bash
# ============================================================
# SAP Panda Next.js — Standalone SSR Deploy Script
#
# WordPress は https://sap-navi.aladdin-techec.com に
# 既にデプロイ済みです。このスクリプトは Next.js SSR
# サービスを単独で Docker デプロイします。
#
# 使用方法:
#   bash deploy/scripts/deploy-nextjs-standalone.sh
#
# 事前準備:
#   deploy/config/remote.env にサーバー情報を設定
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$PROJECT_DIR/deploy/config/remote.env"

# ---- 設定（デフォルト値） ----
REMOTE_SERVER=""
REMOTE_USER="root"
REMOTE_PORT="22"
REMOTE_DEPLOY_PATH="/opt/sap-panda-nextjs"
# Next.js 公開ドメイン（Nginx 用）
NEXTJS_DOMAIN="${NEXTJS_DOMAIN:-}"
# リモート WordPress URL
WP_URL="https://sap-navi.aladdin-techec.com"

# 設定ファイル読み込み
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

if [ -z "$REMOTE_SERVER" ] || [ "$REMOTE_SERVER" = "your-server.com" ]; then
    echo "❌ Please set REMOTE_SERVER in $CONFIG_FILE"
    echo ""
    echo "  $CONFIG_FILE に以下を設定してください:"
    echo "    REMOTE_SERVER=your-server.com"
    echo "    REMOTE_USER=root"
    echo "    REMOTE_PORT=22"
    echo "    REMOTE_DEPLOY_PATH=/opt/sap-panda-nextjs"
    echo "    NEXTJS_DOMAIN=your-domain.com  (任意、Nginx設定用)"
    exit 1
fi

SERVER="$REMOTE_USER@$REMOTE_SERVER"
echo "============================================"
echo "  🐼 SAP Panda Next.js — Standalone Deploy"
echo "============================================"
echo "  Target      : $SERVER"
echo "  Deploy Path : $REMOTE_DEPLOY_PATH"
echo "  WordPress   : $WP_URL"
echo "============================================"
echo ""

# ---- Step 1: 必要なディレクトリを作成 ----
echo "[1/6] Creating remote directories..."
ssh -p "$REMOTE_PORT" "$SERVER" "mkdir -p $REMOTE_DEPLOY_PATH/deploy/nginx $REMOTE_DEPLOY_PATH/deploy/scripts"

# ---- Step 2: 設定ファイルを転送 ----
echo "[2/6] Transferring configuration files..."
rsync -avz \
  "$PROJECT_DIR/docker-compose.nextjs.yml" \
  "$PROJECT_DIR/react_next/Dockerfile" \
  "$PROJECT_DIR/react_next/.env.production" \
  "$PROJECT_DIR/deploy/nginx/nginx.nextjs-standalone.conf" \
  -e "ssh -p $REMOTE_PORT" \
  "$SERVER:$REMOTE_DEPLOY_PATH/" 2>&1 | grep -E "(\.dockerignore|\.env\.production|\.yml|Dockerfile|\.conf)"

# ---- Step 3: サーバー上で .env 生成 ----
echo ""
echo "[3/6] Setting up environment on server..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    cd $REMOTE_DEPLOY_PATH

    # .env ファイル作成（存在しない場合のみ）
    if [ ! -f .env ]; then
        cat > .env << ENVEOF
# Next.js 設定
NEXTJS_PORT=3000

# WordPress 接続先（既存サーバー）
NEXT_PUBLIC_WP_URL=https://sap-navi.aladdin-techec.com
NEXT_PUBLIC_API_BASE=https://sap-navi.aladdin-techec.com/wp-json/sap/v1
NEXT_PUBLIC_SITE_URL=${NEXTJS_DOMAIN}
NEXT_PUBLIC_GA_ID=
ENVEOF
        echo '  ✅ .env file created'
    else
        echo '  ✅ .env already exists'
    fi
"

# ---- Step 4: Docker Compose でビルド＆起動 ----
echo ""
echo "[4/6] Building and starting Docker container..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    cd $REMOTE_DEPLOY_PATH
    docker compose -f docker-compose.nextjs.yml build --pull
    docker compose -f docker-compose.nextjs.yml up -d --remove-orphans
    docker image prune -f
"

# ---- Step 5: ヘルスチェック ----
echo ""
echo "[5/6] Running health check..."
sleep 5
HTTP_CODE=$(ssh -p "$REMOTE_PORT" "$SERVER" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ 2>/dev/null || echo 'failed'")
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Health check passed (HTTP $HTTP_CODE)"
else
    echo "  ⚠️  Health check returned HTTP $HTTP_CODE"
    echo "     Checking logs..."
    ssh -p "$REMOTE_PORT" "$SERVER" "cd $REMOTE_DEPLOY_PATH && docker compose -f docker-compose.nextjs.yml logs --tail=20 nextjs"
fi

# ---- Step 6: 状態確認 ----
echo ""
echo "[6/6] Service status..."
ssh -p "$REMOTE_PORT" "$SERVER" "cd $REMOTE_DEPLOY_PATH && docker compose -f docker-compose.nextjs.yml ps"

echo ""
echo "============================================"
echo "  ✅ Deploy Complete!"
echo "============================================"
echo ""
echo "  Next.js SSR : http://$REMOTE_SERVER:3000"
echo "  WordPress   : https://sap-navi.aladdin-techec.com"
echo "  API         : https://sap-navi.aladdin-techec.com/wp-json/sap/v1/"
echo ""
echo "  Nginx をフロントに配置する場合は以下を実行:"
echo "  1. サーバーに SSH: ssh $SERVER"
echo "  2. Nginx 設定を確認: cat $REMOTE_DEPLOY_PATH/deploy/nginx/nginx.nextjs-standalone.conf"
echo "  3. /etc/nginx/sites-enabled/ にシンボリックリンクを作成"
echo "  4. SSL 証明書を設定: certbot --nginx -d your-domain.com"
echo ""
echo "  管理コマンド:"
echo "    ssh $SERVER 'cd $REMOTE_DEPLOY_PATH && docker compose -f docker-compose.nextjs.yml logs -f'"
echo "    ssh $SERVER 'cd $REMOTE_DEPLOY_PATH && docker compose -f docker-compose.nextjs.yml restart'"
echo "    ssh $SERVER 'cd $REMOTE_DEPLOY_PATH && docker compose -f docker-compose.nextjs.yml down'"
echo "============================================"
