# SAP Panda Academy — WordPress 部署包

## 文件说明

| 文件 | 大小 | 说明 |
|------|------|------|
| `sap-panda-theme.zip` | ~3 MB | WordPress 主题（React SPA 前端） |
| `sap-panda-api.zip` | ~100 KB | WordPress 插件（REST API + 自定义文章类型） |
| `sap-panda-academy.zip` | ~1.5 MB | SSR 服务端运行环境（Node.js SSR bundle） |
| `aladdin-theme.zip` | ~74 KB | WordPress 主题（标准PHP版 — 非React，共享同一REST API） |
| `sap-panda-next.zip` | ~71 KB | Next.js SSR App（源码包，需 `npm install && npm run build`） |

> **SSR（服务端渲染）v2.4** — 新增爬虫搜索引擎支持，Googlebot 等爬虫可获得完整 HTML 内容。
>
> **Aladdin 主题 v1.0** — 标准 WordPress 主题版，适合传统 PHP 模板需求，与 React SPA 共享 `/wp-json/sap/v1/` API。
>
> **Next.js 版 v1.0** — 基于 App Router 的全 SSR 方案，天然支持 SEO。与 React SPA / Aladdin 共享同一 API。

---

## 安装步骤

### 前提条件

- WordPress 6.0+
- PHP 8.0+（推荐 8.3）
- MySQL 8.0+
- Node.js 20 LTS（SSR 需要）
- PM2（SSR 进程管理）
- 已安装并启用插件：
  - Advanced Custom Fields (ACF)
  - Custom Post Type UI
  - JWT Authentication for WP REST API

### 1. 安装插件

1. WordPress 管理后台 → **插件** → **安装插件** → **上传插件**
2. 选择 `sap-panda-api.zip` → **立即安装**
3. 安装完成后点击 **启用插件**

或手动安装：
```bash
unzip sap-panda-api.zip -d /path/to/wordpress/wp-content/plugins/
```

### 2. 安装主题 (React SPA)

1. WordPress 管理后台 → **外观** → **主题** → **安装主题** → **上传主题**
2. 选择 `sap-panda-theme.zip` → **立即安装**
3. 安装完成后点击 **启用**（SAP Panda Academy）

或手动安装：
```bash
unzip sap-panda-theme.zip -d /path/to/wordpress/wp-content/themes/
```

### 2b. 安装主题 (Aladdin 标准PHP版)

> 如果不需要 React SPA，可以安装 Aladdin 主题。两者共享同一套 REST API 数据。

1. WordPress 管理后台 → **外观** → **主题** → **安装主题** → **上传主题**
2. 选择 `aladdin-theme.zip` → **立即安装**
3. 安装完成后点击 **启用**（Aladdin SAP Panda）

或手动安装：
```bash
unzip aladdin-theme.zip -d /path/to/wordpress/wp-content/themes/
cd /path/to/wordpress/wp-content/themes/
# aladdin_theme 目录 -> 移动到 themes 根目录
mv aladdin_theme aladdin
```

### 2c. 安装 Next.js 版

> 需要 Node.js 20 LTS+。Next.js 全 SSR，天然 SEO 友好。

```bash
# 1. 解压到服务器
unzip sap-panda-next.zip -d /opt/
cd /opt/react_next

# 2. 配置环境
cp .env.example .env.local
# 编辑 .env.local 设置 WordPress 地址

# 3. 安装依赖并构建
npm install
npm run build

# 4. 使用 PM2 启动
npm install -g pm2
pm2 start npm --name sap-panda-next -- start
pm2 save

# 5. Nginx 反向代理配置
# location / {
#     proxy_pass http://127.0.0.1:3000;
#     proxy_set_header Host $host;
# }
```

一键部署（配置 `deploy/config/remote.env` 后）：
```bash
bash deploy/scripts/deploy-nextjs.sh
```

### 3. 配置 wp-config.php

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
define('WP_HOME', 'https://your-domain.com');
define('WP_SITEURL', 'https://your-domain.com');
```

### 4. 配置 Nginx（SSR 版）

部署包包含生产级 Nginx 配置，内置爬虫检测 + SSR 代理：

```nginx
# 从项目复制到 Nginx 配置目录
sudo cp deploy/nginx/production.conf /etc/nginx/sites-available/sap-panda
sudo ln -s /etc/nginx/sites-available/sap-panda /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

配置要点：
- **爬虫检测** — 根据 User-Agent 识别 Googlebot/Bingbot/Facebook 等
- **SSR 代理** — 爬虫请求转发到 Node.js SSR 服务 (port 3000)
- **SPA 回退** — 普通用户继续使用客户端渲染

---

## SSR（服务端渲染）部署

### 首次安装（一次性）

```bash
# 1. SSH 到服务器
ssh root@your-server.com

# 2. 运行 SSR 环境设置脚本（安装 Node.js + PM2）
bash < <(curl -s https://raw.githubusercontent.com/winds198912121/SAP-navi-page/main/deploy/scripts/setup-ssr.sh)

# 或手动安装
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2
mkdir -p /opt/sap-panda-ssr
pm2 startup systemd
```

### 日常部署（SSR bundle 更新）

```bash
# 1. 本地构建
cd admin-react && npm run build:ssr

# 2. 部署 SSR bundle 到服务器
rsync -avz dist/server/ root@server:/opt/sap-panda-ssr/dist/server/
rsync -avz dist/client/index.html root@server:/opt/sap-panda-ssr/dist/client/
rsync -avz server/ root@server:/opt/sap-panda-ssr/server/

# 3. 重启 SSR 服务
ssh root@server "pm2 restart sap-panda-ssr && pm2 save"
```

### 一键部署（推荐）

