#!/bin/bash
# ============================================================
# SAP Panda Academy — react_next (Next.js SSR) 一键部署脚本
#
# 功能:
#   1. 构建 Next.js standalone
#   2. 打包为发布包 (ZIP)
#   3. 可选: Docker ビルド & 起動
#   4. 可选: rsync 到远程服务器
#
# 使用方法:
#   bash deploy.sh                          # 构建并打包
#   bash deploy.sh --docker                 # 构建 + Docker Compose 启动
#   bash deploy.sh --server user@host       # 构建 + rsync 远程部署
#   bash deploy.sh --skip-build             # 跳过构建，只打包
#   bash deploy.sh --help                   # 显示帮助
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
NEXT_DIR="$PROJECT_DIR/react_next"
PACKAGE_DIR="$SCRIPT_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="react-next-ssr-${TIMESTAMP}.zip"

# ---- 解析参数 ----
SKIP_BUILD=false
DOCKER_DEPLOY=false
REMOTE_SERVER=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-build) SKIP_BUILD=true; shift ;;
        --docker) DOCKER_DEPLOY=true; shift ;;
        --server) REMOTE_SERVER="$2"; shift 2 ;;
        --help|-h)
            echo "用法: bash deploy.sh [选项]"
            echo ""
            echo "选项:"
            echo "  --skip-build     跳过构建, 只打包已存在的 .next/"
            echo "  --docker         构建后启动 Docker Compose"
            echo "  --server <host>  构建后 rsync 远程部署 (standalone)"
            echo "  --help, -h       显示此帮助"
            exit 0
            ;;
        *) echo "未知参数: $1"; exit 1 ;;
    esac
done

echo "============================================"
echo "  🐼 SAP Panda Academy — Next.js SSR Deploy"
echo "============================================"
echo ""

# ---- Step 1: 构建 ----
if [ "$SKIP_BUILD" = false ] && [ "$DOCKER_DEPLOY" = false ]; then
    echo "[1/4] Building Next.js standalone..."
    cd "$NEXT_DIR"

    # 依赖检查
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing dependencies..."
        npm ci
    fi

    npm run build
    echo "  ✅ Build complete"
    echo "     .next/standalone/ ($(du -sh .next/standalone | awk '{print $1'}))"
    echo "     .next/static/ ($(du -sh .next/static | awk '{print $1'}))"

elif [ "$DOCKER_DEPLOY" = true ]; then
    # Docker デプロイ（Dockerfile 内でビルド）
    echo "[1/4] Docker build & deploy selected (build happens inside Docker)"
    SKIP_BUILD=true
else
    echo "[1/4] Skipping build (--skip-build)..."
    if [ ! -d "$NEXT_DIR/.next" ]; then
        echo "  ❌ .next/ not found. Run next build first or remove --skip-build"
        exit 1
    fi
fi
echo ""

