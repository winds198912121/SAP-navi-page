// ===========================================================
// SEO / GEO — SEO + Generative Engine Optimization
// 各ページで <Seo title="..." description="..." /> と使う
// 対応: OG / Twitter Card / JSON-LD (Article, Breadcrumb, Course, FAQ,
//        WebPage, SiteNav, Organization, SearchAction) / hreflang
// ===========================================================

import { useEffect } from 'react'

interface SeoProps {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  /** 記事の公開日（article 型の場合） */
  publishedTime?: string
  /** 記事の更新日 */
  modifiedTime?: string
  /** 著者名 */
  author?: string
  /** タグ（カンマ区切り文字列） */
  keywords?: string
  /** パンくずリスト */
  breadcrumbs?: { name: string; path: string }[]
  /** JSON-LD Article 本文サマリ */
  articleBody?: string
  /** ページ種別（GEO用：細かなページタイプ指定） */
  pageType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage' | 'ProfilePage' | 'SearchResultsPage'
}

const SITE_NAME = 'SAP パンダ先生 NAVI'
const SITE_NAME_ALT = 'SAP Panda Sensei'
const BASE_URL = 'https://sap-navi.aladdin-techec.com/sap'
const TWITTER_HANDLE = '@sap_panda'
const DEFAULT_DESC = 'SAP のしくみを、パンダ先生がやさしく解説。財務・購買・販売・生産・人事 — むずかしい SAP を、たろうくんと一緒に「わからない…！」から「なるほど！」へ。'
const DEFAULT_KEYWORDS = 'SAP,S/4HANA,ERP,会計,ABAP,FI,CO,MM,SD,学習,パンダ先生,ナレッジ,SAP資格,SAPコンサル'
const FOCUS_KEYPHRASES = ['SAP 学習', 'SAP 基礎知識', 'SAP モジュール解説', 'SAP 資格対策', 'SAP コンサル転職']

/** JSON-LD スクリプト管理 */
function upsertLd(id: string, data: Record<string, unknown>) {
  const existing = document.getElementById(id) as HTMLScriptElement | null
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data })
  document.head.appendChild(script)
}

