// ===========================================================
// SAP パンダ先生 — TypeScript 类型定义
// ===========================================================

/** SAP 模块 */
export interface SapModule {
  slug: string
  code: string
  name_ja: string
  name_en: string
  description: string
  color: string
  bg_color: string
  article_count: number
  levels: string[]
}

/** 文章 */
export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content?: string
  modules: { slug: string; name: string }[]
  difficulty: { slug: string; name: string }
  topic?: { slug: string; name: string }
  author: { id: number; displayName: string; avatar?: string }
  readingTime: number
  views: number
  featuredImage?: string
  createdAt: string
}

/** 学习路径 */
export interface LearningPath {
  id: number
  audience: string
  title: string
  description: string
  steps: { title: string; time: string }[]
  duration: string
  accent: string
}

/** 每日一题 */
export interface Quiz {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  module?: string
  difficulty?: string
}

/** コース */
export interface Course {
  id: number
  title: string
  excerpt?: string
  content?: string
  duration?: string
  price: number
  module: { slug: string; name: string } | null
  difficulty?: { slug: string; name: string } | null
  instructor?: string
  thumbnail?: string
  created_at: string
  updated_at?: string
}

/** コース作成/編集フォーム */
export interface CourseFormData {
  title: string
  excerpt?: string
  content?: string
  module?: string
  difficulty?: string
  price: number
  duration?: string
}

/** ナレッジ */
export interface SapKnowledge {
  id: number
  title: string
  excerpt?: string
  content?: string
  module: { slug: string; name: string } | null
  type?: string
  difficulty?: { slug: string; name: string } | null
  references?: { url: string; label: string }[]
  created_at: string
  updated_at?: string
}

/** ナレッジ作成/編集フォーム */
export interface KnowledgeFormData {
  title: string
  excerpt?: string
  content?: string
  module?: string
  type?: string
  difficulty?: string
}

/** 案件 */
export interface SapCase {
  id: number
  mods: string[]
  title: string
  rate_min: number
  rate_max: number
  rate_label: string
  hi: boolean
  period: string
  utilization: string
  location: string
  remote: string
  experience: string
  seats: number
  urgent: boolean
  scarce: boolean
  skills_must: string[]
  skills_want: string[]
  blurb: string
  company: string
  created_at: string
}

/** 用户 */
export interface User {
  id: number
  email: string
  displayName: string
  avatarUrl?: string
  roles: string[]
  stats?: {
    articlesRead: number
    quizzesAnswered: number
    quizAccuracy: number
    points: number
    streak: number
  }
}

/** 主题 */
export type ThemePalette = 'bamboo' | 'warm' | 'fresh'
export type AnimationIntensity = 'off' | 'light' | 'medium'

export interface ThemeSettings {
  palette: ThemePalette
  reading: number
  intensity: AnimationIntensity
  showFloatingPanda: boolean
}

/** API 通用响应 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  total?: number
  page?: number
  perPage?: number
  totalPages?: number
}

/** 常量数据 */
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
]

export const NAV_LINKS = [
  { id: 'home', label: 'ホーム', href: '/' },
  { id: 'modules', label: 'モジュール', href: '/modules' },
  { id: 'paths', label: '学習パス', href: '/paths' },
  { id: 'quiz', label: '今日の一問', href: '/quiz-page' },
  { id: 'cases', label: '案件・仕事', href: '/cases' },
  { id: 'yt', label: '動画', href: '/video' },
]

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 1,
    audience: '新人さん向け',
    title: 'SAPって何？からはじめる入門コース',
    description: '初日からつまずきがちな用語と基本フローをやさしく整理。3週間で全体像をつかむ。',
    steps: [
      { title: 'SAPの世界観を知る', time: '20 min' },
      { title: 'GUI 操作の基本', time: '30 min' },
      { title: 'マスタとトランザクション', time: '40 min' },
      { title: 'はじめての仕訳入力', time: '45 min' },
    ],
    duration: '約 3 週間 · 12 本',
    accent: '#5a9d6e',
  },
  {
    id: 2,
    audience: 'コンサル中級',
    title: 'プロジェクトで通用する設計力',
    description: 'Fit/Gap、業務プロセス設計、カスタマイズ判断。経験 1〜3 年目のあなたに。',
    steps: [
      { title: '要件定義の進め方', time: '50 min' },
      { title: '組織構造の設計', time: '60 min' },
      { title: 'マスタ設計のコツ', time: '45 min' },
      { title: 'テストシナリオ作成', time: '40 min' },
    ],
    duration: '約 6 週間 · 18 本',
    accent: '#d97548',
  },
  {
    id: 3,
    audience: '開発者向け',
    title: 'ABAP × S/4HANA モダン開発',
    description: 'CDS Views、AMDP、RAP — 新世代の ABAP 開発作法をパンダ先生と一緒に。',
    steps: [
      { title: 'モダン ABAP 構文', time: '40 min' },
      { title: 'CDS Views 入門', time: '55 min' },
      { title: 'OData サービス公開', time: '50 min' },
      { title: 'Fiori 連携の基礎', time: '60 min' },
    ],
    duration: '約 8 週間 · 24 本',
    accent: '#d96570',
  },
]

