// ===========================================================
// import-export.ts — Excel インポート/エクスポート共通処理
// ===========================================================

import * as XLSX from 'xlsx'
import api from './api'

// ---- 型定義 ----
export interface ColumnDef {
  key: string
  label: string
  width?: number
}

export interface ImportResult {
  success: number
  failed: number
  errors: { row: number; message: string }[]
}

// ---- Export ----
/** データをExcelファイルとしてダウンロード */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ColumnDef[],
  filename: string,
) {
  const rows = data.map(item => {
    const row: Record<string, any> = {}
    columns.forEach(col => {
      row[col.label] = item[col.key] ?? ''
    })
    return row
  })

  const ws = XLSX.utils.json_to_sheet(rows)
  if (columns.some(c => c.width)) {
    ws['!cols'] = columns.map(c => ({ wch: c.width || 20 }))
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ---- Import ----
/** Excelファイルを読み込んでJSONに変換 */
export function readExcelFile<T>(file: File): Promise<{ data: T[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        if (!ws) { reject(new Error('シートが見つかりません')); return }
        const json = XLSX.utils.sheet_to_json<T>(ws, { defval: '' })
        resolve({ data: json, errors: [] })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('ファイル読み込み失敗'))
    reader.readAsArrayBuffer(file)
  })
}

/** テンプレート用空Excelを生成してダウンロード */
export function downloadTemplate(columns: ColumnDef[], filename: string) {
  const row: Record<string, any> = {}
  columns.forEach(col => { row[col.label] = '' })
  const ws = XLSX.utils.json_to_sheet([row])
  if (columns.some(c => c.width)) {
    ws['!cols'] = columns.map(c => ({ wch: c.width || 20 }))
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.writeFile(wb, `${filename}_template.xlsx`)
}
