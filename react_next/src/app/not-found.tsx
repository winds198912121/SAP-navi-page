import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="not-found">
      <div>
        <div className="not-found-icon">🐼</div>
        <h1>404</h1>
        <p style={{fontSize:'var(--text-xl)',fontWeight:700,marginBottom:'var(--spacing-sm)'}}>お探しのページは見つかりませんでした。</p>
        <p style={{color:'var(--color-text-light)',marginBottom:'var(--spacing-xl)'}}>ページが移動または削除された可能性があります。</p>
        <div style={{display:'flex',justifyContent:'center',gap:'var(--spacing-md)'}}>
          <Link href="/" className="btn btn-primary">トップページへ</Link>
          <Link href="/search" className="btn btn-outline">検索する</Link>
        </div>
      </div>
    </div>
  );
}
