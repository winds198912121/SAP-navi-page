import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SITE_BASE } from './config'
import App from './App'
import './styles/index.css'
import './styles/mobile-optimizations.css'

// hydrateRoot instead of createRoot — 兼容 SSR 水合（hydration）
// 如果服务端没有 SSR 输出, hydrateRoot 会退化为普通渲染
ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <BrowserRouter basename={SITE_BASE}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
