# ============================================================
# SAP Panda Academy — Frontend Dockerfile
# 多阶段构建：编译 React → Nginx 发布
# ============================================================

# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# 依赖缓存层（package.json 不变时复用）
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# 源码构建
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine AS production

# 复制 React 构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置（反向代理 WordPress + SPA 路由）
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 安全性：移除 Nginx 默认配置
RUN rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
