# SSR — 服务端渲染

## 功能说明

为 SAP Panda Academy 添加服务端渲染 (SSR) 能力，使搜索引擎爬虫能够抓取完整的 HTML 内容，提升 SEO 和社交分享体验。

## 架构

```
爬虫/搜索引擎
     │
     ▼
Nginx ──→ WordPress PHP (index.php)
               │
               ├── 不是爬虫 → 返回 SPA shell (原有行为)
               │
               └── 是爬虫 → SSR Server (Node.js, port 3000)
                      │
                      ▼
               ReactDOMServer.renderToString()
                      │
                      ▼
               SSR HTML → PHP → Nginx → 爬虫
```

## 文件变更

### 新增文件

| 文件 | 说明 |
|------|------|
| `admin-react/src/entry-client.tsx` | 客户端入口（hydrateRoot） |
| `admin-react/src/entry-server.tsx` | 服务端入口（renderToString + StaticRouter） |
| `admin-react/server/index.js` | Express SSR 服务器 |
| `admin-react/Dockerfile.ssr` | SSR 服务器 Docker 构建 |

### 修改文件

| 文件 | 说明 |
|------|------|
| `admin-react/src/main.tsx` → 重命名为 entry-client.tsx | hydrateRoot 代替 createRoot |
| `admin-react/src/config.ts` | 添加 SSR 环境变量回退 |
| `admin-react/src/hooks/useTheme.ts` | SSR 时跳过 localStorage |
| `admin-react/vite.config.ts` | SSR 构建支持 |
| `admin-react/package.json` | 添加 build:ssr / start:ssr 脚本 |
| `admin-react/build.sh` | 同时构建 client + server |
| `wordpress/.../index.php` | 爬虫检测 + SSR 调用 |
| `wordpress/.../functions.php` | SSR 配置常量 + 辅助函数 |
| `docker-compose.yml` | 添加 ssr 服务 |
| `deploy/scripts/deploy.sh` | 构建 SSR + PM2 管理 |
| `start.sh` / `stop.sh` | SSR 服务器生命周期管理 |

## API 设计

### SSR Server

**端点:** `GET /render`

**参数:**

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| path | string | 是 | 路由路径（包含 basename，例如 `/sap/courses/123`） |
| basename | string | 否 | React Router basename（例如 `/sap`） |

**响应:**

```json
{
  "html": "<div id=\"root\">渲染后的 React HTML</div>"
}
```

**端点:** `GET /health`

**响应:**

```json
{
  "status": "ok",
  "rendererReady": true
}
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SSR_ENABLED` | (空) | 设为 `1` 启用 SSR |
| `SSR_HOST` | `ssr` | SSR 服务器主机名（Docker 服务名） |
| `SSR_PORT` | `3000` | SSR 服务器端口 |
| `PORT` | `3000` | SSR 服务器监听端口 |

## 爬虫检测

`functions.php` 中的 `sap_panda_is_bot()` 函数检测以下爬虫：

- Googlebot, Bingbot, Yandexbot, Baiduspider
- Facebook, Twitter, WhatsApp, Pinterest
- Slack, Discord, Telegram
- 通用 pattern: bot, crawl, spider

## SSR 侵入检查

SSR 构建（`entry-server.tsx`）对以下浏览器特有 API 进行了保护：

| API | 保护方式 |
|-----|----------|
| `window` | `typeof window === 'undefined'` |
| `localStorage` | SSR 时 `useTheme` 返回默认值 |
| `document` | 未在模块级别使用；`useEffect` 内使用安全 |

## 测试方法

```bash
# 构建
cd admin-react && npm run build:ssr

# 启动 SSR 服务器
SSR_ENABLED=1 node server/index.js

# 测试渲染
curl 'http://localhost:3000/render?path=/'

# 测试健康检查
curl 'http://localhost:3000/health'
```

## 依赖

- Node.js 20+
- Express 5.x
- react-dom/server
- react-router-dom/server

## 限制

- 当前仅在爬虫请求时触发 SSR
- 普通用户仍为 SPA（水合后行为一致）
- 个别组件的 `window`/`localStorage` 访问可能在 SSR 时抛出异常（PHP 会降级到 SPA）
