#!/bin/bash
# ============================================================
# SAP パンダ先生 — 本番デプロイスクリプト
# ネイティブモード（ネイティブMySQL + WordPress）用
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/deploy/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "===================================="
echo "  🐼 SAP パンダ先生 Deploy"
echo "===================================="

# 1. バックアップ
echo ""
echo "[1/4] Backing up database..."
mkdir -p "$BACKUP_DIR"
MYSQL_SOCK="/tmp/sap-panda.sock"
if [ -S "$MYSQL_SOCK" ]; then
    mysqldump -S "$MYSQL_SOCK" -u wordpress -pwordpress wordpress \
      > "$BACKUP_DIR/db_$TIMESTAMP.sql" 2>/dev/null
    gzip "$BACKUP_DIR/db_$TIMESTAMP.sql"
    echo "  ✅ Database backup: $BACKUP_DIR/db_$TIMESTAMP.sql.gz"
else
    echo "  ⚠️  MySQL not running, skipping database backup"
fi

# 2. React ビルド
echo ""
echo "[2/4] Building React frontend + SSR..."
cd "$PROJECT_DIR/admin-react"
npm ci
npm run build:ssr
echo "  ✅ React build complete (dist/client/ + dist/server/)"

# 3. Nginx 設定テスト
echo ""
echo "[3/4] Testing Nginx configuration..."
NGINX_CONF="$PROJECT_DIR/deploy/nginx/default.conf"
sudo nginx -t -c "$NGINX_CONF" 2>/dev/null || {
    # Homebrew Nginx の設定ディレクトリにコピー
    BREW_PREFIX=$(brew --prefix 2>/dev/null || echo "/usr/local")
    sudo mkdir -p "$BREW_PREFIX/etc/nginx/servers"
    sudo cp "$NGINX_CONF" "$BREW_PREFIX/etc/nginx/servers/sap-panda.conf"
    sudo nginx -t 2>&1 | head -5
}
echo "  ✅ Nginx config OK"

# 4. Nginx リロード
echo ""
echo "[4/4] Reloading Nginx..."
sudo nginx -s reload 2>/dev/null || sudo nginx 2>/dev/null || echo "  ⚠️  Start nginx manually: sudo nginx"
echo "  ✅ Nginx reloaded"

# 5. SSR サーバー (PM2 管理)
echo ""
echo "[5/4] Managing SSR server..."
if command -v pm2 &> /dev/null; then
    if pm2 describe sap-panda-ssr &>/dev/null; then
        pm2 restart sap-panda-ssr --update-env
    else
        pm2 start "$PROJECT_DIR/admin-react/server/index.js" \
            --name sap-panda-ssr --time \
            --env PORT=3000
    fi
    pm2 save
    echo "  ✅ SSR server managed by PM2"
else
    echo "  ⚠️  PM2 not found. SSR server not started."
    echo "     Install: npm install -g pm2"
    echo "     Start:   cd admin-react && node server/index.js"
fi

echo ""
echo "===================================="
echo "  ✅ Deploy complete!"
echo "  Site : http://localhost"
echo "  SSR  : http://localhost:3000 (internal)"
echo "===================================="
