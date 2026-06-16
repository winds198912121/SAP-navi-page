/** 目次クリック時のスムーススクロール。固定ヘッダー（~80px）のオフセット考慮 */
export function scrollToHeading(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

/** throttle — スクロール等の高頻度イベントを間引く（モバイル省電力） */
export function throttle<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let last = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - last >= ms) {
      last = now
      fn(...args)
    }
  }) as T
}

/** API レスポンスの日付フィールド（created_at / createdAt 混在対応）を整形 */
export function formatDate(article: any): string {
  const raw = article.createdAt || article.created_at
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString('ja-JP')
  } catch {
    return ''
  }
}
