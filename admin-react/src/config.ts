/**
 * SAP Panda サイト設定
 * WordPress サブディレクトリと API パスを一元管理。
 *
 * 例:
 *   本番: https://sap-navi.aladdin-techec.com/sap/
 *        → SITE_BASE = '/sap', API_BASE = '/sap/wp-json/sap/v1'
 *   ローカル: http://localhost/
 *        → SITE_BASE = '', API_BASE = '/wp-json/sap/v1'
 *
 * ページ内リンクは React Router の <Link> を使えば basename が自動付与される。
 * <a> タグや window.location を使う必要がある場合は p(path) ユーティリティを使う:
 *
 *   p('/privacy')  →  '/sap/privacy'  (本番)  /  '/privacy'  (ローカル)
 *   p('/')          →  '/sap/'         (本番)  /  '/'          (ローカル)
 */

// WordPress の wp_localize_script から渡されるデータ
const SAP_PANDA_DATA = (window as any).SAP_PANDA_DATA

/** WordPress 設置サブディレクトリ（例: /sap, /wordpress, ''） */
export const SITE_BASE: string = (() => {
  // SAP_PANDA_DATA から wpUrl のパス部分を抽出
  if (SAP_PANDA_DATA?.wpUrl) {
    try {
      return new URL(SAP_PANDA_DATA.wpUrl).pathname.replace(/\/+$/, '')
    } catch {
      // ignore
    }
  }
  // URL から自動検出: /sap/modules → /sap, /modules → ''
  const match = window.location.pathname.match(/^(\/[^/]+)\//)
  return match ? match[1] : ''
})()

/** REST API ベース URL */
export const API_BASE: string = SAP_PANDA_DATA?.restUrl?.replace(/\/+$/, '')
  || (SITE_BASE ? `${SITE_BASE}/wp-json/sap/v1` : '/wp-json/sap/v1')

/**
 * SITE_BASE を自動付与したページパスを返す。
 * React Router の <Link> が使えない <a> タグや window.location 向け。
 *
 * @example
 *   p('/privacy')   → '/sap/privacy'   (本番)
 *   p('/privacy')   → '/privacy'       (ローカル)
 */
export const p = (path: string): string =>
  SITE_BASE ? `${SITE_BASE}${path}` : path