# ---- Step 2: 打包 ----
if [ "$DOCKER_DEPLOY" = false ]; then
    echo "[2/4] Creating deployment package..."
    cd "$NEXT_DIR"
    mkdir -p "$PACKAGE_DIR/releases"

    BUILD_DIR=$(mktemp -d)
    trap "rm -rf '$BUILD_DIR'" EXIT

    mkdir -p "$BUILD_DIR/react-next-ssr/deploy"
    mkdir -p "$BUILD_DIR/react-next-ssr/.next"

    # 复制 standalone (server.js + node_modules + .next)
    if [ -d ".next/standalone" ]; then
        cp -R .next/standalone/* "$BUILD_DIR/react-next-ssr/"
        # standalone 内の .next が不完全な可能性があるので static を上書き
    fi

    # 复制 public/（Static ファイル）
    if [ -d "public" ]; then
        cp -R public "$BUILD_DIR/react-next-ssr/"
    fi

    # 复制 .next/static（ブラウザ用 JS/CSS）
    if [ -d ".next/static" ]; then
        mkdir -p "$BUILD_DIR/react-next-ssr/.next"
        cp -R .next/static "$BUILD_DIR/react-next-ssr/.next/"
    fi

    # 复制部署辅助文件
    cp "$PACKAGE_DIR/README.md" "$BUILD_DIR/react-next-ssr/"
    cp "$PACKAGE_DIR/nginx.conf.example" "$BUILD_DIR/react-next-ssr/deploy/"
    cp "$PACKAGE_DIR/.env.example" "$BUILD_DIR/react-next-ssr/deploy/"

    # 复制 Dockerfile
    cp "$NEXT_DIR/Dockerfile" "$BUILD_DIR/react-next-ssr/deploy/"

    # 创建 ZIP 包
    cd "$BUILD_DIR"
    zip -r "$PACKAGE_DIR/releases/$PACKAGE_NAME" react-next-ssr/ -x "*/node_modules/*" -x "*.git*" > /dev/null
    echo "  ✅ Package created: $PACKAGE_DIR/releases/$PACKAGE_NAME"
    echo "     Size: $(du -h "$PACKAGE_DIR/releases/$PACKAGE_NAME" | awk '{print $1')})"
    echo ""
else
    echo "[2/4] Skipping archive packaging (Docker mode selected)"
    echo ""
fi

# ---- Docker Compose デプロイ ----
if [ "$DOCKER_DEPLOY" = true ]; then
    echo "[3/4] Deploying via Docker Compose..."

    cd "$PROJECT_DIR"
    if [ -f .env ]; then
        set -a; source .env; set +a
    fi

    docker compose -f docker-compose.nextjs.yml build --pull
    docker compose -f docker-compose.nextjs.yml up -d --remove-orphans
    docker image prune -f

    echo "  ✅ Docker Compose deployed"

    # ヘルスチェック
    echo ""
    echo "[4/4] Running health check..."
    sleep 5
    if curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ 2>/dev/null | grep -q 200; then
        echo "  ✅ Health check passed"
        echo ""
        echo "  🌐 http://localhost:3000/"
    else
        echo "  ⚠️  Health check failed. Check logs:"
        docker compose -f docker-compose.nextjs.yml logs --tail=20 nextjs
    fi

# ---- 远程 rsync 部署 ----
elif [ -n "$REMOTE_SERVER" ]; then
    echo "[3/4] Deploying to $REMOTE_SERVER..."

    # 创建远程目录
    ssh "$REMOTE_SERVER" "mkdir -p /opt/sap-panda-nextjs"

    # 同步 standalone
    rsync -avz --delete \
        "$NEXT_DIR/.next/standalone/" \
        "$REMOTE_SERVER:/opt/sap-panda-nextjs/"

    # 同步 public 和 static
    rsync -avz --delete \
        "$NEXT_DIR/public/" \
        "$REMOTE_SERVER:/opt/sap-panda-nextjs/public/"
    rsync -avz --delete \
        "$NEXT_DIR/.next/static" \
        "$REMOTE_SERVER:/opt/sap-panda-nextjs/.next/"

    # 复制 Nginx 配置
    scp "$PACKAGE_DIR/nginx.conf.example" \
        "$REMOTE_SERVER:/etc/nginx/sites-available/sap-panda-nextjs"

    echo "  ✅ Files transferred"

    # ---- Step 4: 远程服务重启 ----
    echo "[4/4] Restarting services on remote server..."
    ssh "$REMOTE_SERVER" "
        if command -v pm2 &>/dev/null; then
            cd /opt/sap-panda-nextjs
            if pm2 describe sap-panda-nextjs &>/dev/null 2>&1; then
                pm2 restart sap-panda-nextjs --update-env
            else
                pm2 start server.js \\
                    --name sap-panda-nextjs --time \\
                    --env PORT=3000 \\
                    --env NEXT_PUBLIC_WP_URL=https://sap-navi.aladdin-techec.com \\
                    --env NEXT_PUBLIC_API_BASE=https://sap-navi.aladdin-techec.com/wp-json/sap/v1 \\
                    --env NEXT_PUBLIC_SITE_URL=$REMOTE_HOST
            fi
            pm2 save
            echo '  ✅ Next.js SSR restarted via PM2'
        else
            echo '  ⚠️  PM2 not found'
        fi

        # Nginx
        ln -sf /etc/nginx/sites-available/sap-panda-nextjs /etc/nginx/sites-enabled/ 2>/dev/null || true
        nginx -t && systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
        echo '  ✅ Nginx reloaded'
    "
    echo "  ✅ Remote deployment complete"

else
    echo "[3/4] Skipping Docker / remote deploy"
    echo "  💡 Docker deploy:   bash deploy.sh --docker"
    echo "  💡 Remote deploy:   bash deploy.sh --server user@host"
    echo ""
    echo "[4/4] Skipping service restart"
fi

echo ""
echo "============================================"
echo "  ✅ Next.js SSR Deploy Complete!"
echo "============================================"
echo ""

if [ -n "$REMOTE_SERVER" ]; then
    echo "  🌐 Server: $REMOTE_SERVER"
    echo "  📍 SSR:    http://$(echo $REMOTE_SERVER | cut -d@ -f2):3000"
    echo ""
fi

if [ "$DOCKER_DEPLOY" = true ]; then
    echo "  📍 Docker: http://localhost:3000"
    echo ""
fi

if [ "$DOCKER_DEPLOY" = false ] && [ -z "$REMOTE_SERVER" ]; then
    echo "  次のステップ:"
    echo "  📦 Package: $PACKAGE_DIR/releases/$PACKAGE_NAME"
    echo "  🐳 Docker:  bash deploy.sh --docker"
    echo "  🌐 Remote:  bash deploy.sh --server user@your-server.com"
    echo ""
fi

echo "  詳細: cat README.md"
echo "============================================"
