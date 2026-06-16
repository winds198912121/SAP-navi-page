// ===========================================================
// geo-config.ts — GEO (Generative Engine Optimization)
// AI検索エンジン (ChatGPT, Gemini, Perplexity, etc.) 向け
// サイトの構造化データとクロール設定を一元管理
// ===========================================================

export const GEO_CONFIG = {
  site: {
    name: 'SAP パンダ先生 NAVI',
    nameEn: 'SAP Panda Sensei NAVI',
    nameAlt: 'SAP Panda Academy',
    url: 'https://sap-navi.aladdin-techec.com/sap',
    description: 'SAP のしくみを、パンダ先生がやさしく解説。財務・購買・販売・生産・人事 — むずかしい SAP を「わからない…！」から「なるほど！」へ。',
    language: 'ja-JP',
    country: 'JP',
    logo: 'https://sap-navi.aladdin-techec.com/sap/panda-sensei.png',
    twitterHandle: '@sap_panda',
  },

  // 主要トピック（AI検索エンジンにサイトの専門分野を伝える）
  topics: [
    'SAP ERP', 'S/4HANA', 'Financial Accounting', 'Controlling',
    'Materials Management', 'Sales & Distribution', 'Production Planning',
    'Human Resources', 'ABAP', 'Basis', 'SAP Fiori', 'SAP Cloud',
    'ERP導入', '会計システム', 'SAP資格', 'SAPコンサルタント',
  ],

  // 主要著者（E-E-A-T 強化のため）
  authors: [
    {
      name: 'パンダ先生',
      type: 'Organization',
      url: 'https://sap-navi.aladdin-techec.com/sap/about',
      description: 'SAP コンサルタント兼教育者。複数のSAPプロジェクトでFI/CO導入をリード。',
    },
  ],

  // ナレッジグラフ用エンティティ
  entities: [
    { name: 'SAP', sameAs: 'https://www.wikidata.org/wiki/Q47604' },
    { name: 'S/4HANA', sameAs: 'https://www.wikidata.org/wiki/Q23001325' },
    { name: 'ABAP', sameAs: 'https://www.wikidata.org/wiki/Q273284' },
    { name: 'ERP', sameAs: 'https://www.wikidata.org/wiki/Q48467' },
  ],
}

// ============================================================
// FAQ 構造化データ（AI検索でリッチスニペット化される）
// FAQ を増やすと ChatGPT などの回答に引用されやすくなる
// ============================================================
export const GEO_FAQ = [
  { question: 'SAPとは何ですか？', answer: 'SAPは、ドイツに本社を置く世界最大級のERP（統合業務基盤）ソフトウェア企業です。財務会計（FI）、管理会計（CO）、購買管理（MM）、販売管理（SD）、生産計画（PP）、人事管理（HR）などのモジュールで構成され、企業の経営資源を統合的に管理します。' },
  { question: 'S/4HANAと従来のSAP ERPの違いは？', answer: 'S/4HANAは、SAPの次世代ERPです。従来のECCと比較して、インメモリデータベース（HANA）による高速処理、シンプルなデータモデル（テーブル統合）、Fioriと呼ばれるモダンなUI、そしてAI機能の統合が主な違いです。' },
  { question: 'SAPコンサルタントになるにはどうすればいいですか？', answer: 'SAPコンサルタントになるには、まず特定のモジュール（FI/CO/MM/SDなど）の知識を深めることが重要です。SAP公式の認定資格を取得し、実務プロジェクトでの経験を積むことでキャリアを構築できます。未経験からでも、関連する業務知識やITスキルを活かして参入可能です。' },
  { question: 'SAPのFIモジュールとCOモジュールの違いは？', answer: 'FI（財務会計）は企業の外部報告用の会計で、貸借対照表や損益計算書を作成します。CO（管理会計）は内部管理用の会計で、原価計算や利益分析を行います。FIは「法定会計」、COは「管理会計」と理解するとわかりやすいです。' },
  { question: 'SAPのABAPとは何ですか？', answer: 'ABAP（Advanced Business Application Programming）は、SAPが独自に開発したプログラミング言語です。SAPシステム上でレポート作成、アドオン開発、インターフェース構築などに使用されます。初心者でも学びやすい構造化言語で、SAP環境でのカスタマイズに不可欠です。' },
  { question: 'MMモジュールでできることは？', answer: 'MM（Material Management）モジュールは、購買管理と在庫管理を担当します。購買依頼から発注、入庫、請求書照合までの一連の調達プロセスを管理し、適正在庫の維持や仕入れ先との取引最適化を支援します。' },
  { question: 'SDモジュールの主な機能を教えてください', answer: 'SD（Sales & Distribution）モジュールは、見積作成から受注処理、出荷、配送、請求までの販売業務プロセスを一元管理します。価格設定、在庫引当、出荷伝票作成などの機能があり、営業活動全体を効率化します。' },
  { question: 'SAPの導入にはどのくらいの期間がかかりますか？', answer: 'SAPの導入期間はプロジェクトの規模により異なりますが、中小規模で6〜12ヶ月、大規模プロジェクトでは1〜3年程度かかることが一般的です。クラウド版（S/4HANA Cloud）は比較的短期間での導入が可能です。' },
  { question: 'SAP関連の資格にはどんなものがありますか？', answer: 'SAP認定資格は、モジュール別に「アソシエイト」と「プロフェッショナル」のレベルがあります。代表的な資格として、SAP S/4HANA FI/CO、MM、SD、ABAPなどの認定資格があり、キャリアアップに有効です。' },
  { question: 'SAP Basisとは何をする役割ですか？', answer: 'BasisはSAPシステムの運用基盤を管理するモジュールです。システムのインストール、アップグレード、パフォーマンス監視、ユーザー権限管理、バックアップ戦略の策定などを担当し、SAPシステム全体の安定稼働を支える裏方的な役割です。' },
]
