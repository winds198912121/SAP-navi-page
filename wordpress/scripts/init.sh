#!/bin/bash
# SAP Panda - WordPress Initialization Script
# Run inside the WordPress container: docker exec sap-panda-wordpress bash /scripts/init.sh

set -e

echo "=== SAP Panda WordPress Initialization ==="

# Wait for DB
echo "Waiting for database..."
until mysqladmin ping -h db -u wordpress -pwordpress --silent 2>/dev/null; do
    sleep 2
done
echo "Database ready!"

# Check if WP is installed
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "Installing WordPress..."
    wp core install \
        --url="http://localhost:8080" \
        --title="SAP パンダ先生" \
        --admin_user="admin" \
        --admin_password="admin123" \
        --admin_email="admin@panda-sensei.com" \
        --allow-root
fi

# Set permalink structure
wp rewrite structure '/%postname%/' --allow-root
wp rewrite flush --allow-root

# Activate plugins
echo "Activating plugins..."
wp plugin activate sap-panda-api --allow-root 2>/dev/null || echo "Plugin activation skipped (manual)"
wp plugin activate advanced-custom-fields-pro --allow-root 2>/dev/null || echo "ACF PRO not found"

# Set theme
echo "Setting theme..."
wp theme activate panda-sensei-child --allow-root 2>/dev/null || echo "Child theme not found yet"

# Create sample content
echo "Creating sample content..."

# Sample article
SAMPLE_POST=$(wp post create \
    --post_title="仕訳のしくみ — 借方・貸方を一発で覚える" \
    --post_content="<p>SAPの会計画面で「借方」「貸方」という言葉を見て、いつも左右どっちだっけ？と迷っていませんか？</p><p>この記事では、たった一つのルールで仕訳をマスターする方法を紹介します。</p>" \
    --post_status="publish" \
    --post_author=1 \
    --allow-root \
    --porcelain 2>/dev/null || echo "1")

# Set terms
wp post term set $SAMPLE_POST sap_module fi --allow-root 2>/dev/null || true
wp post term set $SAMPLE_POST difficulty beginner --allow-root 2>/dev/null || true
wp post term set $SAMPLE_POST topic basic --allow-root 2>/dev/null || true

echo "=== Done! ==="
echo "WordPress admin: http://localhost:8080/wp-admin"
echo "Username: admin / Password: admin123"
