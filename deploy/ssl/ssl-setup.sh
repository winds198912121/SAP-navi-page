#!/bin/bash
# ============================================================
# SAP パンダ先生 — Let's Encrypt SSL セットアップ
# 事前にドメインの DNS 設定が必要 (sap-panda.com → サーバーIP)
# ============================================================
set -e

DOMAIN="${1:-sap-panda.com}"
EMAIL="${2:-admin@panda-sensei.com}"

echo "===================================="
echo "  🔐 SSL Certificate Setup"
echo "  Domain: $DOMAIN"
echo "===================================="

# Certbot 確認
if ! command -v certbot &>/dev/null; then
    echo "  Installing certbot..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install certbot
    else
        sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx
    fi
fi

# Nginx 設定の確認
NGINX_CONF="/Users/howard/Desktop/pm/sap-panda/deploy/nginx/default.conf"
if [ ! -f "$NGINX_CONF" ]; then
    echo "  ❌ Nginx config not found: $NGINX_CONF"
    exit 1
fi

# SSL 証明書取得
echo ""
echo "  Obtaining certificate..."
sudo certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --redirect

echo ""
echo "  ✅ SSL certificate installed!"
echo "  Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "  Key:         /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo ""
echo "  Auto-renewal is enabled by default."
echo "  Test renewal: sudo certbot renew --dry-run"
