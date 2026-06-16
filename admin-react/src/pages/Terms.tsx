// ===========================================================
// Terms — 利用規約 /terms
// WP管理画面から編集 ⇒ API経由で表示（未編集時はデフォルト内容）
// ===========================================================
import { useState, useEffect } from 'react'
import api from '../services/api'
import StaticPage from '../components/layout/StaticPage'

const DEFAULT_CONTENT = `
  <h2>はじめに</h2>
  <p>本規約は、SAP パンダ先生 NAVI（以下「当サイト」）の利用条件を定めるものです。当サイトをご利用になることで、本規約に同意したものとみなします。</p>
  <h2>知的財産権</h2>
  <p>当サイトに掲載されている記事、画像、ロゴ等のコンテンツは、特別な断りがない限り運営者に帰属します。無断転載・複製を禁止します。</p>
  <h2>禁止行為</h2>
  <p>当サイトのご利用にあたり、以下の行為を禁止します：</p>
  <ul><li>他のユーザーまたは第三者に迷惑・不利益を与える行為</li><li>当サイトの運営を妨害する行為</li><li>法令または公序良俗に違反する行為</li><li>当サイトのコンテンツを無断で転載・複製する行為</li></ul>
  <h2>免責事項</h2>
  <p>当サイトの情報は、SAP に関する学習・参考を目的として提供されています。実際のシステム設定や運用は、必ず公式ドキュメントや専門家の指導のもとで行ってください。</p>
  <h2>規約の変更</h2>
  <p>当サイトは、予告なく本規約を変更することがあります。変更後の規約は、当サイトに掲載された時点で効力を生じるものとします。</p>
  <p style="margin-top:24px;color:var(--ink-2);font-size:13px">制定日: 2026年1月1日</p>
`.trim()

export default function Terms() {
  const [content, setContent] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.client.get('/pages', { params: { slug: 'terms' } })
      .then(({ data }) => {
        if (data.success && data.data?.content) {
          setContent(data.data.content)
        }
      }).catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <StaticPage title="利用規約" description="SAP パンダ先生 NAVI の利用規約。サイトご利用にあたっての条件、免責事項、禁止事項を定めます。" path="/terms">
      {!loaded ? (
        <div style={{ color: 'var(--ink-3)', padding: 20 }}>読み込み中...</div>
      ) : (
        <div className="art-content" dangerouslySetInnerHTML={{ __html: content || DEFAULT_CONTENT }} />
      )}
    </StaticPage>
  )
}