配置 `deploy/config/remote.env` 后运行：

```bash
bash deploy/scripts/deploy-remote.sh
```

该脚本会：
1. 构建 CSR + SSR 双 bundle
2. 部署 WordPress 插件和主题
3. 部署 SSR 服务端文件
4. 通过 PM2 重启 SSR 服务
5. 自动修正文件权限

### 验证 SSR 是否生效

```bash
# 普通用户（应返回空 <div id="root"></div>）
curl -s -H 'User-Agent: Mozilla/5.0' https://your-domain.com/ | grep '<div id="root">'

# 爬虫（应返回完整 HTML 内容）
curl -s -H 'User-Agent: Googlebot/2.1' https://your-domain.com/ | grep '<div id="root">' | head -c 100
```

---

## URL 结构

| 路径 | 说明 |
|------|------|
| `/` | React SPA 前端（普通用户） / SSR HTML（爬虫） |
| `/wp-admin/` | WordPress 管理后台 |
| `/wp-json/sap/v1/` | REST API |

---

## REST API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/wp-json/sap/v1/courses` | 课程列表 |
| GET | `/wp-json/sap/v1/courses/{id}` | 课程详情 |
| GET | `/wp-json/sap/v1/teachers` | 讲师列表 |
| GET | `/wp-json/sap/v1/exams` | 考试列表 |
| GET | `/wp-json/sap/v1/topics` | 话题列表 |
| POST | `/wp-json/sap/v1/auth/login` | 用户登录 |
| GET | `/wp-json/sap/v1/user/me` | 当前用户信息 |

完整 API 列表见 `docs/api_list.csv`。

---

## 目录结构（主题）

```
sap-panda/
├── assets/
│   ├── index-{hash}.js      # React 主程序
│   └── index-{hash}.css     # React 样式
├── functions.php             # 主题函数（加载 JS/CSS + SSR 辅助函数）
├── index.html                # SPA 入口
├── index.php                 # WordPress 模板（SSR 降级检测）
├── style.css                 # 主题信息
├── robots.txt                # 搜索引擎配置
└── sitemap.xml               # 站点地图
```

## 目录结构（SSR）

```
/opt/sap-panda-ssr/
├── dist/
│   ├── client/
│   │   └── index.html        # SPA shell 模板
│   └── server/
│       └── entry-server.js   # SSR 渲染函数
├── server/
│   └── index.js              # Express SSR 服务器
└── node_modules/             # 运行时依赖
```

## 目录结构（Aladdin 标准主题）

```
aladdin/
├── style.css                   # 主题信息
├── functions.php               # 主题函数、API 辅助、路由
├── header.php                  # 网站头部
├── footer.php                  # 网站底部
├── index.php                   # 默认模板
├── 404.php                     # 404 页面
├── assets/
│   ├── css/
│   │   ├── main.css            # 主样式 (设计系统 CSS 变量)
│   │   ├── responsive.css      # 响应式适配
│   │   └── admin.css           # 管理后台样式
│   ├── js/
│   │   └── main.js             # JavaScript (API 调用、交互)
│   └── images/                 # 图片资源
├── page-templates/
│   ├── home.php                # 首页
│   ├── single-article.php      # 文章详情
│   ├── single-course.php       # 课程详情
│   ├── single-lesson.php       # 课时详情
│   ├── single-knowledge.php    # 知识库详情
│   ├── single-note.php         # 笔记详情
│   ├── single-step.php         # 学习步骤
│   ├── single-learning-path.php# 学习路径详情
│   ├── archive-articles.php    # 模块文章列表
│   ├── archive-modules.php     # SAP 模块列表
│   ├── archive-cases.php       # 案件列表
│   ├── archive-videos.php      # 视频列表
│   ├── archive-learning-paths.php # 学习路径列表
│   ├── search-page.php         # 搜索页面
│   ├── login.php               # 登录
│   ├── register.php            # 注册
│   ├── profile.php             # 个人资料
│   ├── membership.php          # 会员计划
│   ├── quiz-page.php           # 每日一题
│   ├── topic-page.php          # 主题页面
│   ├── admin/                  # 管理后台模板 (18个)
│   └── static/                 # 静态页面 (5个)
└── template-parts/             # 可复用组件

---

## 常见问题

**Q: 页面空白 / 404？**
- 确认主题已启用
- 检查 Nginx 配置是否有 SPA 路由回退 (`try_files $uri $uri/ /index.html;`)
- 检查浏览器控制台是否有 API 请求错误

**Q: 页面空白 / 404 (Aladdin 主题)？**
- 确认 aladdin 主题已启用
- 访问 **设置 → 固定链接** 点击「保存更改」刷新路由
- Aladdin 主题使用 `template_include` 过滤器处理路由，需要永久链接结构不是 `Plain`

**Q: SSR 不工作 / 爬虫拿到的也是空 HTML？**
- 确认 Node.js SSR 服务运行中: `pm2 list`
- 检查 SSR 端口: `curl -s http://127.0.0.1:3000/health`
- 检查 Nginx error log: `tail -f /var/log/nginx/sap-panda-error.log`
- 确认 `production.conf` 中 SSR `@ssr` location 配置正确

**Q: SSR 返回 502？**
- SSR 进程未运行: `pm2 restart sap-panda-ssr`
- 端口冲突: 检查 3000 端口是否被占用
- 依赖缺失: 确认 `node_modules` 已安装

**Q: API 返回 401？**
- JWT 密钥未配置，检查 `wp-config.php` 中 `JWT_AUTH_SECRET_KEY`
- 确认 JWT 认证插件已启用

**Q: 上传文件大小限制？**
- 在 `php.ini` 中修改：`upload_max_filesize = 64M`、`post_max_size = 128M`
