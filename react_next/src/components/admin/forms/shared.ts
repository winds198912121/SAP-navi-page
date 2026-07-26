'use client'

export const SAP_MODULES = [
  { slug: 'fi', code: 'FI', name_ja: '財務会計', name_en: 'Financial Accounting' },
  { slug: 'co', code: 'CO', name_ja: '管理会計', name_en: 'Controlling' },
  { slug: 'mm', code: 'MM', name_ja: '購買・在庫', name_en: 'Material Management' },
  { slug: 'sd', code: 'SD', name_ja: '販売管理', name_en: 'Sales & Distribution' },
  { slug: 'pp', code: 'PP', name_ja: '生産計画', name_en: 'Production Planning' },
  { slug: 'hr', code: 'HR', name_ja: '人事管理', name_en: 'Human Resources' },
  { slug: 'abap', code: 'ABAP', name_ja: '開発言語', name_en: 'ABAP' },
  { slug: 'basis', code: 'Basis', name_ja: '基盤管理', name_en: 'Basis' },
  { slug: 's4', code: 'S/4', name_ja: 'S/4HANA', name_en: 'Next-gen ERP' },
]

export const DIFFICULTIES = [
  { slug: 'beginner', name: '初級' },
  { slug: 'intermediate', name: '中級' },
  { slug: 'advanced', name: '上級' },
]

export const TOPICS = [
  { slug: 'basic', name: '基本概念' },
  { slug: 'master', name: 'マスタ' },
  { slug: 'transaction', name: 'トランザクション' },
  { slug: 'process', name: 'プロセス' },
  { slug: 'glossary', name: '用語集' },
  { slug: 'trends', name: 'SAPトレンド' },
  { slug: 'career-guide', name: '転職ガイド' },
]
