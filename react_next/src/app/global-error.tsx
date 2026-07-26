'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 20, background: '#f6f0e0', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: '5rem', marginBottom: 16 }}>🐼</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>重大なエラー</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>サーバーで問題が発生しました。しばらく経ってからもう一度お試しください。</p>
            <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 999, border: 'none', background: '#5a9d6e', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>再読み込み</button>
          </div>
        </div>
      </body>
    </html>
  );
}
