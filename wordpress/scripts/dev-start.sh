#!/bin/bash
# ============================================================
# SAP Panda Academy — 開発サーバー起動
# カスタム php.ini を読み込んで WordPress を起動
# ============================================================
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR" || exit 1

echo "🚀 SAP Panda Academy — 開発サーバー起動中..."
echo "   アドレス: http://localhost:8080"
echo "   php.ini:  $DIR/php.ini"
echo "   upload_max_filesize: 64M"
echo "   post_max_size: 128M"
echo ""

php -c "$DIR/php.ini" -S localhost:8080 -t .
