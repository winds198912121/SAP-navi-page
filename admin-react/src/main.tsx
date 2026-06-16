import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SITE_BASE } from './config'
import App from './App'
import './styles/index.css'
import './styles/mobile-optimizations.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={SITE_BASE}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
