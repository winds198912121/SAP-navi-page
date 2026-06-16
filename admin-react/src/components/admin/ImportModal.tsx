// ===========================================================
// ImportModal — Excel インポートモーダル
// ===========================================================

import { useState, useRef } from 'react'
import { readExcelFile, downloadTemplate, type ColumnDef, type ImportResult } from '../../services/import-export'

interface ImportModalProps {
  columns: ColumnDef[]
  templateFilename: string
  onImport: (rows: Record<string, any>[]) => Promise<ImportResult>
  onClose: () => void
}

export default function ImportModal({ columns, templateFilename, onImport, onClose }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<Record<string, any>[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (f: File) => {
    setFile(f)
    try {
      const { data } = await readExcelFile<Record<string, any>>(f)
      setPreview(data.slice(0, 5))
    } catch { setPreview([]) }
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { data } = await readExcelFile<Record<string, any>>(file)
      const res = await onImport(data)
      setResult(res)
    } catch (err: any) {
      setResult({ success: 0, failed: preview.length || 1, errors: [{ row: 0, message: err.message || '不明なエラー' }] })
    }
    setLoading(false)
  }

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        {!result ? (
          <>
            <div className="admin-modal-head">
              <h3>📥 Excel インポート</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>×</button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 16px', lineHeight: 1.7 }}>
                Excelファイル（.xlsx）をアップロードして一括インポートします。
                1行目がヘッダー行として扱われます。
              </p>
              <button className="admin-btn admin-btn-sm" onClick={() => downloadTemplate(columns, templateFilename)}
                style={{ marginBottom: 16 }}>
                📄 テンプレートをダウンロード
              </button>

              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed var(--line-2)', borderRadius: 'var(--r-md)',
                  padding: 32, textAlign: 'center', cursor: 'pointer',
                  background: file ? 'var(--accent-soft)' : 'var(--bg-1)',
                  transition: 'all .15s', marginBottom: 16,
                }}>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>✅</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>クリックしてファイルを選択</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>.xlsx 形式</div>
                  </div>
                )}
              </div>

              {preview.length > 0 && (
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6 }}>
                  プレビュー（先頭{preview.length}行）:
                </div>
              )}
              {preview.length > 0 && (
                <div style={{ overflowX: 'auto', marginBottom: 16, border: '1px solid var(--line-1)', borderRadius: 'var(--r-sm)' }}>
                  <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tint)' }}>
                        {Object.keys(preview[0]).map(k => (
                          <th key={k} style={{ padding: '4px 8px', textAlign: 'left', whiteSpace: 'nowrap', fontWeight: 600 }}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--line-1)' }}>
                          {Object.values(row).map((v: any, j) => (
                            <td key={j} style={{ padding: '4px 8px', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(v).slice(0, 40)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn" onClick={onClose}>キャンセル</button>
              <button className="admin-btn admin-btn-primary" onClick={handleImport} disabled={!file || loading}>
                {loading ? 'インポート中...' : 'インポート実行'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="admin-modal-head">
              <h3>📋 インポート結果</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--ink-3)' }}>×</button>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{result.failed === 0 ? '✅' : '⚠️'}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                {result.success} 件成功 / {result.failed} 件失敗
              </div>
              {result.errors.length > 0 && (
                <div style={{ textAlign: 'left', fontSize: 12, color: 'var(--rose)', maxHeight: 150, overflowY: 'auto', background: 'var(--rose-soft)', borderRadius: 'var(--r-sm)', padding: 12, marginTop: 12 }}>
                  {result.errors.map((e, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>行{e.row}: {e.message}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-primary" onClick={onClose}>閉じる</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
