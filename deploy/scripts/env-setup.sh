#!/bin/bash
# ============================================================
# SAP パンダ先生 — 環境変数セットアップ
# 初回セットアップ時に 1 度だけ実行
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "===================================="
echo "  SAP パンダ先生 — Environment Setup"
echo "===================================="

# .env ファイルが存在するか確認
if [ -f "$PROJECT_DIR/.env" ]; then
    echo "  ✅ .env already exists"
else
    if [ -f "$PROJECT_DIR/.env.example" ]; then
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        echo "  ✅ Created .env from .env.example"
    else
        echo "  ⚠️  No .env.example found, creating basic .env"
        cat > "$PROJECT_DIR/.env" << 'ENVEOF'
# WordPress
WORDPRESS_DB_HOST=localhost
WORDPRESS_DB_USER=wpuser
WORDPRESS_DB_PASSWORD=wppass
WORDPRESS_DB_NAME=wordpress

# JWT
JWT_SECRET=change-this-to-a-random-secret-key

# AI (OpenAI-compatible)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# DeepSeek (optional)
DEEPSEEK_API_KEY=

# Site
SITE_URL=http://localhost
ADMIN_EMAIL=admin@panda-sensei.com
ENVEOF
        echo "  ✅ .env created"
    fi
fi

# JWT シークレットがデフォルトのままなら警告
if grep -q "change-this" "$PROJECT_DIR/.env" 2>/dev/null; then
    echo ""
    echo "  ⚠️  WARNING: JWT_SECRET is still default!"
    echo "  Generate a random key:"
    echo "    openssl rand -base64 32 | pbcopy"
fi

echo ""
echo "  Next steps:"
echo "  1. Edit .env with your settings"
echo "  2. Run ./start.sh to start services"
echo "  3. Visit http://localhost"
echo ""
