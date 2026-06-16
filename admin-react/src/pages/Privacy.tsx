// ===========================================================
// Privacy — プライバシーポリシー /privacy
// WP管理画面から編集 ⇒ API経由で表示（未編集時はデフォルト内容）
// ===========================================================
import { useState, useEffect } from 'react'
import api from '../services/api'
import StaticPage from '../components/layout/StaticPage'

const DEFAULT_CONTENT = `
  <h2>個人情報の収集について</h2>
  <p>当サイトでは、お問い合わせフォームの送信時に、お名前・メールアドレス等の個人情報をご提供いただく場合がございます。これらの情報は、お問い合わせへの回答のみに利用し、同意なく第三者に提供することはありません。</p>
  <h2>アクセス解析について</h2>
  <p>当サイトでは、サービス向上のためアクセスログを収集することがあります。収集される情報には、閲覧されたページ、日時、ブラウザの種類などが含まれますが、個人を特定する目的では使用しません。</p>
  <h2>Cookie について</h2>
  <p>当サイトでは、ユーザー体験向上のために Cookie を使用することがあります。ブラウザの設定で Cookie を無効にすることも可能です。</p>
  <h2>免責事項</h2>
  <p>当サイトに掲載されている情報の正確性には細心の注意を払っていますが、その完全性・正確性を保証するものではありません。当サイトの情報を利用したことによる損害について、運営者は一切の責任を負いかねます。</p>
  <h2>お問い合わせ</h2>
  <p>プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
`.trim()

export default function Privacy() {
  const [content, setContent] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.client.get('/pages', { params: { slug: 'privacy' } })
      .then(({ data }) => {
        if (data.success && data.data?.content) {
          setContent(data.data.content)
        }
      }).catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <StaticPage title="プライバシーポリシー" description="SAP パンダ先生 NAVI（sap-navi.aladdin-techec.com）のプライバシーポリシー。個人情報の取り扱い、Cookie ポリシーについて説明します。" path="/privacy">
      {!loaded ? (
        <div style={{ color: 'var(--ink-3)', padding: 20 }}>読み込み中...</div>
      ) : (
        <div className="art-content" dangerouslySetInnerHTML={{ __html: content || DEFAULT_CONTENT }} />
      )}
    </StaticPage>
  )
}