function removeLd(id: string) {
  document.getElementById(id)?.remove()
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function removeMeta(name: string, property = false) {
  const attr = property ? 'property' : 'name'
  document.querySelector(`meta[${attr}="${name}"]`)?.remove()
}

export default function Seo({
  title, description, path, image, type = 'website',
  noindex, publishedTime, modifiedTime, author, keywords,
  breadcrumbs, articleBody, pageType = 'WebPage',
}: SeoProps) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const desc = description || DEFAULT_DESC
  const kw = keywords || DEFAULT_KEYWORDS
  const url = path ? `${BASE_URL}${path}` : BASE_URL
  const img = image || `${BASE_URL}/panda-sensei.png`

  useEffect(() => {
    // ---- Title ----
    document.title = pageTitle

    // ---- Basic meta ----
    setMeta('description', desc)
    setMeta('keywords', kw)

    // ---- Robots ----
    if (noindex) setMeta('robots', 'noindex,nofollow')
    else removeMeta('robots')

    // ---- Canonical ----
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // ---- hreflang ----
    const ensureLink = (rel: string, hrefLang: string, href: string) => {
      const sel = `link[rel="${rel}"][hreflang="${hrefLang}"]`
      let el = document.querySelector(sel) as HTMLLinkElement | null
      if (!el) {
        el = document.createElement('link')
        el.rel = rel
        el.hreflang = hrefLang
        document.head.appendChild(el)
      }
      el.href = href
    }
    ensureLink('alternate', 'ja', url)
    ensureLink('alternate', 'x-default', url)

    // ---- OG ----
    setMeta('og:title', pageTitle, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)
    setMeta('og:site_name', SITE_NAME, true)
    setMeta('og:image', img, true)
    setMeta('og:image:width', '1200', true)
    setMeta('og:image:height', '630', true)
    setMeta('og:locale', 'ja_JP', true)

    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true)
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true)
      if (author) setMeta('article:author', author, true)
    }

    // ---- Twitter Card ----
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', TWITTER_HANDLE)
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', img)

    // ============================================================
    // JSON-LD: 全ページ共通
    // ============================================================

    // --- WebSite ---
    upsertLd('seo-website-ld', {
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: SITE_NAME_ALT,
      url: BASE_URL,
      description: DEFAULT_DESC,
      inLanguage: 'ja-JP',
      isAccessibleForFree: true,
      keywords: DEFAULT_KEYWORDS,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    })

    // --- Organization ---
    upsertLd('seo-org-ld', {
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: [SITE_NAME_ALT, 'SAP Panda Academy'],
      url: BASE_URL,
      logo: `${BASE_URL}/panda-sensei.png`,
      description: DEFAULT_DESC,
      foundingDate: '2025',
      sameAs: [
        'https://twitter.com/sap_panda',
        'https://www.youtube.com/@sap-panda',
      ],
      knowsAbout: ['SAP', 'ERP', 'S/4HANA', 'ABAP', '会計システム', 'ビジネス改革'],
    })

    // --- SiteNavigationElement （GEO: AIにサイト構造を伝える） ---
    upsertLd('seo-sitenav-ld', {
      '@type': 'SiteNavigationElement',
      name: SITE_NAME,
      hasPart: [
        { '@type': 'WebPage', name: 'ホーム', url: `${BASE_URL}/` },
        { '@type': 'WebPage', name: 'モジュール一覧', url: `${BASE_URL}/modules` },
        { '@type': 'WebPage', name: '学習パス', url: `${BASE_URL}/paths` },
        { '@type': 'WebPage', name: '用語集', url: `${BASE_URL}/glossary` },
        { '@type': 'WebPage', name: 'SAPトレンド', url: `${BASE_URL}/trends` },
        { '@type': 'WebPage', name: '転職ガイド', url: `${BASE_URL}/career` },
        { '@type': 'WebPage', name: '検索', url: `${BASE_URL}/search` },
      ],
    })

    // --- BreadcrumbList ---
    if (breadcrumbs && breadcrumbs.length > 0) {
      upsertLd('seo-breadcrumb-ld', {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: `${BASE_URL}${b.path}`,
        })),
      })
    } else {
      removeLd('seo-breadcrumb-ld')
    }

    // ============================================================
    // JSON-LD: 記事（Article）
    // ============================================================
    if (type === 'article' && title) {
      upsertLd('seo-article-ld', {
        '@type': 'Article',
        headline: title,
        description: desc,
        image: img,
        author: author
          ? { '@type': 'Person', name: author }
          : { '@type': 'Organization', name: SITE_NAME },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/panda-sensei.png` },
        },
        datePublished: publishedTime || new Date().toISOString(),
        dateModified: modifiedTime || publishedTime || new Date().toISOString(),
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: 'ja-JP',
        isAccessibleForFree: true,
        ...(articleBody ? { articleBody } : {}),
      })
    } else {
      removeLd('seo-article-ld')
    }

    // ============================================================
    // JSON-LD: WebPage（ページ種別を明示 — GEO）
    // ============================================================
    upsertLd('seo-webpage-ld', {
      '@type': pageType,
      '@id': url,
      url: url,
      name: pageTitle,
      description: desc,
      inLanguage: 'ja-JP',
      isAccessibleForFree: true,
      about: FOCUS_KEYPHRASES.map(kp => ({ '@type': 'Thing', name: kp })),
      mainEntity: type === 'article' ? { '@type': 'Article', headline: title } : undefined,
    })

    // ============================================================
    // JSON-LD: FAQ（全ページ共通 — AIが回答として引用しやすくなる）
    // ============================================================
    if (pageType === 'FAQPage' || breadcrumbs?.some(b => b.path.includes('faq'))) {
      const faqs = [
        { q: 'SAPとは何ですか？', a: 'SAPは、ドイツに本社を置く世界最大級のERPソフトウェア企業です。財務会計（FI）、管理会計（CO）、購買管理（MM）、販売管理（SD）などのモジュールで構成されます。' },
        { q: 'S/4HANAと従来のSAP ERPの違いは？', a: 'S/4HANAは次世代ERPで、インメモリDB（HANA）による高速処理、Fiori UI、AI機能統合が特徴です。' },
        { q: 'SAPコンサルタントになるには？', a: '特定モジュールの知識を深め、SAP公式認定資格を取得し、実務経験を積むことが重要です。' },
      ]
      upsertLd('seo-faq-ld', {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })
    } else {
      removeLd('seo-faq-ld')
    }

  }, [pageTitle, desc, url, img, type, noindex, kw, publishedTime, modifiedTime, author, breadcrumbs, articleBody, pageType])

  return null
}
