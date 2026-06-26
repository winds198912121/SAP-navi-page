<?php
/**
 * 学習パスの path_steps メタデータを生成（各ステップに8〜10の学習項目を設定）
 *
 * 使用方法： wp eval-file seed-path-steps-meta.php
 */

$path_step_items = [
  // SAP 超入門パス (ID: 2848)
  2848 => [
    [ // Step 1: SAP って何？
      'title' => 'SAP って何？ — 世界のERPを理解する',
      'time' => '20 min',
      'items' => [
        'SAP社の歴史と企業概要 — 1972年設立からの歩み',
        'ERP（Enterprise Resource Planning）の基本概念',
        'SAP R/2 → R/3 → ECC → S/4HANA の進化の歴史',
        'Fortune Global 500 の87%が導入する世界市場シェア',
        'オンプレミス、クラウド、ハイブリッドの導入形態',
        'SAPがカバーする業務領域（会計、物流、人事、製造）',
        'SAPを学ぶメリットとキャリアパス',
        'SAP業界の市場規模と将来性',
        '主要なSAP製品群（S/4HANA, BTP, SuccessFactors, Ariba）',
        'この学習パスの全体構成と学習の進め方',
      ],
    ],
    [ // Step 2: モジュール構成
      'title' => 'SAP のモジュール構成を覚えよう',
      'time' => '25 min',
      'items' => [
        'FI（財務会計）の役割 — 法定財務諸表の作成',
        'CO（管理会計）の役割 — 内部経営管理',
        'MM（購買管理）の役割 — 調達から在庫まで',
        'SD（販売管理）の役割 — 受注から出荷まで',
        'PP（生産計画）の役割 — MRPと生産実行',
        'HR / SuccessFactors の役割 — 人事管理と給与',
        'ABAP の役割 — SAP独自のプログラミング言語',
        'Basis の役割 — システム管理と運用基盤',
        'S/4HANA — 次世代ERPの全体像',
      ],
    ],
    [ // Step 3: 画面操作
      'title' => 'SAP システムの画面操作に慣れよう',
      'time' => '30 min',
      'items' => [
        'SAP GUI の起動とログイン手順',
        'トランザクションコード（T-Code）の基本',
        'SAP Easy Access メニューの使い方',
        'F1（ヘルプ）、F4（候補一覧）、F8（実行）のショートカット',
        '/n コマンドでセッション内を遷移する方法',
        '複数セッションの管理と切り替え',
        'Fiori Launchpad の基本操作',
        'お気に入り登錄と個人メニューのカスタマイズ',
        'ALVグリッドのソート・フィルタ・Excel出力',
      ],
    ],
  ],

  // FI/CO 会計マスターパス (ID: 2852)
  2852 => [
    ['title' => '財務会計の基礎概念', 'time' => '25 min', 'items' => [
      '財務会計（FI）の目的 — 外部報告と法定要件対応',
      '会社コード（Company Code）の概念と役割',
      '勘定科目表（Chart of Accounts）の構造',
      '会計伝票のヘッダと明細の基本構造',
      '借方（Debit）・貸方（Credit）と転記キー（40/50）',
      '会計年度と転記期間の管理',
      '伝票タイプ（SA/KR/DR/KZ）の種類と用途',
      'FIとCOの連携 — 一次原価要素の自動転送',
      '財務諸表（BS/PL）の作成プロセス',
    ]],
    ['title' => 'FI 基本設定とマスタデータ', 'time' => '30 min', 'items' => [
      'SPRO（IMG）を使ったカスタマイジングの基礎',
      '会社コード作成と基本パラメータ設定',
      '勘定科目マスタ（FS00）の作成 — 2階層構造',
      '取引先マスタ（得意先/仕入先）の登録手順',
      '番号範囲（勘定科目・伝票）の設定方法',
      '税コードの設定と自動計算ロジック',
      '会計年度バリアントと転記期間の定義',
      'マスタデータ品質管理のベストプラクティス',
      '設定後のテスト伝票による動作確認手順',
    ]],
    ['title' => '日常取引の処理', 'time' => '35 min', 'items' => [
      'FB50 一般仕訳入力の基本操作',
      'F-02 総勘定元帳転記とFB50の違い',
      'FBL5N 売掛金勘定照会と未清項管理',
      'F-28 入金処理と請求書消込（クリアリング）',
      'F-53 支払処理と自動支払プログラムF110',
      'FB08 伝票取消と逆仕訳の仕組み',
      'FBL1N 買掛金勘定照会と支払期日管理',
      '消込（クリアリング）の概念と運用ルール',
      '日常処理の正確性を高めるポイント',
    ]],
    ['title' => '管理会計（CO）の基礎', 'time' => '30 min', 'items' => [
      '管理会計（CO）の目的 — 経営意思決定支援',
      '原価センタ会計 — 部門別原価管理の仕組み',
      '内部受注 — プロジェクト別コスト管理',
      '配賦サイクル — 間接費の自動配賦',
      '製品原価計算（CO-PC）の基本フロー',
      '一次原価要素と二次原価要素の違い',
      '利益センタ会計と事業部別業績管理',
      'COレポートの活用 — 原価差異分析',
    ]],
    ['title' => '月次決算処理', 'time' => '40 min', 'items' => [
      '月次決算の全体フローと処理順序',
      'AFAB 減価償却実行の手順',
      '仮勘定の洗替処理（前払/未払/見越）',
      '試算表（S_ALR_87012277）での残高確認',
      'OB52 転記期間のオープン/クローズ制御',
      '決算整理仕訳の種類と入力方法',
      'F.13 自動消込による一括消込処理',
      '決算レポートの作成と経営陣への報告',
      '月次チェックリストによる品質管理',
    ]],
    ['title' => 'レポートと分析', 'time' => '25 min', 'items' => [
      'SAP標準レポートの種類と検索方法',
      'ALVグリッドの高度な活用テクニック',
      'レポート結果のExcel/PDF出力',
      'バリアント保存による定型レポートの自動化',
      'Fiori Analysis を使った直感的なデータ分析',
      'レポート間の数値整合性チェック',
      'SAP Analytics Cloud との連携',
    ]],
    ['title' => 'S/4HANA会計の新機能', 'time' => '30 min', 'items' => [
      'Universal Journal（ACDOCA）の概念とメリット',
      'FIとCOのリアルタイム統合によるデータ一貫性',
      'ドキュメント分割 — 複数基準での財務諸表作成',
      '新勘定科目表アプローチとグループ管理',
      '新Asset Accounting — 複数会計基準対応',
      '新銀行口座管理（Bank Account Management）',
      '簡素化リストの確認と移行影響分析',
      'S/4HANA会計への移行ベストプラクティス',
    ]],
  ],

  // ABAP 開発者養成パス (ID: 2860)
  2860 => [
    ['title' => 'ABAP 基本構文', 'time' => '30 min', 'items' => [
      'ABAPプログラムの構造（レポート / 汎用モジュール / クラス）',
      '基本データ型（C, N, I, P, D, T, F）とDATA宣言',
      '内部テーブル（STANDARD / SORTED / HASHED）の使い分け',
      '制御構文（IF, CASE, LOOP, DO, WHILE）',
      'ABAP 7.4 インライン宣言 DATA(var)',
      'テーブル式 itab[ key = val ] による簡潔なアクセス',
      '文字列テンプレート `Hello { name }` の活用',
      'MESSAGE命令によるユーザー通知',
    ]],
    ['title' => 'ABAP データベースアクセス', 'time' => '35 min', 'items' => [
      'Open SQL の基本（SELECT, INSERT, UPDATE, DELETE）',
      'SELECT文の効率的な書き方とパフォーマンス',
      'FOR ALL ENTRIES の正しい使い方と注意点',
      'JOIN（INNER/LEFT OUTER）を使ったテーブル結合',
      'SELECT SINGLE と UP TO 1 ROWS の使い分け',
      'データベース更新とLUW管理（COMMIT/ROLLBACK）',
      'ENQUEUE/DEQUEUE ロックメカニズム',
      'ST05 SQLトレースによるパフォーマンス分析',
    ]],
    ['title' => 'ABAP オブジェクト指向', 'time' => '30 min', 'items' => [
      'クラスとオブジェクトの基本概念',
      '継承（INHERITING FROM）によるコード再利用',
      'インターフェース（INTERFACE）による設計の柔軟性',
      'ALVオブジェクトモデル（CL_GUI_ALV_GRID）',
      'ABAP Unit による単体テスト',
      '依存性注入（Dependency Injection）パターン',
      'イベントハンドリング（RAISE EVENT / SET HANDLER）',
    ]],
    ['title' => 'CDS View とデータモデリング', 'time' => '35 min', 'items' => [
      'CDS Viewの基本構文とアノテーション',
      'Associationを使った関連定義と遅延評価',
      '@Semantics アノテーションによるセマンティクス定義',
      '@OData.publish によるODataサービス公開',
      '入力パラメータとフィルタ条件の定義',
      'DCL（Data Control Language）による行レベル権限',
      'CDS Viewのパフォーマンス最適化',
      '3層構造（基本→コンポジット→消費）のベストプラクティス',
    ]],
    ['title' => 'RAP モデル開発', 'time' => '40 min', 'items' => [
      'RAP（Restful ABAP Programming Model）の概要',
      'BDEF（Behavior Definition）によるCRUD定義',
      '早期番号割当と後期番号割当の使い分け',
      'DCLによるアクセス制御と権限管理',
      'Etagを使った楽観的ロック',
      'Service BindingでのOData公開',
      'RAPのデバッグとテストツール',
      'RAP × Fiori Elements の標準開発スタイル',
    ]],
    ['title' => 'Fiori アプリ開発', 'time' => '30 min', 'items' => [
      'Fiori設計思想（ロールベース・レスポンシブ・シンプル）',
      'Fiori Elements vs Freestyle の選択基準',
      'Fiori Launchpad のタイル・カタログ・ロール管理',
      'SAPUI5 のMVVMアーキテクチャ',
      'OData とデータバインディングの仕組み',
      'List Report / Object Page テンプレートの活用',
      'テーマカスタマイズとブランド適用',
      'SAP Buildとの統合とローコード開発の最新トレンド',
    ]],
  ],

  // MM/SD ロジスティクス実践パス (ID: 2867)
  2867 => [
    ['title' => 'ロジスティクスの全体像', 'time' => '25 min', 'items' => [
      'SAPロジスティクスの全体フロー（調達→生産→販売→出荷）',
      'プラント・保管場所・購買組織・販売組織の組織単位',
      '品目マスタ — MM/SD/PP 共通の基幹マスタデータ',
      'Procure-to-Pay（P2P）サイクルの全体像',
      'Order-to-Cash（O2C）サイクルの全体像',
      '自動勘定割当（Account Determination）の仕組み',
      'バッチ管理とトレーサビリティの基礎',
      '在庫管理の基本原則（数量管理と金額管理）',
      'グローバルロジスティクスとLEモジュール',
    ]],
    ['title' => 'MM 購買プロセス基礎', 'time' => '30 min', 'items' => [
      'ME51N 購買依頼の作成と承認フロー',
      'ME21N 発注書の作成と仕入先への送付',
      'MIGO 入庫処理と在庫の自動増加',
      'MIRO 請求書照合と数量/価格差異の確認',
      'メッセージ出力（NAST/新出力管理）の設定',
      '購買条件と価格決定の仕組み',
      'ME2L/ME2M/ME2N 購買実績レポートの活用',
      '購買プロセスの内部統制と監査対応',
    ]],
    ['title' => 'MM 在庫管理', 'time' => '30 min', 'items' => [
      '主要移動タイプ（101/102/201/202/301/311/561/551）',
      '棚卸の実務（MI01→MI04→MI07）の一連の流れ',
      '移動平均法と標準原価法の違いと選び方',
      'MMBE/MB52/MC.9 在庫照会と分析レポート',
      '在庫回転率・死蔵在庫率などのKPI管理',
      '在庫差異の原因分析と改善対策',
      '特殊在庫（預託/プロジェクト/受注）の管理',
      '在庫移動と会計転記の自動連携',
    ]],
    ['title' => 'MM 購買条件とソース決定', 'time' => '25 min', 'items' => [
      '外部調達・内部調達・外部加工のソース種類',
      'ソースリスト（ME01）と固定/準固定の設定',
      '購買条件レコード（MEK1）と数量スケール',
      '枠契約（ME31K）とリリース発注の運用',
      '見積依頼（ME41）と価格比較（ME47）の手順',
      '購買情報レコード（ME13）の活用',
      'MRP自動ソース決定の優先順位ロジック',
    ]],
    ['title' => 'SD 販売プロセス基礎', 'time' => '30 min', 'items' => [
      '販売組織・流通チャネル・部門と販売エリアの定義',
      'VA01 標準受注の作成手順',
      '受注伝票タイプ（TA/WK/WZ/RE）の使い分け',
      'VL01N 出荷伝票作成と出庫転記',
      'VF01 請求書作成と売上/原価の自動計上',
      '返品処理（クレジットメモ）の流れ',
      'VA05/VL06F/VF05 販売レポートの活用',
    ]],
    ['title' => 'SD 価格設定と条件技術', 'time' => '30 min', 'items' => [
      '条件技術の3層構造（条件テーブル→条件タイプ→アクセス順序）',
      '条件テーブルのキー項目設計',
      '価格決定手順（Procedure）とステップ制御',
      '主要条件タイプ（PR00/KA/K004/K005/MWST/FR1）',
      '価格決定の優先順位とアクセス順序',
      'VK11/VK13 条件マスタの保守と照会',
      'プロモーション価格と有効期間管理',
    ]],
    ['title' => 'SD 出荷と輸送', 'time' => '25 min', 'items' => [
      '出荷伝票タイプ（LF/LR/NL）と制御パラメータ',
      'ピッキングと在庫引当の自動処理',
      '出庫転記による在庫削減と売上原価計上',
      'VT01/VT02 輸送ルートと運送業者の管理',
      'VL06F 出荷一覧と進捗管理',
      '出荷リードタイム短縮のベストプラクティス',
    ]],
    ['title' => 'MM/SD 連携実務', 'time' => '30 min', 'items' => [
      'MMとSDの在庫共有とデータ一貫性',
      '受注連携購買 — 在庫不足時の自動購買依頼',
      'Make-to-OrderとSD-PP-MMの自動連鎖',
      'ATP（Available-to-Promise）ロジック',
      '出荷スケジュールと入荷スケジュールの調整',
      '原価フロー — 購買価格から販売原価まで',
      'CRM/Sales Cloudとの外部連携',
      '在庫充足率・リードタイムなどのKPI管理',
    ]],
  ],

  // S/4HANA 移行プロフェッショナルパス (ID: 2876)
  2876 => [
    ['title' => 'S/4HANA のアーキテクチャ理解', 'time' => '30 min', 'items' => [
      'S/4HANAの全体アーキテクチャと設計思想',
      'HANAインメモリデータベースの技術的特徴',
      'Simplification List — 移行前に確認すべき変更点',
      'Fiori標準UIとSAP GUIの役割変化',
      '3つのデプロイオプション（On-Premise/Cloud PE/Cloud Public）',
      'Embedded Analytics によるリアルタイム分析',
      'Fioriベースのセキュリティ/権限モデル',
      'SAP BTPとの統合と拡張シナリオ',
      'Clean Core戦略とは',
    ]],
    ['title' => '移行方式の選定', 'time' => '35 min', 'items' => [
      'Brownfield（システムコンバージョン）の特徴と要件',
      'Greenfield（新規導入）の特徴とメリット',
      'SAP Readiness Check 2.0 による準備状況評価',
      'Custom Code Migration — ATCによるアドオン分析',
      'TCO分析とROI試算のフレームワーク',
      'SAP Activate Methodology に沿った移行スケジュール',
      'プロジェクト組織体制と要員計画',
      '段階的移行とセレクティブ移行の選択肢',
      '方式選定の判断ポイントと意思決定基準',
    ]],
    ['title' => 'システム移行の実務', 'time' => '40 min', 'items' => [
      'SUM（Software Update Manager）によるシステムコンバージョン',
      'SAP Migration Cockpit を使ったデータ移行手順',
      '全データ移行 vs 必要データ移行の判断',
      'アドオンのS/4HANA対応確認と不適合修正',
      '5段階テスト戦略（単体・結合・UAT・性能・回帰）',
      'カットオーバー計画の立案と時間管理',
      'ロールバック計画と業務継続計画（BCP）',
      '移行後のパフォーマンス検証とチューニング',
    ]],
    ['title' => 'テスト計画と実行', 'time' => '30 min', 'items' => [
      'テスト戦略の策定とVモデル適用',
      '単体テスト（ABAP Unit/カスタマイズ設定確認）',
      '結合テスト — クロスモジュールシナリオ',
      'ユーザー受入テスト（UAT）の進め方',
      'テスト管理ツールと進捗レポーティング',
      'CBTA/Tosca/Worksoft による回帰テスト自動化',
      'バグ管理とトリアージプロセス',
      'テスト完了基準（合格率・クリティカルバグゼロ）',
    ]],
    ['title' => '運用移行とチェンジマネジメント', 'time' => '35 min', 'items' => [
      'プロジェクトから運用への移行計画と引継ぎ',
      '役割別エンドユーザートレーニングの設計と実施',
      '業務マニュアルと運用マニュアルの作成',
      'ADKARモデルに基づくチェンジマネジメント',
      'ハイパーケア期間の運営とユーザーサポート',
      'SLA/KPIの設定とサービスレベル管理',
      '継続的改善のサイクルとフィードバック収集',
      'ナレッジ移転と属人化防止策',
    ]],
  ],

  // SAP Basis & クラウドインフラパス (ID: 2882)
  2882 => [
    ['title' => 'SAP Basis の役割と基礎', 'time' => '25 min', 'items' => [
      'SAP Basisの役割とシステム管理の全体像',
      '3層アーキテクチャ（プレゼンテーション/アプリケーション/DB）',
      'SAPシステムの起動と停止手順',
      'CCMS（Computing Center Management System）監視',
      'ユーザー管理（SU01）とロール管理（PFCG）の基本',
      'クライアント管理とコピー戦略',
      'スプール管理と出力デバイスの設定',
      '定常運用タスク（日次/週次/月次）',
      'ST22（ABAPダンプ）とSM21（システムログ）の確認方法',
    ]],
    ['title' => 'ユーザー管理と権限設定', 'time' => '30 min', 'items' => [
      'SAP権限モデル（認証＋認可）の基礎',
      'PFCGによるロール作成とプロファイル生成',
      '権限オブジェクトとフィールド値の設定',
      'SU53 権限エラー分析とトレース',
      'SUIM 権限情報システムの活用',
      'SoD（職務分離）とSAP GRCの基礎',
      'Fiori権限モデル（カタログ/グループ/ロール）',
      'Firefighter IDの管理と監査対応',
      'パスワードポリシーとMFAの設定',
    ]],
    ['title' => 'トランスポート管理', 'time' => '25 min', 'items' => [
      'CTS（Change & Transport System）の全体像',
      'トランスポートルートとレイヤーの設定',
      'トランスポート要求（SE01/SE09）の作成とリリース',
      'インポートキューと順序管理',
      '組織分離戦略とチーム別レイヤー設計',
      'トランスポートエラーの原因特定と対処',
      'コンフリクト解消とマージ手順',
      'Release戦略（定期リリース/随時リリース）',
    ]],
    ['title' => 'SAP システム監視', 'time' => '30 min', 'items' => [
      'CCMSアラートツリーとしきい値設定',
      'ST03 ワークロード分析（CPU/応答時間/DB時間）',
      'ST04 SQL分析とバッファヒット率監視',
      'SM37 バックグラウンドジョブ監視とエラー対応',
      'DBACOCKPIT テーブルサイズ監視と容量計画',
      'SM59 RFC接続監視',
      'SM21 システムログ分析とセキュリティ監査',
      'SAP Focused Run / Cloud ALM のAI運用機能',
    ]],
    ['title' => 'バックアップとリカバリ', 'time' => '25 min', 'items' => [
      'フル＋差分＋ログ 3階層バックアップ戦略',
      'BRBACKUP/BRRESTORE によるバックアップ運用',
      '定期リストアテストの実施と検証',
      'クラウドバックアップ（AWS Backup / Azure Backup）',
      'データアーカイブ（ArchiveLink / ILM）戦略',
      '障害シナリオ別リカバリ手順',
      'HA（高可用性）構成とSystem Replication',
      'DR（災害復旧）とリージョン間レプリケーション',
    ]],
    ['title' => 'クラウド移行と運用', 'time' => '35 min', 'items' => [
      'SAP on Cloud の基礎とサービスモデル（IaaS/PaaS）',
      'Lift & Shift / Re-Platform / Re-Architect の移行パターン',
      'クラウドTCO試算とROI分析フレームワーク',
      '共有責任モデル（Shared Responsibility Model）',
      'AWS / Azure / GCP のSAP対応比較',
      'ハイブリッド運用戦略と使い分け',
      'IaC（Terraform）とクラウド自動化',
      'FinOpsによる継続的コスト最適化',
      'Dry Run実施と移行リハーサルのポイント',
    ]],
  ],
];