export const ARTICLE_DATA = [
  { mod: 'FI', modLabel: '財務会計', diff: 1, diffLabel: '初級', title: '「仕訳」って結局なに？借方・貸方の覚え方をパンダ先生が一発で解説', excerpt: '簿記の本を読んでも頭に入らない…そんなあなたへ。覚えるべきは「左右がイコール」というたった一つのルールだけ。', author: 'パンダ先生', date: '3日前', mins: 6, views: '12.4k', cover: 'fi', scene: 'class' },
  { mod: 'ABAP', modLabel: 'ABAP', diff: 2, diffLabel: '中級', title: 'SELECT 文のパフォーマンス改善 — INDEX を使うべき5つの場面', excerpt: '本番環境で動かないコードはコードじゃない。実例コード付きで、明日から効く ABAP の高速化テクニック。', author: 'タナカ', date: '5日前', mins: 12, views: '8.7k', cover: 'abap', scene: 'learning' },
  { mod: 'MM', modLabel: '購買・在庫', diff: 1, diffLabel: '初級', title: '購買依頼 → 注文 → 入庫 → 請求 — MM の基本フロー完全図解', excerpt: '伝票がどう変わっていくのか、図でつかむ。新人配属時に「これ知ってる前提」とされがちなあの流れ。', author: 'パンダ先生', date: '1週間前', mins: 8, views: '15.2k', cover: 'mm', scene: 'blackboard' },
  { mod: 'S/4', modLabel: 'S/4HANA', diff: 3, diffLabel: '上級', title: 'ECC からの移行プロジェクト — 失敗パターン7選と対策', excerpt: 'Brownfield か Greenfield か。現役 PM が語る、ふつうの記事には書いてない泥臭い話。', author: 'サトウ', date: '1週間前', mins: 15, views: '9.1k', cover: 's4', scene: 'class' },
  { mod: 'CO', modLabel: '管理会計', diff: 2, diffLabel: '中級', title: '原価センタと利益センタ、ぶっちゃけ何が違うの？', excerpt: '似てるけど別物。組織構造をどう設計すべきか、現場の意思決定とどう繋がるかを実例で。', author: 'パンダ先生', date: '10日前', mins: 7, views: '6.5k', cover: 'co', scene: 'highfive' },
]

export const TOP10 = [
  '【保存版】SAP用語集 — はじめての100単語',
  'BAPI とは何か、なぜ使うのか — 5分で理解',
  'Fiori vs SAP GUI — 結局どう使い分ける？',
  'T-Code 早見表（よく使う 50 個）',
  'ABAP オブジェクト指向 完全入門',
  'MMの移動タイプ、覚えるならこの10個',
  'S/4HANA 1909 → 2023 アップグレード手順',
  '新人コンサルが最初に読むべき本ベスト5',
  'BW/4HANA で BI 案件に挑戦するには',
  'パンダ先生に聞く：転職タイミングの見極め方',
]

export const QUIZ_DATA = [
  {
    question: '次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？',
    options: ['SA：一般仕訳', 'KR：仕入先請求書', 'DR：得意先請求書', 'XX：在庫移動仕訳'],
    correct: 3,
    explanation: '「XX」というドキュメントタイプは標準にはありません。在庫移動は FI ではなく MM 領域の話。',
  },
  {
    question: 'ABAP で SELECT ... INTO TABLE を高速に動かすコツとして「正しくない」のは？',
    options: ['WHERE 句にキー項目を入れる', 'INTO CORRESPONDING FIELDS を使う', '必要な列だけ取得する', '内部テーブルを事前に CLEAR する'],
    correct: 1,
    explanation: 'INTO CORRESPONDING FIELDS はマッピング処理が入るので「遅くなる」原因に！',
  },
]
