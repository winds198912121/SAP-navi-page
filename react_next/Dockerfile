# ============================================================
# SAP Panda Next.js — Standalone SSR Dockerfile
#
# Wordpress はリモート（https://sap-navi.aladdin-techec.com）
# に既にデプロイされているため、この Dockerfile は
# Next.js を単独の SSR サービスとしてビルド・実行します。
#
# 使用方法:
#   docker build -t sap-panda-nextjs:latest .
#   docker run -p 3000:3000 --env-file .env.production sap-panda-nextjs:latest
# ============================================================

# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係インストール（Docker キャッシュ最適化）
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile --no-audit

# ソースコードをコピーしてビルド
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# 非 root ユーザー作成（セキュリティ）
RUN addgroup -g 1001 -S nextjs && \
    adduser -S nextjs -u 1001 -G nextjs

# standalone 出力（Next.js 14 の output: 'standalone'）
# .next/standalone/ には server.js + 必要な node_modules + .next が含まれる
COPY --from=builder /app/.next/standalone ./

# public 静的ファイル（ favicon, robots.txt, 画像等 ）
COPY --from=builder /app/public ./public

# .next/static（ブラウザに配信される JS/CSS チャンク）
COPY --from=builder /app/.next/static ./.next/static

# パーミッション設定
RUN chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    NODE_ENV=production \
    HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