echo "=== 学習パス path_steps メタデータ生成 ===\n\n";
$updated = 0;
$total_steps = 0;
$total_items = 0;

foreach ($path_step_items as $path_id => $steps) {
  $path = get_post($path_id);
  if (!$path) {
    echo "⚠️ Path {$path_id} not found\n";
    continue;
  }

  // Build path_steps array with items
  $path_steps = [];
  $so = 0;
  foreach ($steps as $s) {
    $so++;
    // Find matching path_step CPT post
    $match = get_posts([
      'post_type' => 'path_step',
      'posts_per_page' => 1,
      'post_status' => 'publish',
      'meta_query' => [
        ['key' => 'step_path_id', 'value' => $path_id],
        ['key' => 'step_order', 'value' => $so],
      ],
      'fields' => 'ids',
    ]);
    $step_id = !empty($match) ? $match[0]->ID : 0;

    $item_count = count($s['items']);
    $path_steps[] = [
      'step_title' => $s['title'],
      'step_time' => $s['time'],
      'step_id' => $step_id,
      'items' => $s['items'],
    ];
    $total_steps++;
    $total_items += $item_count;
  }

  update_post_meta($path_id, 'path_steps', $path_steps);
  printf("  ✓ %-40s %d steps / %d items\n", mb_substr($path->post_title, 0, 36), count($steps), $total_items);
  $updated++;
}

echo "\n=== 完了 ===\n";
printf("更新パス: %d 件\n", $updated);
printf("全ステップ: %d 件\n", $total_steps);
printf("全学習項目: %d 件（平均 %.1f 件/step）\n", $total_items, $total_items / max($total_steps, 1));
