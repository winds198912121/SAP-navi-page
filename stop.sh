#!/bin/bash
# ============================================================
# SAP パンダ先生 — 停止所有服务
# ============================================================

echo "Stopping SAP パンダ先生 services..."

# Stop Nginx (if running)
if command -v nginx &>/dev/null; then
    sudo nginx -s stop 2>/dev/null && echo "  ✅ Nginx stopped" || echo "  ⚠️  Nginx not running"
fi

# Stop PHP dev server
kill $(lsof -ti:8080 2>/dev/null) 2>/dev/null && echo "  ✅ WordPress stopped" || echo "  ⚠️  WordPress not running"

# Stop Vite dev server
kill $(lsof -ti:5173 2>/dev/null) 2>/dev/null && echo "  ✅ Frontend stopped" || echo "  ⚠️  Frontend not running"

# Stop SSR server
kill $(lsof -ti:3000 2>/dev/null) 2>/dev/null && echo "  ✅ SSR server stopped" || echo "  ⚠️  SSR server not running"

# Stop MySQL
MYSQL_SOCK="/tmp/sap-panda.sock"
if [ -S "$MYSQL_SOCK" ]; then
    /usr/local/mysql-8.1.0-macos13-x86_64/bin/mysqladmin -S "$MYSQL_SOCK" shutdown 2>/dev/null
    echo "  ✅ MySQL stopped"
else
    echo "  ⚠️  MySQL not running"
fi

# Stop Docker containers (if running)
if command -v docker &>/dev/null; then
    cd "$(cd "$(dirname "$0")" && pwd)"
    docker compose down 2>/dev/null && echo "  ✅ Docker containers stopped" || true
fi

echo ""
echo "All services stopped."
