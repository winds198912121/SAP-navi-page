// ============================================================
// Utility helpers
// ============================================================

export const MODULE_NAMES: Record<string, string> = {
  fi: '財務会計', co: '管理会計', mm: '資材管理',
  sd: '販売管理', pp: '生産管理', hr: '人事管理',
  abap: 'ABAP', basis: 'BASIS', s4: 'S/4HANA',
};

export const MODULE_DESCS: Record<string, string> = {
  fi: '財務諸表・債権債務管理', co: '原価管理・利益管理',
  mm: '購買・在庫管理', sd: '受注・出荷・請求',
  pp: '生産計画・実行', hr: '給与・人材管理',
  abap: 'カスタム開発言語', basis: 'システム基盤管理',
  s4: '次世代ERPスイート',
};

export const MODULE_COLORS: Record<string, string> = {
  fi: '#e74c3c', co: '#f39c12', mm: '#2ecc71',
  sd: '#3498db', pp: '#9b59b6', hr: '#e91e63',
  abap: '#607d8b', basis: '#795548', s4: '#00bcd4',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '初級', intermediate: '中級', advanced: '上級',
};

export const DIFFICULTY_CLASSES: Record<string, string> = {
  beginner: 'badge-beginner', intermediate: 'badge-intermediate', advanced: 'badge-advanced',
};

export const TOPIC_NAMES: Record<string, string> = {
  glossary: '用語集', trends: 'トレンド', career: 'キャリアガイド',
};

export function moduleColor(slug: string): string {
  return MODULE_COLORS[slug] || '#4CAF50';
}

export function difficultyLabel(level: string): string {
  return DIFFICULTY_LABELS[level] || level;
}

export function difficultyClass(level: string): string {
  return DIFFICULTY_CLASSES[level] || '';
}

export function moduleName(slug: string): string {
  return MODULE_NAMES[slug] || slug.toUpperCase();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
}

export function truncate(text: string, len: number): string {
  if (!text || text.length <= len) return text || '';
  return text.slice(0, len) + '…';
}

export function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, '') || '';
}

export function excerpt(text: string, len = 120): string {
  return truncate(stripHtml(text), len);
}
