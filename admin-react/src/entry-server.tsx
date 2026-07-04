/**
 * SSR 服务端入口
 *
 * 由 Node Express SSR 服务器调用, 将 React 应用渲染为 HTML 字符串。
 * 使用 StaticRouter 在服务端匹配路由, 不依赖浏览器 API。
 */

import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { AuthProvider } from './hooks/useAuth'

export interface RenderOptions {
  /** 路由路径（不含 basename, 如 /courses/123） */
  path: string
  /** React Router basename（如 /sap） */
  basename?: string
}

export interface RenderResult {
  /** 渲染出的 HTML 字符串（<div id="root"> 内部内容） */
  html: string
}

/**
 * 将 React 应用渲染为 HTML 字符串。
 * 仅在服务端调用, 不在客户端执行。
 */
export function render(options: RenderOptions): RenderResult {
  const { path, basename = '' } = options

  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={path} basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StaticRouter>
  )

  return { html: appHtml }
}
