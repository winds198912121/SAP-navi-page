#!/bin/bash
# ============================================================
# SAP パンダ先生 — React プロダクションビルド & WordPress テーマ反映
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$SCRIPT_DIR/../wordpress/wp-content/themes/sap-panda"

echo "🧹 Cleaning old build..."
rm -rf "$SCRIPT_DIR/dist"

echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm ci

echo "🔨 Building for production..."
npm run build

echo ""
echo "📂 Copying to WordPress theme ($THEME_DIR)..."
# テーマの assets/ をクリアして新しいビルドをコピー
rm -rf "$THEME_DIR/assets"
cp -R "$SCRIPT_DIR/dist/"* "$THEME_DIR/"
# assets/ 以下に JS/CSS が入っていることを確認
echo "   Theme assets:"
ls -la "$THEME_DIR/assets/" 2>/dev/null || echo "   (no assets/)"

echo ""
echo "✅ Build complete!"
echo "   Output:         $SCRIPT_DIR/dist"
echo "   Theme:          $THEME_DIR"
echo "   Size:           $(du -sh "$SCRIPT_DIR/dist" | awk '{print $1}')"
echo ""
echo "👉 WordPress 管理画面 → 外観 > テーマ で「SAP Panda Academy」を有効化してください"
