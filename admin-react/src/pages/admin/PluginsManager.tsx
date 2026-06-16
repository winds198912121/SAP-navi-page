// ===========================================================
// PluginsManager — プラグイン管理ページ
// ===========================================================
import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Plugin {
  file: string
  name: string
  version: string
  description: string
  author: string
  active: boolean
}

export default function PluginsManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')

  const loadPlugins = async () => {
    setLoading(true)
    try {
      const { data } = await api.client.get('/admin/plugins')
      if (data.success) setPlugins(data.data || [])
      else setError(data.message || '取得失敗')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'プラグイン一覧の取得に失敗しました')
    } finally { setLoading(false) }
  }

  useEffect(() => { loadPlugins() }, [])

  const togglePlugin = async (plugin: Plugin) => {
    setProcessing(plugin.file)
    setError('')
    setSuccessMsg('')
    try {
      const endpoint = plugin.active ? '/admin/plugins/deactivate' : '/admin/plugins/activate'
      const { data } = await api.client.post(endpoint, { file: plugin.file })
      if (data.success) {
        setPlugins(prev => prev.map(p => p.file === plugin.file ? { ...p, active: !p.active } : p))
        setSuccessMsg(`${plugin.name} を${plugin.active ? '無効化' : '有効化'}しました`)
      } else setError(data.message || '操作に失敗しました')
    } catch (err: any) {
      const statusText = err?.response?.statusText || 'サーバーエラー'
      const bodyMsg = typeof err?.response?.data === 'object' ? err?.response?.data?.message : null
      setError(bodyMsg || statusText)
      console.error('Plugin toggle failed:', err?.response || err)
    } finally { setProcessing(null) }
  }

  const filtered = search
    ? plugins.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    : plugins

  const activeCount = plugins.filter(p => p.active).length

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>プラグイン管理</h1>
          <p className="admin-page-desc">
            WordPress プラグインの有効/無効を管理します（{plugins.length} 個中 {activeCount} 個有効）
          </p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {successMsg && <div style={{ background: '#d8ead9', border: '1px solid rgba(90,157,110,0.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#3e7a52', marginBottom: 16 }}>{successMsg}</div>}

      <div className="admin-search-bar">
        <input className="admin-input" type="text" placeholder="プラグインを検索..." value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 250 }} />
        <button className="admin-btn" onClick={loadPlugins} disabled={loading}>🔄 再読み込み</button>
      </div>

      {loading ? <div className="admin-loading">読み込み中...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>状態</th>
                <th>プラグイン名</th>
                <th style={{ width: 100 }}>バージョン</th>
                <th>説明</th>
                <th style={{ width: 120 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty" style={{ padding: 20 }}>プラグインが見つかりません</div></td></tr>
              ) : filtered.map(plugin => (
                <tr key={plugin.file} style={{ opacity: plugin.active ? 1 : 0.55 }}>
                  <td>
                    <span style={{
                      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                      background: plugin.active ? '#5a9d6e' : '#d96570',
                    }} />
                    <span style={{ fontSize: 11, marginLeft: 6, color: plugin.active ? '#3e7a52' : '#d96570', fontWeight: 600 }}>
                      {plugin.active ? '有効' : '無効'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                      {plugin.file.includes('sap-panda-api') && <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#5a9d6e', color: 'white', fontWeight: 700, marginRight: 6 }}>コア</span>}
                      {plugin.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#7a6e58', marginTop: 2 }}>{plugin.author}</div>
                  </td>
                  <td className="admin-cell-date">{plugin.version}</td>
                  <td style={{ fontSize: 12, color: '#4a4030', maxWidth: 380, lineHeight: 1.5 }}>{plugin.description}</td>
                  <td>
                    {plugin.file.includes('sap-panda-api') ? (
                      <span style={{ fontSize: 11, color: '#7a6e58' }}>必須</span>
                    ) : (
                      <button
                        className={`admin-btn admin-btn-sm ${plugin.active ? '' : 'admin-btn-primary'}`}
                        onClick={() => togglePlugin(plugin)}
                        disabled={processing === plugin.file}
                      >
                        {processing === plugin.file ? '...' : plugin.active ? '無効化' : '有効化'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
