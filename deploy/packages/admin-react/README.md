# SAP Panda Academy — admin-react 部署文档

## 概述

admin-react 是 SAP Panda Academy 的 React 管理后台前端应用，通过 WordPress REST API（`/wp-json/sap/v1/`）与后端通信。

### 部署方式

支持三种部署模式：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **CSR 主题模式** | 构建产物放入 WordPress 主题，由 PHP 模板加载 SPA | 传统 WordPress 部署 |
| **Docker 容器模式** | Nginx + SSR 容器化部署 | Docker 环境 |
| **Nginx + SSR 独立模式** | Nginx 反向代理 + Node.js SSR 侧车 | 裸机 / VPS |

---

## 1. CSR 主题模式（最快）

将 admin-react 构建为 WordPress 子主题，由 WordPress PHP 模板加载。

### 步骤

```bash
# 1. 构建 React SPA
cd admin-react
npm ci
npm run build

# 2. 将构建产物复制到 WordPress 主题目录
rm -rf ../wordpress/wp-content/themes/sap-panda/assets
mkdir -p ../wordpress/wp-content/themes/sap-panda/assets
cp -R dist/client/* ../wordpress/wp-content/themes/sap-panda/

# 3. 确认 assets 目录
ls -la ../wordpress/wp-content/themes/sap-panda/assets/
```

### WordPress 主题模板（index.php）

```php
<?php
/**
 * SAP Panda Academy — React SPA 入口模板
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body>
  <div id="root"></div>
  <?php
    // 将 WordPress 配置传递给 React
    wp_localize_script('sap-panda-app', 'SAP_PANDA_DATA', [
      'wpUrl'   => home_url(),
      'restUrl' => rest_url('sap/v1'),
      'nonce'   => wp_create_nonce('wp_rest'),
    ]);
  ?>
  <script type="module" src="<?php echo get_template_directory_uri(); ?>/assets/index.js"></script>
  <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/index.css">
  <?php wp_footer(); ?>
</body>
</html>
```

---

## 2. Docker 容器模式

使用项目根目录的 `docker-compose.yml` 一键部署。

### 前提

- Docker 24+
- Docker Compose v2+

### 步骤

```bash
# 从项目根目录启动所有服务
cd /path/to/sap-panda
docker compose up -d --build

# 仅重新构建 admin-react 和 SSR
docker compose build app ssr
docker compose up -d app ssr

# 查看日志
docker compose logs -f app
docker compose logs -f ssr
```

### 架构

```
客户端请求
    │
    ▼
Nginx (app 容器, port 80)
    ├── /assets/* → 强缓存（365d）
    ├── /wp-json/* → WordPress PHP-FPM（wordpress 容器, port 8080）
    ├── 机器人请求 → SSR Server（ssr 容器, port 3000）
    └── 普通请求 → /index.html（SPA shell）
```

---

## 3. Nginx + SSR 独立模式（生产推荐）

### 架构

```
客户端 / 爬虫
    │
    ▼
Nginx (port 80/443)
    ├── 机器人/搜索引擎 → SSR Node.js (port 3000) → 完整 HTML
    ├── 正常用户 → React SPA (index.html)
    ├── /wp-json/* → 远程 WordPress 服务器
    └── /assets/* → 强缓存
```

### 步骤

```bash
# 1. 构建 CSR + SSR
cd admin-react
npm ci
npm run build:ssr

# 构建产物
#   dist/client/    → SPA 静态资源
#   dist/server/    → SSR 渲染函数
#   server/         → Express 服务器

# 2. 部署静态资源和 SSR 到服务器
rsync -avz dist/client/ user@server:/var/www/admin-react/html/
rsync -avz dist/server/ user@server:/opt/admin-react-ssr/dist/server/
rsync -avz server/ user@server:/opt/admin-react-ssr/server/
rsync -avz --include='package.json' --include='node_modules/**' --exclude='*' . user@server:/opt/admin-react-ssr/

# 3. 启动 SSR 服务（PM2）
ssh user@server "
  cd /opt/admin-react-ssr
  npm ci --production
  pm2 start server/index.js --name admin-react-ssr --time --env PORT=3000
  pm2 save
"

# 4. 配置 Nginx（使用 nginx.conf.example）
ssh user@server "
  cp /path/to/nginx.conf.example /etc/nginx/sites-available/admin-react
  ln -sf /etc/nginx/sites-available/admin-react /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx
"
```

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | SSR 服务监听端口 |
| `SITE_BASE` | `""` | WordPress 部署子路径（如 `/sap`） |
| `API_BASE` | `""` | API 基础 URL（自动拼接 SITE_BASE） |
| `SSR_ENABLED` | `1` | 是否启用 SSR |
| `NODE_ENV` | `production` | 运行模式 |

---

## 4. 远程部署脚本

项目根目录提供以下自动化部署脚本：

| 脚本 | 说明 |
|------|------|
| `deploy/scripts/deploy.sh` | 本地 Docker 部署 + SSR 重启 |
| `deploy/scripts/deploy-remote.sh` | 远程 rsync 部署（含 SSR） |
| `deploy/scripts/setup-ssr.sh` | 服务器初次 SSR 环境搭建（Node.js + PM2） |

### 快速远程部署

```bash
# 1. 配置远程服务器信息
cp deploy/config/remote.env.example deploy/config/remote.env
# 编辑 remote.env 设置 REMOTE_SERVER、REMOTE_USER 等

# 2. 执行部署
bash deploy/scripts/deploy-remote.sh
```

---

## 5. 构建产物说明

```
admin-react/dist/
├── client/
│   ├── index.html          ← SPA 入口（SSR 模板源）
│   ├── assets/
│   │   ├── index-xxx.js    ← React 应用 JS
│   │   └── index-xxx.css   ← 应用样式
│   └── vite.svg
└── server/
    └── entry-server.js     ← SSR 渲染函数（render()）
```

---

## 6. API 端点参考

admin-react 调用的 WordPress REST API 端点：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/wp-json/sap/v1/courses` | GET | 课程列表 |
| `/wp-json/sap/v1/courses/{id}` | GET | 课程详情 |
| `/wp-json/sap/v1/teachers` | GET | 讲师列表 |
| `/wp-json/sap/v1/exams` | GET | 考试列表 |
| `/wp-json/sap/v1/auth/token` | POST | JWT 认证 |
| `/wp-json/sap/v1/users/me` | GET | 当前用户信息 |

---

## 7. 健康检查

```bash
# SSR 健康检查
curl http://localhost:3000/health
# → {"status":"ok","rendererReady":true}

# Nginx / SPA 健康检查
curl -o /dev/null -w '%{http_code}' http://localhost/
# → 200

# 模拟爬虫（验证 SSR）
curl -s -H 'User-Agent: Googlebot/2.1' http://localhost/ | head -c 500
```

---

## 8. 故障排查

### SSR 返回 503

```bash
# 检查 SSR 进程
pm2 list
pm2 logs admin-react-ssr

# 确认 SSR 构建文件存在
ls -la /opt/admin-react-ssr/dist/server/entry-server.js
ls -la /opt/admin-react-ssr/dist/client/index.html
ls -la /opt/admin-react-ssr/server/index.js
```

### 前端白屏

```bash
# 检查 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 检查 API 连通性
curl -s http://localhost/wp-json/sap/v1/courses | head -c 200
```

### Docker 容器启动失败

```bash
docker compose logs app
docker compose logs ssr
docker compose exec app nginx -t
```
