#!/bin/bash
# ============================================================
# Aladdin テーマ単体デプロイスクリプト
# aladdin_theme → 本番サーバー rsync
#
# 使用方法:
#   1. deploy/config/remote.env にサーバー情報を設定
#   2. bash deploy/scripts/deploy-aladdin.sh
#
# 注意: sap-panda-api プラグインがサーバーにインストール済みであること
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
# ============================================================
REMOTE_SERVER="your-server.com"
REMOTE_USER="root"
REMOTE_WP_PATH="/var/www/html"
REMOTE_PORT="22"
EOF
    echo "  ✅ Template created at $CONFIG_FILE"
    echo "  ✏️  Please edit $CONFIG_FILE and re-run this script."
    exit 1
fi

# 必須チェック
if [ -z "$REMOTE_SERVER" ] || [ "$REMOTE_SERVER" = "your-server.com" ]; then
    echo "  ❌ Please set REMOTE_SERVER in $CONFIG_FILE"
    exit 1
fi

SERVER="$REMOTE_USER@$REMOTE_SERVER"
RSYNC_OPTS="-avz --delete --delete-excluded --exclude='.DS_Store' --exclude='*.map' -e 'ssh -p $REMOTE_PORT'"

echo ""
echo "============================================"
echo " Aladdin Theme Deploy"
echo " Target: $SERVER"
echo " Path:   $REMOTE_WP_PATH/wp-content/themes/aladdin"
echo "============================================"
echo ""

# --------------------------------------------------
# 1. SSH 接続確認
# --------------------------------------------------
echo "[1/3] Testing SSH connection..."
ssh -p "$REMOTE_PORT" -o ConnectTimeout=5 "$SERVER" "echo OK" || { echo "  ❌ SSH connection failed"; exit 1; }
echo "  ✅ SSH connection OK"
echo ""

# --------------------------------------------------
# 2. テーマをデプロイ
# --------------------------------------------------
echo "[2/3] Deploying aladdin theme..."
eval rsync $RSYNC_OPTS \
  "$PROJECT_DIR/aladdin_theme/" \
  "$SERVER:$REMOTE_WP_PATH/wp-content/themes/aladdin/"
echo "  ✅ Aladdin theme deployed"
echo ""

# --------------------------------------------------
# 3. パーミッション修正
# --------------------------------------------------
echo "[3/3] Fixing permissions..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    chown -R www-data:www-data $REMOTE_WP_PATH/wp-content/themes/aladdin 2>/dev/null || true
    find $REMOTE_WP_PATH/wp-content/themes/aladdin -type d -exec chmod 755 {} \\; 2>/dev/null || true
    find $REMOTE_WP_PATH/wp-content/themes/aladdin -type f -exec chmod 644 {} \\; 2>/dev/null || true
"
echo "  ✅ Permissions fixed"
echo ""

echo "============================================"
echo " 🎉 Deploy complete!"
echo ""
echo "    WordPress管理画面から Aladdin テーマを有効化:"
echo "    外観 → テーマ → Aladdin SAP Panda → 有効化"
echo ""
echo "    注意: 有効化後、設定 → 固定リンク設定 で"
echo "    「変更を保存」をクリックしてルーティングを更新してください。"
echo "============================================"
