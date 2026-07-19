#!/bin/bash
# ============================================================
# SAP Panda Next.js — Standalone SSR Server Setup
#
# Next.js SSR をデプロイするサーバーで 1 度だけ実行する
# 初期セットアップスクリプト。
#
# 使用方法:
#   ssh root@your-server.com
#   curl -fsSL https://raw.githubusercontent.com/.../setup-nextjs-standalone.sh | bash
#   または:
#   bash deploy/scripts/setup-nextjs-standalone.sh
# ============================================================
set -e

echo "============================================"
echo "  🐼 SAP Panda Academy"
echo "  Next.js SSR — Server Setup"
echo "============================================"

# ---- 1. Docker インストール ----
echo ""
echo "[1/5] Installing Docker..."
if command -v docker &>/dev/null; then
    echo "  ✅ Docker $(docker --version) installed"
else
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
    echo "  ✅ Docker installed"
fi

# ---- 2. Docker Compose v2 確認 ----
echo ""
echo "[2/5] Checking Docker Compose..."
if docker compose version &>/dev/null; then
    echo "  ✅ Docker Compose $(docker compose version | head -1)"
else
    echo "  ❌ Docker Compose v2 not found. Update Docker to 20.10+"
    exit 1
fi

# ---- 3. アプリケーションディレクトリ作成 ----
echo ""
echo "[3/5] Creating application directories..."
DEPLOY_DIR="/opt/sap-panda-nextjs"
mkdir -p "$DEPLOY_DIR/deploy/nginx"
mkdir -p "$DEPLOY_DIR/deploy/scripts"
mkdir -p "$DEPLOY_DIR/deploy/ssl"
echo "  ✅ $DEPLOY_DIR created"

# ---- 4. ファイアウォール設定 ----
echo ""
echo "[4/5] Configuring firewall..."
if command -v ufw &>/dev/null; then
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw --force enable 2>/dev/null || true
    echo "  ✅ UFW configured (SSH, HTTP, HTTPS)"
elif command -v firewall-cmd &>/dev/null; then
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload 2>/dev/null || true
    echo "  ✅ firewalld configured"
else
    echo "  ⚠️  No firewall tool found (UFW/firewalld). Configure manually."
fi

# ---- 5. Docker 自動起動 ----
echo ""
echo "[5/5] Configuring Docker auto-start..."
systemctl enable docker 2>/dev/null || true
echo "  ✅ Docker auto-start enabled"

echo ""
echo "============================================"
echo "  ✅ Server Setup Complete!"
echo "============================================"
echo ""
echo "  Next.js デプロイ手順:"
echo "  ----------------------------------------------"
echo "  1. ローカルからデプロイ:"
echo "     bash deploy/scripts/deploy-nextjs-standalone.sh"
echo ""
echo "  2. Nginx をフロントに配置（推奨）:"
echo "     設定ファイル: $DEPLOY_DIR/deploy/nginx/nginx.nextjs-standalone.conf"
echo "     sudo ln -sf $DEPLOY_DIR/deploy/nginx/nginx.nextjs-standalone.conf /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  3. SSL 証明書（Let's Encrypt）:"
echo "     sudo apt install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d your-nextjs-domain.com"
echo ""
echo "  4. 動作確認:"
echo "     curl -sI http://localhost:3000/"
echo "     curl -s http://localhost:3000/wp-json/sap/v1/ | head"
echo "============================================"
