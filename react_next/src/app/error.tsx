'use client';

import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="not-found" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐼</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>エラーが発生しました</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 24 }}>申し訳ございません。予期しないエラーが発生しました。</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button onClick={reset} className="btn btn-primary">もう一度試す</button>
        <Link href="/" className="btn">トップページへ</Link>
      </div>
    </div>
  );
}
