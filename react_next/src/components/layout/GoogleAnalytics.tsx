'use client'
// ===========================================================
// Google Analytics 4 — gtag.js
// NEXT_PUBLIC_GA_ID 環境変数で制御
// ===========================================================
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ページ遷移を page_view として送信
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !(window as any).gtag) return
    const url = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '')
    ;(window as any).gtag('config', GA_ID, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  // GA_ID が設定されていない場合は何もレンダリングしない
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
