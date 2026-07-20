# SAP Panda Academy — react_next (Next.js SSR) 部署文档

## 概述

react_next 是 SAP Panda Academy 的 **Next.js SSR** 版本前端应用。

### 架构

```
Nginx (port 80/443) → Next.js SSR (port 3000)
                            ↓
            https://sap-navi.aladdin-techec.com
              (既存 WordPress REST API)
```

- **SSR 渲染** — Next.js 14 App Router, 全ページサーバーサイドレンダリング
- **WordPress API** — `next.config.js` の `rewrites` でリモート WordPress にプロキシ
- **`output: 'standalone'`** — Docker イメージ最小化

### デプロイ方式

| 方式 | 説明 | 対象 |
|------|------|------|
| Docker Compose | `docker-compose.nextjs.yml` で起動 | 本番サーバー (推奨) |
| Docker 直接 | `docker build` + `docker run` | お試し起動 |
| ビルド→配置 | `next build` → standalone を rsync | Nginx 裏の Node 直置き |

---

## 1. Docker Compose デプロイ（推奨）

```bash
# 1. ビルド & 起動
cd /path/to/sap-panda
docker compose -f docker-compose.nextjs.yml up -d --build

# 2. ログ確認
docker compose -f docker-compose.nextjs.yml logs -f

# 3. ヘルスチェック
curl http://localhost:3000/
curl http://localhost:3000/health

# 4. 停止
docker compose -f docker-compose.nextjs.yml down
```

---

## 2. 手動 Docker デプロイ

```bash
# 1. ビルド
cd react_next
docker build -t sap-panda-nextjs:latest .

# 2. 起動
docker run -d \
  --name sap-panda-nextjs \
  -p 3000:3000 \
  --env PORT=3000 \
  --env NODE_ENV=production \
  --env NEXT_PUBLIC_WP_URL=https://sap-navi.aladdin-techec.com \
  --env NEXT_PUBLIC_API_BASE=https://sap-navi.aladdin-techec.com/wp-json/sap/v1 \
  --env NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  --restart unless-stopped \
  sap-panda-nextjs:latest
```

---

## 3. Nginx リバースプロキシ設定

```bash
# 1. Nginx 設定配置
sudo cp deploy/nginx/nginx.nextjs-standalone.conf \
  /etc/nginx/sites-available/sap-panda-nextjs

# 2. 有効化
sudo ln -sf /etc/nginx/sites-available/sap-panda-nextjs /etc/nginx/sites-enabled/

# 3. 証明書 (Let's Encrypt)
sudo certbot --nginx -d your-domain.com

# 4. 再読み込み
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Next.js standalone 直接配置（Node 直置き）

```bash
# 1. ビルド
cd react_next
npm ci
npm run build

# 2. 結果確認
ls -la .next/standalone/
#   server.js       ← スタンドアロンサーバー
#   .next/          ← ビルド結果
#   node_modules/   ← 必要な依存のみ
#   package.json

# 3. サーバーに転送
rsync -avz .next/standalone/ user@server:/opt/sap-panda-nextjs/
rsync -avz public/ user@server:/opt/sap-panda-nextjs/public/
rsync -avz .next/static user@server:/opt/sap-panda-nextjs/.next/static

# 4. 起動 (PM2)
ssh user@server "
  cd /opt/sap-panda-nextjs
  NEXT_PUBLIC_WP_URL=https://sap-navi.aladdin-techec.com \
  NEXT_PUBLIC_API_BASE=https://sap-navi.aladdin-techec.com/wp-json/sap/v1 \
  NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  pm2 start server.js --name sap-panda-nextjs --time
  pm2 save
"
```

---

## 5. 環境変数

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `PORT` | `3000` | サーバーlisten ポート |
| `NODE_ENV` | `production` | 実行モード |
| `HOSTNAME` | `0.0.0.0` | バインドアドレス |
| `NEXT_PUBLIC_WP_URL` | `https://sap-navi.aladdin-techec.com` | WordPress サーバーURL |
| `NEXT_PUBLIC_API_BASE` | (WP_URL + /wp-json/sap/v1) | REST API ベースURL |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | 公開サイトURL (SEO/OGP用) |
| `NEXT_PUBLIC_GA_ID` | (空) | Google Analytics ID |

---

## 6. アーキテクチャ詳細

```
User / Crawler
    │
    ▼
Nginx (port 443, SSL termination)
    │
    ├── /_next/static/* → 強力キャッシュ (365d, immutable)
    ├── /favicon.ico, /robots.txt → 静的ファイル
    │
    └── /* → proxy_pass http://nextjs:3000
                  │
                  ▼
          Next.js SSR (port 3000)
            ├── Server Components → fetch → WordPress REST API
            ├── Client Components → /wp-json/ → rewrites → WordPress
            └── Static Generation → .next/static/
```

- **Server Components** はサーバーサイドで `NEXT_PUBLIC_WP_URL` に直接 fetch
- **Client Components** は相対パス `/wp-json/` でリクエストし、`next.config.js` の `rewrites` がリモート WordPress へプロキシ

---

## 7. ヘルスチェック & トラブルシュート

```bash
# SSR ヘルスチェック
curl http://localhost:3000/health
# → 200 OK

# ページレンダリング確認
curl -s http://localhost:3000/ | head -c 500

# ログ
docker compose -f docker-compose.nextjs.yml logs nextjs
# または
pm2 logs sap-panda-nextjs

# WordPress API 接続確認
curl -s https://sap-navi.aladdin-techec.com/wp-json/sap/v1/courses | head -c 200
```

---

## 8. ビルド構成

| ファイル | 説明 |
|---------|------|
| `Dockerfile` | マルチステージビルド (Node 20 Alpine) |
| `next.config.js` | `output: 'standalone'`, `rewrites` → WP プロキシ |
| `docker-compose.nextjs.yml` | Docker Compose 定義 (プロジェクトルート) |
| `deploy/nginx/nginx.nextjs-standalone.conf` | Nginx リバースプロキシ設定 |
