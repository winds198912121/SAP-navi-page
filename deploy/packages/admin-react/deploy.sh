#!/bin/bash
# ============================================================
# SAP Panda Academy — admin-react 一键部署脚本
#
# 功能:
#   1. 构建 React SPA + SSR
#   2. 打包为发布包 (ZIP)
#   3. 可选: rsync 到远程服务器
#
# 使用方法:
#   bash deploy.sh                          # 构建并打包
#   bash deploy.sh --server user@host       # 构建并部署到远程
#   bash deploy.sh --skip-build             # 跳过构建，只打包
#   bash deploy.sh --help                   # 显示帮助
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ADMIN_REACT_DIR="$PROJECT_DIR/admin-react"
PACKAGE_DIR="$SCRIPT_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="admin-react-${TIMESTAMP}.zip"

# ---- 解析参数 ----
SKIP_BUILD=false
REMOTE_SERVER=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-build) SKIP_BUILD=true; shift ;;
        --server) REMOTE_SERVER="$2"; shift 2 ;;
        --help|-h)
            echo "用法: bash deploy.sh [选项]"
            echo ""
            echo "选项:"
            echo "  --skip-build     跳过构建, 只打包已存在的 dist/"
            echo "  --server <host>  构建后 rsync 到远程服务器"
            echo "  --help, -h       显示此帮助"
            exit 0
            ;;
        *) echo "未知参数: $1"; exit 1 ;;
    esac
done

echo "============================================"
echo "  🐼 SAP Panda Academy — admin-react Deploy"
echo "============================================"
echo ""

# ---- Step 1: 构建 ----
if [ "$SKIP_BUILD" = false ]; then
    echo "[1/4] Building React SPA + SSR..."
    cd "$ADMIN_REACT_DIR"

    # 依赖检查
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing dependencies..."
        npm ci
    fi

    # 执行构建
    npm run build:ssr
    echo "  ✅ Build complete"
    echo "     Client: dist/client/ ($(du -sh dist/client | awk '{print $1'}))"
    echo "     Server: dist/server/ ($(du -sh dist/server | awk '{print $1'}))"
else
    echo "[1/4] Skipping build (--skip-build)..."
    if [ ! -d "$ADMIN_REACT_DIR/dist/client" ]; then
        echo "  ❌ dist/client/ not found. Run build first or remove --skip-build"
        exit 1
    fi
fi
echo ""

# ---- Step 2: 打包 ----
echo "[2/4] Creating deployment package..."
cd "$ADMIN_REACT_DIR"
mkdir -p "$PACKAGE_DIR/releases"

# 收集部署文件
BUILD_DIR=$(mktemp -d)
trap "rm -rf '$BUILD_DIR'" EXIT

mkdir -p "$BUILD_DIR/admin-react/dist"
mkdir -p "$BUILD_DIR/admin-react/server"
mkdir -p "$BUILD_DIR/admin-react/deploy"

# 复制构建产物
cp -R dist/client "$BUILD_DIR/admin-react/dist/"
cp -R dist/server "$BUILD_DIR/admin-react/dist/"
cp -R server "$BUILD_DIR/admin-react/"
cp package.json "$BUILD_DIR/admin-react/"

# 复制部署辅助文件
cp "$PACKAGE_DIR/README.md" "$BUILD_DIR/admin-react/"
cp "$PACKAGE_DIR/nginx.conf.example" "$BUILD_DIR/admin-react/deploy/"
cp "$PACKAGE_DIR/.env.example" "$BUILD_DIR/admin-react/deploy/"

# 创建 .gitkeep（确保 server 目录在 git 中存在）
touch "$BUILD_DIR/admin-react/server/.gitkeep"

# 创建 ZIP 包
cd "$BUILD_DIR"
zip -r "$PACKAGE_DIR/releases/$PACKAGE_NAME" admin-react/ -x "*/node_modules/*" -x "*.git*" > /dev/null
echo "  ✅ Package created: $PACKAGE_DIR/releases/$PACKAGE_NAME"
echo "     Size: $(du -h "$PACKAGE_DIR/releases/$PACKAGE_NAME" | awk '{print $1'}))"
echo ""

