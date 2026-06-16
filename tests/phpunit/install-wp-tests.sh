#!/bin/bash
# WordPress Test Runner for SAP Panda
# Usage: bash tests/phpunit/install-wp-tests.sh <db_name> <db_user> <db_pass> [db_host]

DB_NAME=${1:-wordpress_test}
DB_USER=${2:-root}
DB_PASS=${3:-root}
DB_HOST=${4:-127.0.0.1}
WP_VERSION=${WP_VERSION:-latest}

# Download WordPress test suite
if [ ! -d /tmp/wordpress-tests-lib ]; then
    echo "Downloading WordPress test suite..."
    svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/includes/ /tmp/wordpress-tests-lib/includes
    svn co --quiet https://develop.svn.wordpress.org/tags/$WP_VERSION/tests/phpunit/data/ /tmp/wordpress-tests-lib/data
fi

# Create wp-tests-config.php
cat > /tmp/wordpress-tests-lib/wp-tests-config.php <<CONFIG
<?php
define( 'DB_NAME', '${DB_NAME}' );
define( 'DB_USER', '${DB_USER}' );
define( 'DB_PASSWORD', '${DB_PASS}' );
define( 'DB_HOST', '${DB_HOST}' );
define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Site' );
define( 'ABSPATH', '/tmp/wordpress/' );
CONFIG

# Download WordPress core
if [ ! -d /tmp/wordpress ]; then
    echo "Downloading WordPress core..."
    wp core download --path=/tmp/wordpress --version=$WP_VERSION --allow-root 2>/dev/null || \
    curl -sL "https://wordpress.org/wordpress-$WP_VERSION.tar.gz" | tar xz -C /tmp
fi

echo "Setup complete. Run: phpunit --configuration tests/phpunit/phpunit.xml"
