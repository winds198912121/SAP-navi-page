# ============================================================
# SAP Panda Admin — Build Stage
# docker-compose の nginx サービスから volume 経由で参照
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ビルド成果物は volume 経由で取得
# docker-compose では admin-react-build サービスとして利用