# ---- Step 3: 部署到远程服务器 ----
if [ -n "$REMOTE_SERVER" ]; then
    echo "[3/4] Deploying to $REMOTE_SERVER..."
    REMOTE_USER="${REMOTE_SERVER%@*}"
    REMOTE_HOST="${REMOTE_SERVER#*@}"

    # 创建远程目录
    ssh "$REMOTE_SERVER" "mkdir -p /opt/admin-react-ssr"

    # 同步 SSR 文件
    rsync -avz --delete \
        "$ADMIN_REACT_DIR/dist/server/" \
        "$REMOTE_SERVER:/opt/admin-react-ssr/dist/server/"
    rsync -avz --delete \
        "$ADMIN_REACT_DIR/dist/client/index.html" \
        "$REMOTE_SERVER:/opt/admin-react-ssr/dist/client/"
    rsync -avz --delete \
        "$ADMIN_REACT_DIR/server/" \
        "$REMOTE_SERVER:/opt/admin-react-ssr/server/"

    # 同步 SPA 静态资源到 Nginx 目录
    ssh "$REMOTE_SERVER" "mkdir -p /var/www/admin-react/html"
    rsync -avz --delete \
        "$ADMIN_REACT_DIR/dist/client/" \
        "$REMOTE_SERVER:/var/www/admin-react/html/"

    # 复制 Nginx 配置
    scp "$PACKAGE_DIR/nginx.conf.example" \
        "$REMOTE_SERVER:/etc/nginx/sites-available/admin-react.conf"

    echo "  ✅ Files transferred"

    # ---- Step 4: 远程重启服务 ----
    echo "[4/4] Restarting services on remote server..."
    ssh "$REMOTE_SERVER" "

        # 检查并安装依赖
        if [ -f /opt/admin-react-ssr/package.json ]; then
            cd /opt/admin-react-ssr
            if [ ! -d node_modules ]; then
                echo '  📦 Installing production dependencies...'
                npm ci --production
            fi
        fi

        # 启动/重启 SSR (PM2)
        if command -v pm2 &>/dev/null; then
            if pm2 describe admin-react-ssr &>/dev/null 2>&1; then
                pm2 restart admin-react-ssr --update-env
                echo '  ✅ SSR restart via PM2'
            else
                pm2 start /opt/admin-react-ssr/server/index.js \
                    --name admin-react-ssr --time \
                    --env PORT=3000
                echo '  ✅ SSR started via PM2'
            fi
            pm2 save
        else
            echo '  ⚠️  PM2 not found. Install: npm install -g pm2'
        fi

        # Nginx 启用配置
        if [ -f /etc/nginx/sites-available/admin-react.conf ]; then
            ln -sf /etc/nginx/sites-available/admin-react.conf /etc/nginx/sites-enabled/ 2>/dev/null || true
            nginx -t && systemctl reload nginx || nginx -s reload || true
            echo '  ✅ Nginx reloaded'
        fi
    "
    echo "  ✅ Remote deployment complete"
else
    echo "[3/4] Skipping remote deployment (no --server specified)"
    echo "  💡 部署到远程: bash deploy.sh --server user@your-host.com"
    echo ""
    echo "[4/4] Skipping remote restart"
fi

echo ""
echo "============================================"
echo "  ✅ admin-react Deploy Complete!"
echo "============================================"
echo ""
echo "  📦 Package: $PACKAGE_DIR/releases/$PACKAGE_NAME"
echo ""
if [ -n "$REMOTE_SERVER" ]; then
    echo "  🌐 Server: $REMOTE_SERVER"
    echo "  📍 SPA:    http://$REMOTE_HOST/"
    echo "  📍 SSR:    http://$REMOTE_HOST:3000 (internal)"
    echo "  📍 API:    http://$REMOTE_HOST/wp-json/sap/v1/"
fi
echo ""
echo "  更多信息: cat README.md"
echo "============================================"
