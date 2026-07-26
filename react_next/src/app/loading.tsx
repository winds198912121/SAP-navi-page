export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🐼</div>
        <div style={{ color: 'var(--ink-2)', fontSize: 14 }}>読み込み中...</div>
      </div>
    </div>
  );
}
