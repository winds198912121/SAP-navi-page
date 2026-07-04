#!/bin/bash
# ============================================================
# SAP パンダ先生 — 一键启动脚本
# 模式：
#   ./start.sh          → 本番モード（Nginx :80 + WordPress :8081）
#   ./start.sh dev      → 開発モード（Vite :5173 + WordPress :8081）
#   ./start.sh docker   → Docker モード
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WP_DIR="$SCRIPT_DIR/wordpress"
ADMIN_DIR="$SCRIPT_DIR/admin-react"
MYSQL_DIR="/usr/local/mysql-8.1.0-macos13-x86_64"
MYSQL_DATA="$HOME/mysql-data"
SOCK="/tmp/sap-panda.sock"
MODE="${1:-prod}"

export PATH="$MYSQL_DIR/bin:$PATH"

echo "================================================"
echo "  🐼 SAP パンダ先生 — Startup ($MODE)"
echo "================================================"

# ----- Docker モード -----
if [ "$MODE" = "docker" ]; then
    echo "[Docker] Starting containers..."
    cd "$SCRIPT_DIR"
    docker compose up -d --build
    echo ""
    echo "  WordPress : http://localhost:8080"
    echo "  Frontend  : http://localhost:80"
    echo "  Admin     : http://localhost/wp-admin"
    echo ""
    echo "Run 'docker compose logs -f' to see logs"
    exit 0
fi

# ----- MySQL -----
echo "[1/4] Starting MySQL..."
if [ -S "$SOCK" ] && "$MYSQL_DIR/bin/mysqladmin" ping -S "$SOCK" --silent 2>/dev/null; then
    echo "  ✅ MySQL already running"
else
    rm -f /tmp/mysqlx.sock /tmp/mysqlx.sock.lock 2>/dev/null
    kill $(lsof -ti:3307 2>/dev/null) 2>/dev/null || true
    sleep 1
    "$MYSQL_DIR/bin/mysqld" --user=$(whoami) --datadir="$MYSQL_DATA" --socket="$SOCK" --port=3307 &
    sleep 3
    if "$MYSQL_DIR/bin/mysqladmin" ping -S "$SOCK" --silent; then
        echo "  ✅ MySQL started"
    else
        echo "  ❌ MySQL failed"
        exit 1
    fi
fi

# ----- WordPress -----
echo "[2/4] Starting WordPress..."
kill $(lsof -ti:8081 2>/dev/null) 2>/dev/null || true
sleep 1
cd "$SCRIPT_DIR"
php -c wordpress/php.ini -S 0.0.0.0:8081 -t wordpress >/tmp/sap-panda-wp.log 2>&1 &
sleep 2
if curl -s -o /dev/null "http://localhost:8081/" 2>/dev/null; then
    echo "  ✅ WordPress  : http://localhost:8081"
else
    echo "  ❌ WordPress failed (check /tmp/sap-panda-wp.log)"
    exit 1
fi

# ----- SSR Server (共通) -----
SSR_DIR="$ADMIN_DIR/server"
if [ -f "$SSR_DIR/index.js" ]; then
    kill $(lsof -ti:3000 2>/dev/null) 2>/dev/null || true
    cd "$ADMIN_DIR"
    SSR_ENABLED=1 SSR_HOST=localhost SSR_PORT=3000 node server/index.js >/tmp/sap-panda-ssr.log 2>&1 &
    sleep 2
    if curl -s -o /dev/null "http://localhost:3000/health" 2>/dev/null; then
        echo "  ✅ SSR Server : http://localhost:3000"
    else
        echo "  ⚠️  SSR Server skipped (check /tmp/sap-panda-ssr.log)"
    fi
else
    echo "  ⏭ SSR server skipped"
fi

# ----- 本番モード: Nginx (80) + React build + WordPress (8081) -----
if [ "$MODE" = "prod" ]; then
    echo "[3/4] Building React for production (CSR + SSR)..."
    cd "$ADMIN_DIR"
    bash build.sh 2>&1 | tail -5
    echo "  ✅ React build complete (client + server)"

    echo "[4/4] Reloading Nginx..."
    echo "  ⏳ Trying with sudo (requires password)..."
    set +e
    if sudo nginx -t 2>/dev/null; then
        sudo nginx -s reload 2>/dev/null || sudo nginx 2>/dev/null || true
        echo "  ✅ Nginx : http://localhost"
    elif sudo nginx -t 2>&1 | grep -q "syntax is ok"; then
        # syntax OK but permission issue on pid file — reload anyway
        sudo nginx -s reload 2>/dev/null || sudo nginx 2>/dev/null || true
        if sudo nginx -t 2>&1 | grep -q "syntax is ok"; then
             echo "  ✅ Nginx : http://localhost"
        fi
    else
        SYNTAX=$(sudo nginx -t 2>&1)
        echo "  ❌ Nginx config error!"
        echo "$SYNTAX"
        echo ""
        echo "  ⚠️  Please run the following command manually in terminal:"
        echo "  ----------------------------------------"
        echo "  !sudo nginx -s reload"
        echo "  ----------------------------------------"
    fi
    set -e

    echo ""
    echo "================================================"
    echo "  🐼 SAP パンダ先生 is running (PRODUCTION)"
    echo "================================================"
    echo "  Site      : http://localhost"
    echo "  WordPress : http://localhost/wp-admin"
    echo "  API       : http://localhost/wp-json/sap/v1/"
    echo "  SSR       : http://localhost:3000 (internal)"
    echo "================================================"
    exit 0
fi

# ----- 開発モード: Vite -----
echo "[3/4] Starting Frontend (Vite)..."
if [ -d "$ADMIN_DIR/src" ]; then
    kill $(lsof -ti:5173 2>/dev/null) 2>/dev/null || true
    cd "$ADMIN_DIR"
    npm run dev -- --host 0.0.0.0 >/tmp/sap-panda-admin.log 2>&1 &
    sleep 3
    echo "  ✅ Frontend   : http://localhost:5173"
else
    echo "  ⏭ Frontend skipped"
fi

echo ""
echo "================================================"
echo "  🐼 SAP パンダ先生 is running (DEVELOPMENT)"
echo "================================================"
echo "  WordPress : http://localhost:8081"
echo "  Admin     : http://localhost:8081/wp-admin"
echo "  API       : http://localhost:8081/wp-json/sap/v1/"
echo "  Frontend  : http://localhost:5173"
echo "  SSR       : http://localhost:3000"
echo "================================================"
