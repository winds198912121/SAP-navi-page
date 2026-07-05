#!/bin/bash
# ============================================================
# SAP Panda Next.js — デプロイスクリプト
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$PROJECT_DIR/deploy/config/remote.env"

REMOTE_SERVER=""
REMOTE_USER="root"
REMOTE_PORT="22"
REMOTE_NEXT_PATH="/opt/sap-panda-next"

if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

if [ -z "$REMOTE_SERVER" ] || [ "$REMOTE_SERVER" = "your-server.com" ]; then
    echo "❌ Please set REMOTE_SERVER in $CONFIG_FILE"
    exit 1
fi

SERVER="$REMOTE_USER@$REMOTE_SERVER"
echo "============================================"
echo " SAP Panda Next.js Deploy"
echo " Target: $SERVER:$REMOTE_NEXT_PATH"
echo "============================================"

# Build
echo "[1/4] Building Next.js app..."
cd "$PROJECT_DIR/react_next"
npm ci --omit=dev
npm run build

# Copy to server
echo "[2/4] Copying to server..."
ssh -p "$REMOTE_PORT" "$SERVER" "mkdir -p $REMOTE_NEXT_PATH"

rsync -avz --delete \
  --exclude='.next/cache' \
  --exclude='node_modules/.cache' \
  --exclude='src' \
  --exclude='.env*' \
  -e "ssh -p $REMOTE_PORT" \
  "$PROJECT_DIR/react_next/" \
  "$SERVER:$REMOTE_NEXT_PATH/"

# Install production deps on server
echo "[3/4] Installing production dependencies..."
ssh -p "$REMOTE_PORT" "$SERVER" "cd $REMOTE_NEXT_PATH && npm ci --omit=dev"

# Start with PM2
echo "[4/4] Starting/running with PM2..."
ssh -p "$REMOTE_PORT" "$SERVER" "
    cd $REMOTE_NEXT_PATH
    pm2 describe sap-panda-next > /dev/null 2>&1 && pm2 restart sap-panda-next || pm2 start npm --name sap-panda-next -- start
    pm2 save
"

echo ""
echo "✅ Deploy complete!"
echo "   PM2 process: sap-panda-next"
echo "   Next.js running on: http://localhost:3000"
echo ""
echo "   Nginx reverse proxy example:"
echo "   location / {"
echo "       proxy_pass http://127.0.0.1:3000;"
echo "       proxy_set_header Host \$host;"
echo "   }"
echo ""
echo "   WordPress API proxy (next.config.ts):"
echo "   - Development: NEXT_PUBLIC_WP_URL for rewrites"
echo "   - Production: Set NEXT_PUBLIC_API_BASE to actual WP URL"
