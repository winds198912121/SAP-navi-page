# ============================================================
# SAP Panda Next.js — Standalone SSR Deployment Guide
#
# WordPress: https://sap-navi.aladdin-techec.com（既存）
# Next.js: 独立した SSR サービスとして新規サーバーにデプロイ
# ============================================================

> **対象読者**: サーバー管理者  
> **更新日**: 2026-07-18  
> **対応バージョン**: SAP Panda Academy v3.0（Next.js SSR 版）  

---

## 目次

1. [システム概要](#1-システム概要)
2. [前提条件](#2-前提条件)
3. [デプロイ方式の比較](#3-デプロイ方式の比較)
4. [Docker デプロイ（推奨）](#4-docker-デプロイ推奨)
5. [PM2 デプロイ（Docker 不使用）](#5-pm2-デプロイdocker-不使用)
6. [Nginx 設定](#6-nginx-設定)
7. [SSL / HTTPS 設定](#7-ssl--https-設定)
8. [環境変数一覧](#8-環境変数一覧)
9. [動作確認](#9-動作確認)
10. [運用・トラブルシューティング](#10-運用トラブルシューティング)
11. [ロールバック手順](#11-ロールバック手順)
12. [付録: ファイル構成](#12-付録ファイル構成)

---

## 1. システム概要

### アーキテクチャ図

```
                    ┌──────────────────────────┐
                    │  インターネット           │
                    └──────────┬───────────────┘
                               │
                    ┌──────────▼───────────────┐
                    │  Nginx (リバースプロキシ) │  ← SSL終端、静的キャッシュ
                    │  Port 80 / 443           │
                    └──────────┬───────────────┘
                               │
                    ┌──────────▼───────────────┐
                    │  Next.js SSR             │  ← 全ページサーバーサイドレンダリング
                    │  Port 3000               │
                    │  (Docker または PM2)     │
                    └──────────┬───────────────┘
                               │ (Server Components から直接 fetch)
                    ┌──────────▼───────────────┐
                    │  WordPress REST API      │  ← 既存サーバー
                    │  https://sap-navi.       │
                    │  aladdin-techec.com      │
                    │  /wp-json/sap/v1/        │
                    └──────────────────────────┘
```

### データフロー

1. **ブラウザアクセス**: ユーザーが `https://your-nextjs-domain.com/` にアクセス
2. **Nginx**: SSL終端、静的アセットキャッシュ、Next.js へプロキシ
3. **Next.js SSR**: リクエストを受けてサーバーサイドで React をレンダリング
4. **Server Components**: `Server Components` から WordPress REST API (`https://sap-navi.aladdin-techec.com/wp-json/sap/v1/`) へ直接 fetch
5. **HTML 応答**: 完全な HTML をブラウザに返却
6. **クライアント**: クライアントサイドの JS がハイドレーション。以降は Client Components が相対パス `/wp-json/` で API を呼び出し、next.config.js の rewrites がリモート WordPress へプロキシ

### ポイント

- **Next.js 単独デプロイ**: WordPress とは完全に分離。WordPress は `sap-navi.aladdin-techec.com` で稼働中
- **全リクエスト SSR**: ボット判定不要。すべてのリクエストでサーバーサイドレンダリング → SEO 完全対応
- **rewrites プロキシ**: `next.config.js` の `rewrites` 機能でクライアントからの `/wp-json/` リクエストをリモート WordPress へプロキシ

---

## 2. 前提条件

### Next.js サーバー要件

| 項目 | 最小 | 推奨 |
|------|------|------|
| CPU | 2 vCPU | 4 vCPU |
| メモリ | 2 GB | 4 GB |
| ディスク | 10 GB SSD | 20 GB SSD |
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 |
| Docker | 24+（Dockerデプロイ時） | 26+ |
| Node.js | 20 LTS（PM2デプロイ時） | 20 LTS |

### 既存 WordPress サーバー

- ドメイン: `https://sap-navi.aladdin-techec.com`
- REST API: `https://sap-navi.aladdin-techec.com/wp-json/sap/v1/`
- CORS 設定: WordPress 側で Next.js ドメインからのリクエストを許可する必要があります

### CORS 設定（WordPress 側）

WordPress サーバーの `functions.php` またはカスタムプラグインで以下を追加:

```php
// WordPress 側で Next.js からの API リクエストを許可
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = ['https://your-nextjs-domain.com', 'http://localhost:3000'];
        if (in_array($origin, $allowed)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        }
        return $value;
    });
});
```

または、JWT Authentication プラグインの設定で CORS を有効化:

```php
define('JWT_AUTH_CORS_ENABLE', true);
```

---

## 3. デプロイ方式の比較

| 方式 | 難易度 | メンテナンス | 推奨用途 |
|------|--------|-------------|---------|
| **Docker Compose** | 低 | 簡単 | 🥇 **本番推奨** |
| **PM2 + Nginx** | 中 | やや複雑 | 小規模サーバー・検証 |

両方式とも `next.config.js` の `output: 'standalone'` を使用します。

---

## 4. Docker デプロイ（推奨）

### 4.1 サーバー初期セットアップ（初回のみ）

```bash
# サーバーに SSH 接続
ssh root@your-nextjs-server.com

# セットアップスクリプトを実行（Docker インストール等）
# 方法 A: プロジェクトから
bash /path/to/deploy/scripts/setup-nextjs-standalone.sh

# 方法 B: 手動
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker
```

### 4.2 ローカルビルドとデプロイ

```bash
# === ローカル開発環境で実行 ===

# 1. リポジトリのルートで
cd /path/to/sap-panda

# 2. デプロイ設定ファイルを作成（テンプレートからコピー）
cp deploy/config/remote.env.example deploy/config/remote.env
# 内容を編集してサーバー情報を設定
vi deploy/config/remote.env

# 3. デプロイ実行
bash deploy/scripts/deploy-nextjs-standalone.sh
```

### 4.3 手動デプロイ（スクリプト不使用）

```bash
# === ローカルでビルド ===
cd react_next

# Docker ビルド
docker build -t sap-panda-nextjs:latest .

# タグ付けしてレジストリにプッシュ（任意）
docker tag sap-panda-nextjs:latest your-registry/sap-panda-nextjs:latest
docker push your-registry/sap-panda-nextjs:latest

# === サーバーで実行 ===
ssh root@your-nextjs-server.com

# docker-compose.nextjs.yml をサーバーに転送
# サーバー上で起動
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml up -d
```

### 4.4 docker-compose.nextjs.yml の詳細

プロジェクトルートの `docker-compose.nextjs.yml` は Next.js コンテナのみを定義:

```yaml
services:
  nextjs:
    build:
      context: ./react_next
      dockerfile: Dockerfile
    image: sap-panda-nextjs:latest
    container_name: sap-panda-nextjs
    ports:
      - "${NEXTJS_PORT:-3000}:3000"
    environment:
      NEXT_PUBLIC_WP_URL: https://sap-navi.aladdin-techec.com
      NEXT_PUBLIC_API_BASE: https://sap-navi.aladdin-techec.com/wp-json/sap/v1
      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-https://sap-navi.aladdin-techec.com}
      NEXT_PUBLIC_GA_ID: ${NEXT_PUBLIC_GA_ID:-}
    restart: unless-stopped
```

---

## 5. PM2 デプロイ（Docker 不使用）

Docker を使用せず、サーバーに直接 Node.js をインストールして PM2 で管理する方式。

### 5.1 Node.js と PM2 のインストール

```bash
# NodeSource から Node.js 20 LTS をインストール
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version   # v20.x を確認

# PM2 インストール
npm install -g pm2
```

### 5.2 プロジェクトをサーバーに転送

```bash
# ローカルでビルド
cd react_next
npm ci --frozen-lockfile
npm run build

# サーバーに転送（standalone 出力）
rsync -avz --delete \
  .next/standalone/ \
  public/ \
  package.json \
  .env.production \
  root@your-server:/opt/sap-panda-nextjs/
```

### 5.3 PM2 起動

```bash
# サーバー上で
cd /opt/sap-panda-nextjs

# 環境変数（.env.production を読み込むか直接設定）
export PORT=3000
export NODE_ENV=production
export HOSTNAME=0.0.0.0
export NEXT_PUBLIC_WP_URL=https://sap-navi.aladdin-techec.com
export NEXT_PUBLIC_API_BASE=https://sap-navi.aladdin-techec.com/wp-json/sap/v1
export NEXT_PUBLIC_SITE_URL=https://your-nextjs-domain.com

# PM2 起動
pm2 start server.js --name sap-panda-nextjs --update-env

# 自動起動設定
pm2 save
pm2 startup systemd
```

### 5.4 管理コマンド

```bash
pm2 status                  # 状態確認
pm2 logs sap-panda-nextjs   # ログ確認
pm2 restart sap-panda-nextjs  # 再起動
pm2 stop sap-panda-nextjs   # 停止
pm2 delete sap-panda-nextjs # 削除
```

---

## 6. Nginx 設定

### 6.1 設定ファイル

`deploy/nginx/nginx.nextjs-standalone.conf` — Next.js 専用のリバースプロキシ設定:

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-nextjs-domain.com;

    # 静的アセット（強力キャッシュ）
    location /_next/static/ {
        proxy_pass http://nextjs;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # メインルート → Next.js SSR
    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
    }
}
```

### 6.2 有効化

```bash
# 設定ファイルをシンボリックリンク
sudo ln -sf /opt/sap-panda-nextjs/deploy/nginx/nginx.nextjs-standalone.conf \
            /etc/nginx/sites-available/sap-panda-nextjs

sudo ln -sf /etc/nginx/sites-available/sap-panda-nextjs \
            /etc/nginx/sites-enabled/

# 設定確認
sudo nginx -t

# リロード
sudo systemctl reload nginx
```

---

## 7. SSL / HTTPS 設定

### 7.1 Let's Encrypt（certbot）

```bash
# certbot インストール
apt-get install -y certbot python3-certbot-nginx

# SSL 証明書取得（対話式）
certbot --nginx -d your-nextjs-domain.com

# 動作確認
certbot renew --dry-run
```

### 7.2 SSL 自動更新

```bash
# systemd timer 確認（デフォルトで設定される）
systemctl status certbot.timer

# 手動更新テスト
certbot renew
```

### 7.3 Nginx SSL 設定例

```nginx
server {
    listen 443 ssl http2;
    server_name your-nextjs-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-nextjs-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-nextjs-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 以下に port 80 と同じ location ブロックを記述
    location /_next/static/ {
        proxy_pass http://nextjs;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
    }
}

# HTTP → HTTPS リダイレクト
server {
    listen 80;
    server_name your-nextjs-domain.com;
    return 301 https://$host$request_uri;
}
```

---

## 8. 環境変数一覧

### Next.js 環境変数（react_next/.env.production）

| 変数名 | 必須 | 設定値 | 説明 |
|--------|------|--------|------|
| `NEXT_PUBLIC_WP_URL` | ✅ | `https://sap-navi.aladdin-techec.com` | WordPress REST API のベースURL |
| `NEXT_PUBLIC_API_BASE` | ✅ | `https://sap-navi.aladdin-techec.com/wp-json/sap/v1` | SAP Panda API エンドポイント |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://your-nextjs-domain.com` | サイト公開URL（デプロイ先ドメイン。⚠️ 実際のドメインに変更） |
| `NEXT_PUBLIC_GA_ID` | 任意 | `G-XXXXXXXXXX` | Google Analytics 測定ID |

### 内部動作

- **Server Components**: `NEXT_PUBLIC_API_BASE` を使って WordPress に直接 fetch リクエスト
- **Client Components**: 相対パス `/wp-json/sap/v1/...` でリクエスト → Next.js の `rewrites` がリモート WordPress にプロキシ

---

## 9. 動作確認

### 9.1 コンテナ状態確認

```bash
# Next.js コンテナの状態
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml ps

# ログ確認
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml logs -f nextjs
```

### 9.2 トップページ（SSR 確認）

```bash
# サーバーローカル
curl -s http://localhost:3000/ | head -30

# 外部から（Nginx 経由）
curl -sI https://your-nextjs-domain.com/
```

レスポンスに `<div id="__next">` の中に完全な HTML が含まれていることを確認。

### 9.3 API 疎通確認

```bash
# Next.js から WordPress API へのプロキシ確認
curl -s http://localhost:3000/wp-json/sap/v1/ | head

# レスポンス例:
# {"success":true,"data":{...}}

# 記事一覧
curl -s "http://localhost:3000/wp-json/sap/v1/articles?per_page=2" | python3 -m json.tool | head -20
```

### 9.4 ヘルスチェック

```bash
# Next.js ヘルスチェックエンドポイント
curl -sI http://localhost:3000/health
```

### 9.5 静的アセット確認

```bash
# JS/CSS チャンク（強力キャッシュ確認）
curl -sI http://localhost:3000/_next/static/...js | grep -i cache
# → Cache-Control: public, immutable を確認
```

---

## 10. 運用・トラブルシューティング

### 10.1 運用コマンド

```bash
# Docker Compose
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml logs -f
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml restart
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml down
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml up -d --build

# PM2
pm2 logs sap-panda-nextjs
pm2 restart sap-panda-nextjs
pm2 monit
```

### 10.2 WordPress API 接続エラー

```bash
# 1. WordPress サーバーの稼働確認
curl -sI https://sap-navi.aladdin-techec.com/ | head -5

# 2. API エンドポイント確認
curl -s https://sap-navi.aladdin-techec.com/wp-json/sap/v1/ | head

# 3. CORS エラーの場合
# WordPress 側で Access-Control-Allow-Origin ヘッダーを確認

# 4. Next.js コンテナ内から WordPress への接続確認
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml exec nextjs \
  wget -qO- https://sap-navi.aladdin-techec.com/wp-json/sap/v1/articles?per_page=1 | head
```

### 10.3 Next.js エラー

```bash
# ビルドエラー
cd react_next && npm ci && npm run build

# TypeScript エラーチェック
npx tsc --noEmit

# ランタイムエラー
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml logs --tail=50 nextjs

# コンテナ内で直接テスト
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml exec nextjs node server.js
```

### 10.4 Nginx エラー

```bash
# 設定テスト
nginx -t

# エラーログ
tail -f /var/log/nginx/sap-panda-error.log

# 502 Bad Gateway → Next.js が起動しているか確認
curl -sI http://127.0.0.1:3000/
```

### 10.5 メモリ・リソース管理

```yaml
# docker-compose.nextjs.yml にリソース制限を追加
services:
  nextjs:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 10.6 バックアップ

```bash
# 設定ファイルのバックアップ
tar czf nextjs-config-$(date +%Y%m%d).tar.gz \
  docker-compose.nextjs.yml \
  react_next/Dockerfile \
  react_next/.env.production \
  deploy/nginx/nginx.nextjs-standalone.conf

# イメージのバックアップ（必要に応じて）
docker save sap-panda-nextjs:latest | gzip > sap-panda-nextjs-$(date +%Y%m%d).tar.gz
```

### 10.7 ログローテーション

```yaml
# docker-compose.nextjs.yml に追加
services:
  nextjs:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 11. ロールバック手順

### Docker 版

```bash
# 1. 現在のコンテナを停止
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml down

# 2. 以前のイメージを確認
docker images | grep sap-panda-nextjs

# 3. タグを指定して以前のバージョンを起動
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml up -d

# 4. 特定のバージョンに戻す場合
git checkout <previous-hash> -- react_next/
docker compose -f /opt/sap-panda-nextjs/docker-compose.nextjs.yml up -d --build
```

### PM2 版

```bash
# 1. 現在のアプリを停止
pm2 stop sap-panda-nextjs

# 2. 以前のバージョンを復元
cd /opt/sap-panda-nextjs
# （事前に /backups/ にバックアップがある場合）
cp -a /backups/sap-panda-nextjs-<date>/* .

# 3. 再起動
pm2 start sap-panda-nextjs --update-env
```

---

## 12. 付録: ファイル構成

```
project-root/
├── react_next/                         # Next.js アプリケーション
│   ├── Dockerfile                      # スタンドアロン Docker ビルド
│   ├── next.config.js                  # output: 'standalone' + rewrites
│   ├── package.json
│   ├── .env.example                    # 開発用環境変数
│   ├── .env.production                 # 本番用環境変数（WordPress URL）
│   └── src/
│       ├── app/                        # Next.js App Router ページ
│       │   └── health/route.ts         # ヘルスチェックエンドポイント
│       ├── components/                 # UI コンポーネント
│       └── lib/
│           ├── api.ts                  # REST API クライアント
│           └── utils.ts                # ユーティリティ関数
│
├── docker-compose.nextjs.yml           # Next.js 単独 Docker Compose
├── deploy/
│   ├── nginx/
│   │   └── nginx.nextjs-standalone.conf  # Nginx リバースプロキシ設定
│   ├── scripts/
│   │   ├── deploy-nextjs-standalone.sh   # Docker デプロイスクリプト
│   │   └── setup-nextjs-standalone.sh    # サーバー初期セットアップ
│   ├── config/
│   │   ├── remote.env.example            # リモートサーバー接続情報テンプレート
│   │   └── remote.env (作成が必要)       # 実際の接続設定（.exampleからコピー）
│   └── ssl/                              # SSL 証明書
│
└── docs/
    └── deployment/
        └── nextjs-standalone-deployment.md  # ← このファイル
```

---

## 参考リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Next.js Docker デプロイ](https://nextjs.org/docs/pages/building-your-application/deploying#docker-image)
- [PM2 公式ドキュメント](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SAP Panda WordPress](https://sap-navi.aladdin-techec.com)
