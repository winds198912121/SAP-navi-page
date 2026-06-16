# SAP Panda Academy — 部署方案

> **版本：** v1.0
> **日期：** 2026-06-13
> **目标：** 前端 (React SPA) 和 WordPress 同域名同端口

---

## 一、架构设计

```
                         sap-panda.com:80/443
                               │
                            Nginx
                    （反向代理／静态文件）
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          / → React SPA              /wp-* → WordPress
          (admin-react/dist/)         (PHP-FPM :9000)
                 │                           │
             静态文件                     ┌───┴───┐
           (Nginx 直接返回)            PHP     MySQL 8
                                     (wordpress:6-fpm)
```

### 路由规则

| 路径 | 目标 | 说明 |
|------|------|------|
| `/` | React `index.html` | SPA 入口 |
| `/assets/*` | React `dist/assets/*` | 静态资源（强缓存） |
| `/article/*` | React `index.html` | SPA 客户端路由 |
| `/modules` | React `index.html` | SPA 客户端路由 |
| `/paths` | React `index.html` | SPA 客户端路由 |
| `/quiz-page` | React `index.html` | SPA 客户端路由 |
| `/cases` | React `index.html` | SPA 客户端路由 |
| `/video` | React `index.html` | SPA 客户端路由 |
| `/course/*` | React `index.html` | SPA 客户端路由 |
| `/knowledge/*` | React `index.html` | SPA 客户端路由 |
| `/lesson/*` | React `index.html` | SPA 客户端路由 |
| `/learning/*` | React `index.html` | SPA 客户端路由 |
| `/step/*` | React `index.html` | SPA 客户端路由 |
| `/about` | React `index.html` | SPA 客户端路由 |
| `/team` | React `index.html` | SPA 客户端路由 |
| `/contact` | React `index.html` | SPA 客户端路由 |
| `/privacy` | React `index.html` | SPA 客户端路由 |
| `/terms` | React `index.html` | SPA 客户端路由 |
| `/login` | React `index.html` | SPA 客户端路由 |
| `/register` | React `index.html` | SPA 客户端路由 |
| `/profile` | React `index.html` | SPA 客户端路由 |
| `/membership` | React `index.html` | SPA 客户端路由 |
| `/category/*` | React `index.html` | SPA 客户端路由 |
| `/wp-json/*` | WordPress PHP-FPM | REST API |
| `/wp-admin/*` | WordPress PHP-FPM | 管理后台 |
| `/wp-content/*` | WordPress | 上传/插件/主题 |
| `/wp-includes/*` | WordPress | 核心文件 |
| `/sitemap.xml` | WordPress API | 动态sitemap |
| `/robots.txt` | React `public/robots.txt` | 爬虫规则 |

---

## 二、两种部署方式

### 方式 A：Native 开发 → 生产（推荐，当前项目状态）

利用当前 native MySQL + WordPress 环境，添加 Nginx 统一端口：

```
                    Nginx :80
                    ┌──────┐
  React (dist/) ◄──┤  /   ├──► WordPress :8080 (php -S)
                    └──────┘
```

**访问地址：** `http://localhost/`

#### 前提条件

```bash
brew install nginx
```

#### 流程

```bash
# 1. 构建 React 前端
cd admin-react && npm run build

# 2. 启动 Nginx（带项目配置）
sudo nginx -c /path/to/deploy/nginx/default.conf

# 3. 启动后端（MySQL + WordPress）
./start.sh
```

### 方式 B：Docker 容器化（生产环境）

全部服务容器化，一键部署：

```
nginx:latest ← React (build stage)
    │
wordpress:6-php8.3-fpm
    │
mysql:8
```

**访问地址：** `http://localhost/`

#### 启动

```bash
docker compose up -d --build
```

---

## 三、文件清单

| 文件 | 用途 |
|------|------|
| `deploy/nginx/default.conf` | Nginx 主配置（HTTP + HTTPS） |
| `admin-react/Dockerfile` | 生产多阶段构建（build → nginx:alpine） |
| `docker-compose.yml` | Docker 编排（含 nginx/wordpress/db） |
| `deploy/scripts/deploy.sh` | 零停机部署脚本 |
| `deploy/scripts/backup.sh` | 数据库每日备份 |
| `deploy/scripts/env-setup.sh` | 环境变量初始化 |
| `deploy/ssl/ssl-setup.sh` | Let's Encrypt SSL 证书获取 |
| `start.sh` | 更新：支持 native + Nginx 模式 |
| `stop.sh` | 更新：停止 Nginx |

