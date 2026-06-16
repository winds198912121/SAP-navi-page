# SAP パンダ先生 — 系统架构设计文档

> **文档版本：** v1.0
> **创建日期：** 2026-06-09
> **架构师：** PM / Architect

---

## 目录

1. [系统架构总览](#1-系统架构总览)
2. [技术栈选型](#2-技术栈选型)
3. [系统分层架构](#3-系统分层架构)
4. [前后端交互图](#4-前后端交互图)
5. [数据流图](#5-数据流图)
6. [组件关系图](#6-组件关系图)
7. [安全架构](#7-安全架构)
8. [部署架构](#8-部署架构)
9. [项目目录结构](#9-项目目录结构)

---

## 1. 系统架构总览

### 1.1 架构风格

**单体 CMS + 前端 SPA 混合架构**

本系统采用 WordPress 作为核心 CMS 引擎，通过 REST API 对外暴露数据接口，前端采用 React SPA 进行用户交互。此架构在初期开发速度快、运维成本低，适合 MVP 阶段的快速验证。

### 1.2 架构视图

```
┌─────────────────────────────────────────────────────────────────┐
│                        CDN (Cloudflare)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (反向代理)                          │
│                   HTTP/2 · gzip · Caching                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│    Frontend (React SPA)       │ │  Static Files (CSS/JS/IMG)    │
│    index.html / article.html  │ │  /wp-content/uploads/         │
│    category.html / cases      │ │  WebP / SVG Assets            │
└───────────────────────────────┘ └───────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  WordPress (PHP 8.3+)                            │
├─────────────────────────────────────────────────────────────────┤
│  Kadence Theme · ACF Pro · Custom Post Types · Taxonomies       │
│  JWT Auth · REST API · Yoast SEO · WP Rocket                    │
└─────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MySQL 8                                    │
│  wp_posts · wp_postmeta · wp_users · wp_options                 │
│  Custom Tables (cases, applications, etc.)                      │
└─────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│     External Services                                           │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI API (AI 问答)      │  YouTube Data API (视频)           │
│  Mailchimp (Newsletter)    │  reCAPTCHA (安全验证)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 技术栈选型

### 2.1 技术栈一览

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端框架** | React | 18.x | 页面组件化开发 |
| **前端打包** | Vite | 5.x | 构建和热更新 |
| **类型系统** | TypeScript | 5.x | 类型安全 |
| **CMS 引擎** | WordPress | 6.x | 内容管理 |
| **后端语言** | PHP | 8.3+ | 服务端逻辑 |
| **主题框架** | Kadence Theme | latest | 页面布局 |
| **自定义字段** | ACF Pro | latest | 扩展内容字段 |
| **自定义类型** | CPT UI | latest | 自定义文章类型 |
| **数据库** | MySQL | 8.x | 数据存储 |
| **认证** | JWT (WP plugin) | latest | API 认证 |
| **缓存** | WP Rocket | latest | 页面缓存 |
| **SEO** | Yoast SEO | latest | 搜索引擎优化 |
| **搜索** | WordPress Search | - | 文章搜索 |
| **AI** | OpenAI API | - | AI 问答助手 |
| **视频** | YouTube Data API v3 | - | 视频嵌入 |
| **邮件** | Mailchimp API | - | Newsletter |
| **反向代理** | Nginx | latest | HTTP 服务 |
| **容器化** | Docker | latest | 环境管理 |

### 2.2 技术选型依据

| 技术 | 选型理由 |
|------|---------|
| **WordPress** | 内容管理成熟、生态丰富、非技术人员可维护 |
| **Kadence Theme** | 可视化 Header/Footer 构建、响应式支持好 |
| **ACF Pro** | 灵活的自定义字段、支持 Block 构建 |
| **React SPA** | 交互丰富的 UI（Quiz、案件模态框等） |
| **MySQL 8** | WordPress 原生支持、性能稳定 |
| **Docker** | 环境统一、部署便捷 |

---

## 3. 系统分层架构

### 3.1 前端分层

```
┌──────────────────────────────────────────┐
│          页面层 (Pages)                    │
│  Home  │  Article  │  Category  │  Cases  │
├──────────────────────────────────────────┤
│          组件层 (Components)              │
│  Header │ Footer │ Hero │ ModuleCard     │
│  Quiz │ TOC │ Dialog │ CardGrid │ Filter  │
│  Ticker │ Modal │ Form │ ...            │
├──────────────────────────────────────────┤
│          业务逻辑层 (Services)             │
│  api.js │ auth.js │ quiz.js │ search.js  │
├──────────────────────────────────────────┤
│          通用层 (Utils)                   │
│  hooks/ │ utils/ │ themes/ │ animations  │
├──────────────────────────────────────────┤
│          渲染层 (Rendering)               │
│  React DOM │ CSS Variables │ SVG Assets  │
└──────────────────────────────────────────┘
```

### 3.2 后端分层 (WordPress)

```
┌──────────────────────────────────────────┐
│          路由层 (Routes)                   │
│  Rewrite Rules │ REST API Namespace      │
│  /wp-json/sap/v1/*                        │
├──────────────────────────────────────────┤
│          控制器层 (Controllers)            │
│  Course Controller │ Quiz Controller     │
│  Case Controller │ Auth Controller       │
├──────────────────────────────────────────┤
│          服务层 (Services)                 │
│  Course Service │ Quiz Service           │
│  Case Service │ Point Service            │
├──────────────────────────────────────────┤
│          数据访问层 (Data)                 │
│  WP_Query │ WP_User │ Custom Tables     │
│  ACF Fields │ Taxonomy │ Post Type       │
├──────────────────────────────────────────┤
│          存储层 (Storage)                  │
│  MySQL 8 │ WP Filesystem │ S3 (Backup)  │
└──────────────────────────────────────────┘
```

---

## 4. 前后端交互图

### 4.1 数据交互方式

```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend (React)   │         │  Backend (WordPress) │
│                      │         │                      │
│  ┌───────────────┐   │  HTTP   │  ┌───────────────┐   │
│  │  Home Page     │──┼─────────┼──│  /sap/v1/     │   │
│  │  Article Page  │   │  GET    │  │  courses      │   │
│  │  Category Page │   │  POST   │  │  articles     │   │
│  │  Case Page     │   │  JWT    │  │  quizzes      │   │
│  └───────────────┘   │         │  │  cases        │   │
│                      │         │  │  auth         │   │
│  ┌───────────────┐   │         │  │  users        │   │
│  │  State Mgmt    │   │         │  └───────────────┘   │
│  │  useState      │   │         │                      │
│  │  useReducer    │   │         │  ┌───────────────┐   │
│  └───────────────┘   │         │  │  Auth (JWT)    │   │
│                      │         │  │  Validation    │   │
│  ┌───────────────┐   │         │  │  Nonce Check   │   │
│  │  CSS Variables│   │         │  └───────────────┘   │
│  │  Theme Switch  │   │         │                      │
│  └───────────────┘   │         └─────────────────────┘
└─────────────────────┘
```

### 4.2 API 端点一览

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/wp-json/sap/v1/courses` | 获取课程列表 | 公开 |
| GET | `/wp-json/sap/v1/courses/{id}` | 获取课程详情 | 公开 |
| GET | `/wp-json/sap/v1/articles` | 获取文章列表 | 公开 |
| GET | `/wp-json/sap/v1/articles/{id}` | 获取文章详情 | 公开 |
| GET | `/wp-json/sap/v1/modules` | 获取模块列表 | 公开 |
| GET | `/wp-json/sap/v1/quizzes` | 获取每日一题 | 公开 |
| GET | `/wp-json/sap/v1/quizzes/today` | 获取当天题目 | 公开 |
| GET | `/wp-json/sap/v1/cases` | 获取案件列表 | 公开 |
| GET | `/wp-json/sap/v1/cases/{id}` | 获取案件详情 | 公开 |
| POST | `/wp-json/sap/v1/cases/{id}/apply` | 投递案件 | JWT |
| POST | `/wp-json/sap/v1/auth/login` | 登录 | 公开 |
| POST | `/wp-json/sap/v1/auth/register` | 注册 | 公开 |
| GET | `/wp-json/sap/v1/users/me` | 获取个人信息 | JWT |
| POST | `/wp-json/sap/v1/points` | 积分操作 | JWT |

---

## 5. 数据流图

### 5.1 内容展示数据流

```
用户请求页面
    │
    ▼
Nginx 接收请求
    │
    ├── 命中缓存? → 返回静态 HTML (WP Rocket)
    │
    └── 未命中缓存
           │
           ▼
    WordPress 加载主题
        │
        ▼
    WP_Query 查询文章
        │
        ├── ACF 获取自定义字段
        │
        ├── Taxonomy 获取分类信息
        │
        └── Meta 获取用户数据
            │
            ▼
    PHP 渲染页面 (Kadence 模板)
        │
        ▼
    返回 HTML + CSS + JS
        │
        ▼
    React 组件 Hydration (交互功能)
```

### 5.2 用户互动数据流

```
用户操作 (点击/提交/切换)
    │
    ▼
React 组件状态变更
    │
    ├── 纯前端操作 (主题切换/动画/TOC)
    │   └── CSS Variables / LocalStorage
    │
    ├── API 请求 (文章/案件/题库)
    │   ├── → WordPress REST API
    │   │   ├── JWT 验证
    │   │   ├── Nonce 验证
    │   │   ├── Capability 检查
    │   │   └── 数据返回
    │   └── ← JSON Response
    │
    └── 外部服务 (AI / YouTube / Mailchimp)
        └── API 密钥验证
```

---

## 6. 组件关系图

### 6.1 页面组件树

```
App (Root)
├── SiteHeader
│   ├── Logo (PandaAvatar)
│   ├── Navigation
│   ├── SearchPill
│   └── CTA Button
│
├── [Home Page]
│   ├── Hero
│   │   ├── ChalkBoard (SVG)
│   │   ├── PandaSensei
│   │   └── Callout Float
│   ├── CaseTickerBand
│   ├── ModulesSection
│   │   └── ModuleCard × 9
│   ├── PathsSection
│   │   └── PathCard × 3
│   ├── ArticlesSection
│   │   ├── ArticleRow × 5
│   │   └── Top10List
│   ├── QuizSection
│   │   ├── QuizQuestion
│   │   └── PandaThinking
│   ├── YouTubeSection
│   │   └── YTVideoCard × 4
│   └── NewsletterSection
│
├── [Article Page]
│   ├── Article Hero
│   │   ├── Breadcrumb
│   │   ├── Meta Tags
│   │   └── Cover Scene (SVG)
│   ├── Article Content
│   │   ├── Dialog (Panda)
│   │   ├── Dialog (Student)
│   │   ├── CalloutBox
│   │   └── Code Block
│   ├── Article Sidebar
│   │   ├── TOC
│   │   ├── Share Block
│   │   └── Next Article
│   └── Related Articles
│
├── [Category Page]
│   ├── Category Hero
│   │   ├── Module Icon
│   │   └── PandaThinking
│   ├── Sidebar Filter
│   │   ├── Difficulty Filter
│   │   ├── Topic Filter
│   │   └── Learning Path CTA
│   ├── Card Grid
│   └── Pagination
│
├── [Case Section]
│   ├── Skill Match Bar
│   ├── CaseCard × N
│   ├── CaseDetailModal
│   └── ApplyModal
│
├── [Floating Panda]
│   ├── PandaFloat (SVG)
│   └── Popup Bubble
│
├── [TweaksPanel]
│   ├── Theme Selector
│   ├── Font Size Slider
│   └── Animation Intensity
│
└── SiteFooter
```

---

## 7. 安全架构

### 7.1 安全策略

```
安全层次
│
├── 网络层
│   ├── HTTPS (SSL/TLS)
│   └── Cloudflare WAF
│
├── 应用层
│   ├── JWT 认证 (API)
│   ├── Nonce 验证 (表单)
│   ├── Capability 检查 (权限)
│   ├── XSS 防护 (esc_html/attr)
│   └── SQL 注入防护 ($wpdb->prepare)
│
├── 数据层
│   ├── 密码哈希 (wp_hash_password)
│   ├── 敏感信息加密
│   └── 数据库前缀自定义
│
└── 运维层
    ├── 定期备份
    ├── 日志监控
    └── 自动更新
```

### 7.2 认证流程

```
┌─────────────┐         ┌─────────────┐
│  客户端      │         │  服务器      │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │  POST /auth/login     │
       │  {email, password}    │
       │───────────────────────▶│
       │                       │── wp_authenticate()
       │                       │── JWT 生成
       │  {token, user}        │
       │◀───────────────────────│
       │                       │
       │  GET /users/me        │
       │  Authorization: JWT   │
       │───────────────────────▶│
       │                       │── JWT 验证
       │                       │── Capability 检查
       │  {user_data}          │
       │◀───────────────────────│
```

---

## 8. 部署架构

### 8.1 生产环境

```
┌──────────────────────────────────────────┐
│          DNS (Cloudflare)                  │
│          panda-sensei.com                  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│       CDN (Cloudflare)                    │
│       Static cache · SSL · WAF           │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│     Nginx (Docker Container)              │
│     HTTP/2 · gzip · Reverse Proxy        │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│     WordPress (Docker Container)           │
│     PHP 8.3 FPM · WP Rocket Cache         │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│     MySQL 8 (Docker Container)            │
│     Persistent Volume · Daily Backup     │
└──────────────────────────────────────────┘
```

### 8.2 Docker 配置

```yaml
# docker-compose.yml 主要服务
services:
  nginx:
    image: nginx:latest
    ports: [80, 443]
    volumes: [./nginx:/etc/nginx/conf.d]

  wordpress:
    image: wordpress:6-php8.3-fpm
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_NAME: wordpress

  db:
    image: mysql:8
    volumes: [db_data:/var/lib/mysql]
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
```

---

## 9. 项目目录结构

```
project/
│
├── docs/
│   ├── requirements/
│   │   ├── prd.md
│   │   ├── usecase.md
│   │   └── workflow.md
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── db-design.md
│   │   └── api-design.md
│   └── features/
│       └── (功能文档)
│
├── wordpress/
│   ├── wp-content/
│   │   ├── themes/
│   │   │   └── panda-sensei-child/
│   │   │       ├── style.css
│   │   │       ├── functions.php
│   │   │       ├── front-page.php
│   │   │       ├── category.php
│   │   │       ├── single.php
│   │   │       ├── 404.php
│   │   │       ├── template-parts/
│   │   │       │   ├── hero-mascot.php
│   │   │       │   ├── category-hero.php
│   │   │       │   └── (其他模板部件)
│   │   │       └── assets/
│   │   │           ├── logo.svg
│   │   │           └── (其他SVG资产)
│   │   ├── plugins/
│   │   │   └── sap-panda-api/ (自定义插件)
│   │   └── uploads/
│   ├── wp-config.php
│   └── .htaccess
│
├── admin-react/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── tests/
│   ├── phpunit/
│   ├── vitest/
│   └── e2e/
│
├── deploy/
│   ├── nginx/
│   │   └── default.conf
│   ├── ssl/
│   ├── backup/
│   └── scripts/
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## 10. 性能优化策略

### 10.1 前端优化

| 策略 | 实现方式 |
|------|---------|
| 图片优化 | WebP 格式 + lazy loading |
| CSS 压缩 | 合并 + minify |
| JS 分割 | 按页面分割、异步加载 |
| 字体优化 | Google Fonts 预连接 + display:swap |
| 动画优化 | 仅使用 transform/opacity (GPU 合成) |
| DOM 优化 | 最小化 DOM 操作、IntersectionObserver |

### 10.2 后端优化

| 策略 | 实现方式 |
|------|---------|
| 页面缓存 | WP Rocket 静态缓存 |
| 数据库优化 | 索引优化、查询缓存 |
| CDN | Cloudflare 静态资源分发 |
| PHP 优化 | OPcache 启用 |
| MySQL 优化 | Query Cache、InnoDB 参数调优 |

---

> **文档变更记录**
>
> | 版本 | 日期 | 变更内容 | 负责人 |
> |------|------|---------|-------|
> | v1.0 | 2026-06-09 | 初版创建 | PM |
