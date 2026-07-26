// ============================================================
// SAP Modules constant data (matches admin-react/src/types)
// ============================================================

export interface SapModule {
  slug: string;
  code: string;
  name_ja: string;
  name_en: string;
  description: string;
  color: string;
  bg_color: string;
  article_count: number;
  levels: string[];
}

export const SAP_MODULES: SapModule[] = [
  { slug: 'fi', code: 'FI', name_ja: '財務会計', name_en: 'Financial Accounting', description: '会計帳簿、決算、勘定科目。経理担当が触る一番大事な土台。', color: '#2f6d44', bg_color: '#d8ead9', article_count: 48, levels: ['初級', '中級', '上級'] },
  { slug: 'co', code: 'CO', name_ja: '管理会計', name_en: 'Controlling', description: '原価計算、利益分析、予算管理。社内意思決定に効く。', color: '#2641a1', bg_color: '#dde4fc', article_count: 32, levels: ['初級', '中級'] },
  { slug: 'mm', code: 'MM', name_ja: '購買・在庫', name_en: 'Material Management', description: '購買依頼から入庫まで。サプライチェーンの心臓部。', color: '#a25411', bg_color: '#fde0c2', article_count: 41, levels: ['初級', '中級', '上級'] },
  { slug: 'sd', code: 'SD', name_ja: '販売管理', name_en: 'Sales & Distribution', description: '受注、出荷、請求。お客様への流れをぜんぶ管理。', color: '#b62a4a', bg_color: '#ffdfe6', article_count: 36, levels: ['初級', '中級', '上級'] },
  { slug: 'pp', code: 'PP', name_ja: '生産計画', name_en: 'Production Planning', description: 'MRP、BOM、製造指示。工場の動きをコントロール。', color: '#4828a8', bg_color: '#e4dffb', article_count: 22, levels: ['中級', '上級'] },
  { slug: 'hr', code: 'HR', name_ja: '人事管理', name_en: 'Human Resources', description: '人事マスタ、給与、勤怠。SuccessFactorsとの連携も。', color: '#8a6212', bg_color: '#fee9b3', article_count: 18, levels: ['初級', '中級'] },
  { slug: 'abap', code: 'ABAP', name_ja: '開発言語', name_en: 'ABAP', description: 'SAP独自の開発言語。アドオン、レポート、機能拡張に。', color: '#1f6f6f', bg_color: '#cfecec', article_count: 54, levels: ['初級', '中級', '上級'] },
  { slug: 'basis', code: 'Basis', name_ja: '基盤管理', name_en: 'Basis', description: 'システム運用、権限、パッチ。SAPの裏方。', color: '#4a432d', bg_color: '#e3e1d8', article_count: 26, levels: ['中級', '上級'] },
  { slug: 's4', code: 'S/4', name_ja: 'S/4HANA', name_en: 'Next-gen ERP', description: '次世代ERP。Fiori UI、HANA DB、シンプリフィケーション。', color: '#1864a3', bg_color: '#d1ecf9', article_count: 39, levels: ['初級', '中級', '上級'] },
];
