/**
 * SSR Express Server
 *
 * 架构:
 *   爬虫 → Nginx (User-Agent 检测) → 本 SSR 服务 (port 3000)
 *        → renderToString() → 完整 HTML (含 SPA shell) → 爬虫
 *
 * 两个端点:
 *   GET /render?path=...&basename=...  — JSON 返回 (给 WordPress PHP 用, 兼容)
 *   GET /* (catch-all)                   — 完整 HTML 页面 (nginx 机器人代理用)
 *   GET /health                          — 健康检查
 */

import express from 'express'
import { pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const app = express()

// 客户端 HTML 模板 (SPA shell)
const CLIENT_HTML_PATH = join(__dirname, '..', 'dist', 'client', 'index.html')
let htmlTemplate = null

// SSR 渲染函数
const SERVER_BUNDLE_PATH = join(__dirname, '..', 'dist', 'server', 'entry-server.js')
let render = null

async function loadRenderer() {
  const bundleUrl = pathToFileURL(SERVER_BUNDLE_PATH).href
  const mod = await import(bundleUrl)
  render = mod.render
  console.log(`[SSR] Renderer loaded from ${SERVER_BUNDLE_PATH}`)
}

function loadHtmlTemplate() {
  if (existsSync(CLIENT_HTML_PATH)) {
    htmlTemplate = readFileSync(CLIENT_HTML_PATH, 'utf-8')
    console.log(`[SSR] HTML template loaded (${htmlTemplate.length} bytes)`)
  } else {
    console.warn(`[SSR] HTML template not found at ${CLIENT_HTML_PATH}`)
  }
}

// -----------------------------------------------------------
// 健康检查 (必须放在最前)
// -----------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    rendererReady: render !== null,
  })
})

// -----------------------------------------------------------
// JSON 端点 (给 WordPress PHP 用)
// -----------------------------------------------------------
app.get('/render', async (req, res) => {
  const routePath = req.query.path

  if (!routePath || typeof routePath !== 'string') {
    return res.status(400).json({ error: 'Missing "path" query parameter' })
  }

  if (!render) {
    return res.status(503).json({ error: 'SSR renderer not ready' })
  }

  try {
    const result = render({
      path: routePath,
      basename: req.query.basename || '',
    })

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.json(result)
  } catch (err) {
    console.error('[SSR] Render error:', err)
    res.status(500).json({ error: 'SSR render failed' })
  }
})

// -----------------------------------------------------------
// 完整 HTML 页面渲染 — 供 Nginx 机器人代理用
// Express 5: 使用 /{*path} 作为 catch-all 通配符
// -----------------------------------------------------------
app.all('/{*path}', (req, res) => {

  if (!render || !htmlTemplate) {
    // SSR 未就绪: 返回 SPA shell (让客户端自行渲染)
    if (htmlTemplate) {
      return res.type('html').send(htmlTemplate)
    }
    return res.status(503).send('SSR renderer not ready')
  }

  try {
    const routePath = req.path || '/'
    const basename = process.env.SITE_BASE || ''
    const result = render({ path: routePath, basename })

    // 将渲染后的 React HTML 注入到 SPA shell 中
    const fullHtml = htmlTemplate.replace(
      '<div id="root"></div>',
      `<div id="root">${result.html}</div>`
    )

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('X-SSR', '1')
    res.send(fullHtml)
  } catch (err) {
    console.error('[SSR] Render error:', err)
    // 降级: 返回未渲染的 SPA shell
    if (htmlTemplate) {
      return res.type('html').send(htmlTemplate)
    }
    res.status(500).send('SSR render failed')
  }
})

// -----------------------------------------------------------
// 启动
// -----------------------------------------------------------
async function start() {
  loadHtmlTemplate()
  try {
    await loadRenderer()
  } catch (err) {
    console.error('[SSR] Failed to load renderer:', err)
    console.error('[SSR] Server will start but /render will return 503 until renderer is loaded.')
  }

  app.listen(PORT, () => {
    console.log(`[SSR] Server running on http://0.0.0.0:${PORT}`)
    console.log(`[SSR] Full HTML:  GET /any-path`)
    console.log(`[SSR] JSON:       GET /render?path=/courses/123`)
    console.log(`[SSR] Health:     GET /health`)
    console.log(`[SSR] SITE_BASE:  "${process.env.SITE_BASE || '(empty)'}"`)
  })
}

start()
