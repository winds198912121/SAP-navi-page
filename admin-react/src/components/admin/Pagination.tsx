// ===========================================================
// Pagination — 汎用ページネーション（...省略対応）
// ===========================================================

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'dots')[] = []

  if (totalPages <= 11) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    const start = Math.max(2, page - 5)
    const end = Math.min(totalPages - 1, page + 5)

    if (start > 2) pages.push('dots')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('dots')
    pages.push(totalPages)
  }

  return (
    <div className="admin-pagination">
      <button className="admin-btn admin-btn-sm" disabled={page <= 1}
        onClick={() => onChange(page - 1)}>← 前へ</button>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {pages.map((p, i) =>
          p === 'dots' ? (
            <span key={`dots-${i}`} style={{ fontSize: 12, color: 'var(--ink-3)', padding: '0 2px', userSelect: 'none' }}>…</span>
          ) : (
            <button key={p} onClick={() => onChange(p)}
              className="admin-btn admin-btn-sm"
              style={{
                minWidth: 34, justifyContent: 'center',
                background: p === page ? 'var(--accent)' : '',
                color: p === page ? 'white' : '',
                borderColor: p === page ? 'var(--accent)' : '',
              }}>
              {p}
            </button>
          )
        )}
      </div>
      <button className="admin-btn admin-btn-sm" disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}>次へ →</button>
      <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 8 }}>{page} / {totalPages} ページ</span>
    </div>
  )
}
