#!/bin/bash
# ============================================================
# SAP パンダ先生 — Production Server SSR Setup
# 本番サーバーで 1 度だけ実行する SSR 環境セットアップ
#
# 使用方法:
#   ssh root@sap-panda.com
#   bash setup-ssr.sh
# ============================================================
set -e

echo "============================================"
echo "  🐼 SAP Panda Academy — SSR Server Setup"
echo "============================================"

SSR_USER="${SSR_USER:-www-data}"
SSR_DIR="/opt/sap-panda-ssr"
SSR_PORT="${SSR_PORT:-3000}"

# --------------------------------------------------
# 1. Node.js インストール (v20 LTS)
# --------------------------------------------------
echo ""
echo "[1/5] Installing Node.js 20 LTS..."
if command -v node &>/dev/null && node --version | grep -q "v20"; then
    echo "  ✅ Node.js $(node --version) already installed"
else
    # NodeSource からインストール
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "  ✅ Node.js $(node --version) installed"
fi

# --------------------------------------------------
# 2. PM2 インストール
# --------------------------------------------------
echo ""
echo "[2/5] Installing PM2..."
if command -v pm2 &>/dev/null; then
    echo "  ✅ PM2 $(pm2 --version) already installed"
else
    npm install -g pm2
    echo "  ✅ PM2 installed"
fi

# --------------------------------------------------
# 3. SSR ディレクトリ作成
# --------------------------------------------------
echo ""
echo "[3/5] Creating SSR directory..."
mkdir -p "$SSR_DIR"
chown -R "$SSR_USER":"$SSR_USER" "$SSR_DIR"
echo "  ✅ $SSR_DIR created"

# --------------------------------------------------
# 4. PM2 起動設定 (systemd)
# --------------------------------------------------
echo ""
echo "[4/5] Configuring PM2 startup..."
pm2 startup systemd -u "$SSR_USER" --hp "/home/$SSR_USER" 2>&1 || {
    # www-data はホームディレクトリがない場合がある
    pm2 startup systemd || true
}
env PATH=\$PATH:/usr/bin pm2 startup systemd -u "$SSR_USER" --hp "/var/www" 2>&1 || true
echo "  ✅ PM2 startup configured"

# --------------------------------------------------
# 5. Nginx 設定確認
# --------------------------------------------------
echo ""
echo "[5/5] Checking Nginx..."
if command -v nginx &>/dev/null; then
    echo "  ✅ Nginx $(nginx -v 2>&1) found"
    echo "  ⚠️  Please update /etc/nginx/sites-available/sap-panda"
    echo "     with the SSR configuration from:"
    echo "     deploy/nginx/production.conf"
    echo ""
else
    echo "  ⚠️  Nginx not found. Install first:"
    echo "     apt-get install nginx"
fi

echo ""
echo "============================================"
echo "  ✅ SSR Server Setup Complete!"
echo "============================================"
echo ""
echo "  SSR ディレクトリ : $SSR_DIR"
echo "  SSR ポート       : $SSR_PORT"
echo ""
echo "  デプロイ手順:"
echo "  ----------------------------------------------"
echo "  1. ローカルでビルド:  cd admin-react && npm run build:ssr"
echo "  2. サーバーに転送:"
echo "     rsync -avz dist/server/ $SSR_USER@server:$SSR_DIR/dist/server/"
echo "     rsync -avz dist/client/index.html $SSR_USER@server:$SSR_DIR/dist/client/"
echo "     rsync -avz server/ $SSR_USER@server:$SSR_DIR/server/"
echo "     rsync -avz node_modules $SSR_USER@server:$SSR_DIR/"
echo "  3. SSR 起動:        pm2 start $SSR_DIR/server/index.js --name sap-panda-ssr"
echo "  4. 保存:            pm2 save"
echo "  5. Nginx 再読み込み: systemctl reload nginx"
echo "  ----------------------------------------------"
echo ""
