# SAP Panda Academy — 本番デプロイガイド

## サーバー構成

```
ドメイン: sap-panda.com (例)
サーバー: Linux (Ubuntu 22.04 LTS 推奨)
Web:     Nginx + PHP 8.3 FPM
DB:      MySQL 8
```

---

## 1. デプロイ対象ファイル一覧

| # | 対象 | ローカルパス | サーバー配置先 |
|---|------|-------------|---------------|
| 1 | **カスタムプラグイン** | `wordpress/wp-content/plugins/sap-panda-api/` | `/var/www/html/wp-content/plugins/sap-panda-api/` |
| 2 | **React SPA テーマ** | `admin-react/` → build → `wordpress/wp-content/themes/sap-panda/` | `/var/www/html/wp-content/themes/sap-panda/` |
| 3 | **Nginx 設定** | `deploy/nginx/default.conf` | `/etc/nginx/sites-available/sap-panda.conf` |
| 4 | **テーマ補助ファイル** | `wordpress/wp-content/themes/sap-panda/style.css`, `index.php`, `functions.php` | テーマと一緒に配置済み |

---

## 2. サーバー前提条件

```bash
# PHP 8.3+ (必須 extensions)
sudo apt install php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-gd php8.3-zip

# WordPress ファイル
# 既存の WordPress が /var/www/html/ にインストール済みであること
```

---

## 3. デプロイ手順

### Step 1 — ローカルで React SPA をビルド

```bash
cd admin-react
bash build.sh
# → wordpress/wp-content/themes/sap-panda/ に自動コピーされる
```

### Step 2 — サーバーにファイルをアップロード

**方法 A: rsync（推奨）**

```bash
# サーバー接続情報（環境に合わせて変更）
SERVER_USER=your-user
SERVER_HOST=sap-panda.com
SERVER_WP_PATH=/var/www/html

# カスタムプラグイン
rsync -avz --delete \
  wordpress/wp-content/plugins/sap-panda-api/ \
  $SERVER_USER@$SERVER_HOST:$SERVER_WP_PATH/wp-content/plugins/sap-panda-api/

# React SPA テーマ
rsync -avz --delete \
  wordpress/wp-content/themes/sap-panda/ \
  $SERVER_USER@$SERVER_HOST:$SERVER_WP_PATH/wp-content/themes/sap-panda/

# Nginx 設定
rsync -avz \
  deploy/nginx/default.conf \
  $SERVER_USER@$SERVER_HOST:/tmp/sap-panda-nginx.conf
```

**方法 B: GitHub + サーバー pull**

```bash
# サーバー上で
cd /var/www/html/wp-content/plugins
git clone <your-repo-url> sap-panda-api

cd /var/www/html/wp-content/themes
git clone <your-repo-url> sap-panda

# テーマはビルド済みの dist だけを配置
```

### Step 3 — WordPress 管理画面で有効化

1. **プラグイン** → 「SAP Panda API」を**有効化**
2. **外観 > テーマ** → 「SAP Panda Academy」を**有効化**

> ⚠️ **重要**: 「SAP Panda Academy」テーマを有効化すると、全フロントエンドページが React SPA になります。通常の WordPress 投稿/固定ページは表示されなくなります。必要に応じて child theme と併用してください。

### Step 4 — Nginx 設定

サーバー上の Nginx 設定を確認し、必要に応じて更新:

```bash
# 既存の WordPress 用 Nginx 設定があれば確認
cat /etc/nginx/sites-available/default

# 新しい設定を配置
sudo cp /tmp/sap-panda-nginx.conf /etc/nginx/sites-available/sap-panda.conf

# テスト
sudo nginx -t

# 再読み込み
sudo systemctl reload nginx
```

---

## 4. 本番用 Nginx 設定例

以下はサーバー用に調整した設定です（`deploy/nginx/production.conf` として保存済み）:

```nginx
upstream wordpress_php {
    server unix:/var/run/php/php8.3-fpm.sock;
}

server {
    listen 80;
    server_name sap-panda.com www.sap-panda.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sap-panda.com www.sap-panda.com;

    ssl_certificate     /etc/letsencrypt/live/sap-panda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sap-panda.com/privkey.pem;

    root /var/www/html/wp-content/themes/sap-panda;
    index index.html;

    # セキュリティヘッダー
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # ログ
    access_log /var/log/nginx/sap-panda-access.log;
    error_log  /var/log/nginx/sap-panda-error.log;

    # 静的アセット（強キャッシュ）
    location /assets/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location = /robots.txt { access_log off; }
    location = /sitemap.xml {
        proxy_pass http://wordpress_php/wp-json/sap/v1/sitemap;
        proxy_set_header Host $host;
    }

    # WordPress アセット
    location /wp-content/ {
        root /var/www/html;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location /wp-includes/ {
        root /var/www/html;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # WordPress REST API & Admin
    location /wp-admin/ {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /wp-json/ {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WordPress 認証系
    location ~ ^/(wp-login\.php|wp-signup\.php|wp-cron\.php|xmlrpc\.php) {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~ \.php$ {
        proxy_pass http://wordpress_php;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # React SPA ルーティング
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. WordPress 設定（wp-config.php）

サーバーの `wp-config.php` に以下を追加:

```php
define('WP_HOME', 'https://sap-panda.com');
define('WP_SITEURL', 'https://sap-panda.com');
define('JWT_AUTH_SECRET_KEY', 'your-random-secret-here');  // ローカルと別の値に
define('WP_POST_REVISIONS', 5);
```

> JWT_SECRET は `.env` に設定可能（Docker の場合）または wp-config.php に直接記述。

---

## 6. 初回デプロイ時のみ: データベースセットアップ

既存の WordPress にカスタム投稿タイプ・ACF フィールドを追加する場合:

```bash
# 方法 1: 管理画面で操作
# プラグイン有効化後に Custom Post Type UI と ACF の設定をインポート

# 方法 2: seed スクリプト（開発環境にデータがある場合）
# MySQL ダンプをリストア
mysql -u wordpress -p wordpress < backup/db_20260101_120000.sql
```

---

## 7. デプロイスクリプト（サーバー用）

`deploy/scripts/deploy-remote.sh`:

```bash
#!/bin/bash
# SAP Panda — リモートデプロイスクリプト
set -e

SERVER="user@sap-panda.com"
WP_PATH="/var/www/html"

echo "🚀 Deploying SAP Panda Academy..."

# Build
echo "[1/3] Building React..."
cd admin-react && bash build.sh

# Upload plugin
echo "[2/3] Uploading plugin..."
rsync -avz --delete ../wordpress/wp-content/plugins/sap-panda-api/ \
  $SERVER:$WP_PATH/wp-content/plugins/sap-panda-api/

# Upload theme
echo "[3/3] Uploading theme..."
rsync -avz --delete ../wordpress/wp-content/themes/sap-panda/ \
  $SERVER:$WP_PATH/wp-content/themes/sap-panda/

echo "✅ Deploy complete!"
echo "👉 WordPress管理画面でプラグイン・テーマを有効化してください"
```

---

## 8. 確認チェックリスト

- [ ] サーバーの PHP バージョンが 8.3 以上
- [ ] 必要な PHP extensions がインストール済み
- [ ] `wp-content/uploads/` のパーミッションが 755 / 644
- [ ] Nginx 設定で `client_max_body_size` が十分（ファイルアップロード用）
- [ ] `wp-config.php` の `WP_HOME` / `WP_SITEURL` が本番ドメイン
- [ ] JWT Secret が本番用のランダムな値
- [ ] HTTPS (Let's Encrypt) 設定済み
- [ ] カスタムプラグイン有効化後、REST API が応答する

```bash
# 動作確認
curl -s https://sap-panda.com/wp-json/sap/v1 | head
curl -s -o /dev/null -w "%{http_code}" https://sap-panda.com/
curl -s -o /dev/null -w "%{http_code}" https://sap-panda.com/wp-admin/
```

---

## 9. ロールバック手順

```bash
# テーマ切り替え
wp theme activate twentytwentyfive

# プラグイン無効化
wp plugin deactivate sap-panda-api

# 以前のバックアップからリストア
mysql -u wordpress -p wordpress < deploy/backup/db_20260101_120000.sql

# デプロイ前の状態に戻す
rsync -avz --delete backup/themes/sap-panda/ /var/www/html/wp-content/themes/sap-panda/
```