---

## 四、Nginx 配置要点

### 4.1 静态资源缓存

```nginx
location /assets/ {
    root /var/www/admin-react/dist;
    expires 365d;        # 一年强缓存
    add_header Cache-Control "public, immutable";
}
```

### 4.2 SPA 路由回退

```nginx
location / {
    root /var/www/admin-react/dist;
    try_files $uri $uri/ /index.html;
}
```

### 4.3 WordPress API 代理

```nginx
location /wp-json/ {
    proxy_pass http://wordpress:9000;  # PHP-FPM
    proxy_set_header Host $host;
}
```

### 4.4 安全头

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

---

## 五、部署步骤

### 5.1 Native 模式

```bash
# 1. 安装 Nginx
brew install nginx

# 2. 构建前端
cd admin-react && npm run build

# 3. 复制 Nginx 配置
sudo cp deploy/nginx/default.conf /usr/local/etc/nginx/servers/sap-panda.conf

# 4. 启动服务
./start.sh          # MySQL + WordPress
sudo nginx          # Nginx

# 5. 访问
open http://localhost/
```

### 5.2 Docker 模式

```bash
# 1. 构建并启动
docker compose up -d --build

# 2. 初始化 WordPress
docker exec sap-panda-wordpress bash /scripts/init.sh

# 3. 种子数据
docker exec sap-panda-wordpress wp eval-file /var/www/html/wp-content/plugins/sap-panda-api/seed-data.php

# 4. 访问
open http://localhost/
```

### 5.3 生产环境 SSL

```bash
# 1. 获取 SSL 证书
sudo bash deploy/ssl/ssl-setup.sh

# 2. 重启 Nginx 加载 SSL
sudo nginx -s reload
```

---

## 六、Docker 架构

```
Service: nginx
   Image: nginx:latest
   Port: 80:80, 443:443
   Volumes:
     - ./deploy/nginx/default.conf:/etc/nginx/conf.d/default.conf
     - admin-react/dist → /var/www/admin-react/dist
     - wordpress → /var/www/html

Service: wordpress
   Image: wordpress:6-php8.3-fpm
   Volumes:
     - wordpress:/var/www/html
     - ./wordpress/wp-content/plugins:/var/www/html/wp-content/plugins
     - ./wordpress/wp-content/themes:/var/www/html/wp-content/themes

Service: db
   Image: mysql:8
   Port: 3307:3306
   Volume: db_data:/var/lib/mysql

Service: admin-react
   Image: node:20-alpine (build stage → output to nginx volume)
```

---

## 七、SSL / HTTPS

### Let's Encrypt (推荐)

```bash
brew install certbot
sudo certbot --nginx -d sap-panda.com -d www.sap-panda.com
```

### 自动续期

```bash
# crontab 每周检查
0 3 * * 1 /usr/local/bin/certbot renew --quiet && nginx -s reload
```

---

## 八、备份策略

| 内容 | 频率 | 保留 | 脚本 |
|------|------|------|------|
| MySQL 数据库 | 每日 | 30 天 | `deploy/scripts/backup.sh` |
| WordPress 上传 | 每日 | 7 天 | `deploy/scripts/backup.sh` |
| Nginx 配置 | Git | — | Git 仓库 |

---

## 九、监控与维护

### 日志

```bash
# Nginx 访问日志
tail -f /usr/local/var/log/nginx/access.log

# Nginx 错误日志
tail -f /usr/local/var/log/nginx/error.log

# WordPress (native)
tail -f /tmp/sap-panda-wp.log
```

### 健康检查

```bash
# 服务状态
curl -s -o /dev/null -w "%{http_code}" http://localhost/
curl -s -o /dev/null -w "%{http_code}" http://localhost/wp-json/sap/v1/modules
```

---

> **文档版本：** v1.0
> **生成日期：** 2026-06-13
