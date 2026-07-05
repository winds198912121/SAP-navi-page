export default function AdminSeoGeo() {
  return (
    <>
      <h1 style={{marginBottom:'var(--spacing-xl)'}}>🌐 SEO/地域設定</h1>
      <div className="admin-form" style={{maxWidth:600}}>
        <div className="form-group"><label>サイトタイトル</label><input type="text" className="form-input" defaultValue="SAP パンダ先生 NAVI" /></div>
        <div className="form-group"><label>サイト説明</label><textarea className="form-input" rows={3} defaultValue="SAP学習プラットフォーム"></textarea></div>
        <button className="btn btn-primary">保存</button>
      </div>
    </>
  );
}
