#!/bin/bash
# ============================================================
# SAP パンダ先生 — React プロダクションビルド & WordPress テーマ反映
# 客户端构建 → 服务端 SSR 构建 → 复制到 WordPress 主题
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$SCRIPT_DIR/../wordpress/wp-content/themes/sap-panda"

echo "============================================"
echo "  SAP Panda Academy — Full Build"
echo "============================================"

# --------------------------------------------------
# Step 1: 清理旧构建
# --------------------------------------------------
echo ""
echo "🧹 Cleaning old builds..."
rm -rf "$SCRIPT_DIR/dist"

# --------------------------------------------------
# Step 2: 安装依赖
# --------------------------------------------------
echo ""
echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm ci

# --------------------------------------------------
# Step 3: 构建客户端包 (CSR)
# --------------------------------------------------
echo ""
echo "🔨 Building client bundle..."
npm run build

# --------------------------------------------------
# Step 4: 构建服务端包 (SSR)
# --------------------------------------------------
echo ""
echo "🖥️  Building SSR server bundle..."
npx vite build --ssr src/entry-server.tsx --outDir dist/server

echo ""
echo "   Client bundle:  dist/client/"
echo "   Server bundle:  dist/server/"

# --------------------------------------------------
# Step 5: 复制到 WordPress 主题 (仅客户端资源)
# --------------------------------------------------
echo ""
echo "📂 Copying client assets to WordPress theme ($THEME_DIR)..."
rm -rf "$THEME_DIR/assets"
mkdir -p "$THEME_DIR/assets"
cp -R "$SCRIPT_DIR/dist/client/"* "$THEME_DIR/"
# assets/ 以下に JS/CSS が入っていることを確認
echo "   Theme assets:"
ls -la "$THEME_DIR/assets/" 2>/dev/null || echo "   (no assets/)"

echo ""
echo "✅ Full build complete!"
echo "   Client output:  $SCRIPT_DIR/dist/client"
echo "   Server output:  $SCRIPT_DIR/dist/server"
echo "   Theme assets:   $THEME_DIR/assets"
echo "   Size:           $(du -sh "$SCRIPT_DIR/dist" | awk '{print $1}')"
echo ""
echo "👉 WordPress 管理画面 → 外観 > テーマ で「SAP Panda Academy」を有効化してください"
echo "👉 SSR 服务端启动: node $SCRIPT_DIR/server/index.js  (PORT=3000)"
