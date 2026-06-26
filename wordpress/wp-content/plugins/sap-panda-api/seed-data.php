<?php
/**
 * SAP Panda 测试数据生成器
 *
 * 使用方法： wp eval-file seed-data.php
 * 或者放在插件目录，访问 example.com/wp-content/plugins/sap-panda-api/seed-data.php?run=1
 *
 * 注意：先确保 WordPress 环境已加载
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    // wp-cli 模式
    if (php_sapi_name() === 'cli') {
        // 确保在 WordPress 环境中运行
        if (!function_exists('wp_insert_post')) {
            fwrite(STDERR, "请在 WordPress 环境下运行此脚本（使用 wp eval-file）\n");
            exit(1);
        }
    } else {
        // Web 访问模式 - 需要登录且是管理员
        if (!isset($_GET['run']) || $_GET['run'] !== '1') {
            echo "<p>请在 URL 后添加 ?run=1 来执行</p>";
            exit;
        }
        if (!current_user_can('administrator')) {
            echo "<p>需要管理员权限</p>";
            exit;
        }
    }
}

echo "=== SAP Panda 测试数据生成器 ===\n\n";

// ----- 课程数据 -----
$courses = [
    [
        'title' => 'SAP FI/CO 基本設定入門',
        'excerpt' => '財務会計と管理会計の基本設定をステップバイステップで学びます。会社コードから利益センタまで。',
        'content' => '<h2>FI/CO 設定の基礎</h2><p>このコースでは SAP FI/CO モジュールの基本設定について学びます。</p><h3>会社コード設定</h3><p>会社コードは財務会計の中核となる組織単位です。会社コードの作成、編集、削除について解説します。</p><h3>勘定科目マスタ</h3><p>勘定科目の作成方法、グルーピング、および管理方法について詳しく説明します。</p><p>実践的な演習を通じて、実際のプロジェクトで必要なスキルを習得できます。パンダ先生が丁寧に解説します 🎋</p>',
        'module' => 'fi',
        'difficulty' => 'beginner',
        'price' => 0,
        'duration' => '2 weeks',
    ],
    [
        'title' => 'MM 購買プロセス完全マスター',
        'excerpt' => '購買依頼から発注、入庫、請求照合まで MM の全フローを実践的に学習。',
        'content' => '<h2>MM 購買プロセスの全体像</h2><p>購買プロセスは SAP MM の中核機能です。このコースでは一連の流れを習得します。</p><h3>購買依頼から発注へ</h3><p>購買依頼（PR）の作成、承認フロー、そして発注書（PO）への変換手順を学びます。</p><h3>入庫と請求照合</h3><p>入庫処理のやり方、請求書の照合、そして支払いブロックの解除までカバーします。</p>',
        'module' => 'mm',
        'difficulty' => 'beginner',
        'price' => 9800,
        'duration' => '3 weeks',
    ],
    [
        'title' => 'ABAP オブジェクト指向プログラミング',
        'excerpt' => 'クラス、インターフェース、継承を使いこなす。オブジェクト指向 ABAP の実践講座。',
        'content' => '<h2>オブジェクト指向 ABAP 入門</h2><p>ABAP のオブジェクト指向機能をゼロから学びます。</p><h3>クラスとオブジェクト</h3><p>クラスの定義、インスタンス生成、メソッド呼び出しの基本を解説。</p><h3>継承とポリモーフィズム</h3><p>継承を使ったコードの再利用、インターフェースによる設計の柔軟性向上について。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'price' => 19800,
        'duration' => '6 weeks',
    ],
    [
        'title' => 'SD 販売管理プロセス実践講座',
        'excerpt' => '見積から出荷、請求まで SD の一連業務をハンズオンで習得。',
        'content' => '<h2>SD モジュールの基本</h2><p>SD（販売管理）の基本プロセスを学びます。</p><h3>受注から出荷まで</h3><p>標準受注の入力方法、出荷伝票の作成、ピッキングから出荷までの流れを解説します。</p><h3>請求と売上計上</h3><p>請求伝票の作成、請求リスト、そして売上計上までのプロセスをカバー。</p>',
        'module' => 'sd',
        'difficulty' => 'beginner',
        'price' => 12800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'S/4HANA 移行プロジェクト実務',
        'excerpt' => 'Brownfield vs Greenfield、移行ツールの選定、データ移行計画の立て方。',
        'content' => '<h2>S/4HANA 移行の基礎知識</h2><p>ECC から S/4HANA への移行プロジェクトについて学びます。</p><h3>移行方式の選定</h3><p>Brownfield（システムコンバージョン）と Greenfield（新規導入）の違い、メリット・デメリットを比較。</p><h3>データ移行の実務</h3><p>データクレンジング、移行ツール（SAP Migration Cockpit）、テスト計画について。</p>',
        'module' => 's4',
        'difficulty' => 'advanced',
        'price' => 29800,
        'duration' => '8 weeks',
    ],
    [
        'title' => 'CO 原価計算実践マスター',
        'excerpt' => '原価センタ、内部受注、製品原価計算 - CO の中核機能を徹底解説。',
        'content' => '<h2>管理会計の基礎</h2><p>CO モジュールの中核機能である原価計算について学びます。</p><h3>原価センタ会計</h3><p>原価センタの設定、計画、配賦サイクルの作成方法を解説。</p><h3>製品原価計算</h3><p>製品原価の見積もりから実際原価計算までの流れを詳しく説明。</p>',
        'module' => 'co',
        'difficulty' => 'intermediate',
        'price' => 15800,
        'duration' => '5 weeks',
    ],
    [
        'title' => 'PP 生産計画と MRP 実践編',
        'excerpt' => 'MRP の概念から実装まで。生産計画の立案、BOM、作業手順を完全理解。',
        'content' => '<h2>生産計画の基礎</h2><p>PP モジュールの生産計画と MRP について学びます。</p><h3>MRP の仕組み</h3><p>MRP（資材所要量計画）の基本ロジックと設定方法を解説。</p><h3>BOM と作業手順</h3><p>部品表（BOM）の作成、作業手順の定義、生産バージョンの管理方法。</p>',
        'module' => 'pp',
        'difficulty' => 'intermediate',
        'price' => 16800,
        'duration' => '5 weeks',
    ],
    [
        'title' => 'Basis システム管理入門',
        'excerpt' => 'SAP システム管理者のための基礎知識。ユーザ管理、権限、トランスポート。',
        'content' => '<h2>Basis 基礎知識</h2><p>SAP Basis の基本を学びます。システム管理に必要な知識を網羅。</p><h3>ユーザ管理と権限</h3><p>ユーザ作成、ロール割当、権限設定の基本を解説。</p><h3>トランスポート管理</h3><p>CTS（Change and Transport System）の設定と運用方法について。</p>',
        'module' => 'basis',
        'difficulty' => 'beginner',
        'price' => 8800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'HR 人事管理 SuccessFactors 連携',
        'excerpt' => 'SAP HR と SuccessFactors の連携設定。人事マスタ管理から給与まで。',
        'content' => '<h2>HR モジュールと SuccessFactors</h2><p>SAP HR の基本とクラウド連携について学びます。</p><h3>人事マスタ管理</h3><p>人事マスタの基本構造、インフォタイプの管理、レポート作成。</p><h3>SuccessFactors 連携</h3><p>オンプレミスとクラウドの連携設定、データレプリケーションの仕組み。</p>',
        'module' => 'hr',
        'difficulty' => 'intermediate',
        'price' => 12800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'SAP プロジェクトマネジメント実践',
        'excerpt' => 'SAP 導入プロジェクトの進め方。プロジェクト計画、チーム構成、品質管理。',
        'content' => '<h2>SAP プロジェクトの進め方</h2><p>SAP 導入プロジェクト全体の流れをプロジェクト管理の視点から学びます。</p><h3>プロジェクト計画</h3><p>スコープ定義、WBS 作成、リソース計画、スケジュール立案について。</p><h3>品質管理とテスト</h3><p>テスト計画、単体テストから結合テストまで、品質を確保する方法を解説。</p>',
        'module' => 's4',
        'difficulty' => 'advanced',
        'price' => 24800,
        'duration' => '6 weeks',
    ],
    // === 追加 10 コース ===
    [
        'title' => 'Fiori アプリ開発入門',
        'excerpt' => 'SAP Fiori の基本概念から開発環境構築、最初のアプリ作成までをハンズオンで学ぶ。',
        'content' => '<h2>Fiori とは</h2><p>SAP Fiori はモダンな UX を提供する SAP の UI 技術です。</p><h3>開発環境のセットアップ</h3><p>SAP Business Application Studio の使い方、プロジェクトテンプレートの選択方法。</p><h3>最初の Fiori アプリ</h3><p>リストレポートテンプレートを使ったアプリ生成、サービス binding、UI カスタマイズ。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'price' => 17800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'SAP 会計伝票の仕組みを理解する',
        'excerpt' => '伝票タイプ、転記キー、勘定設定 — FI の根幹をなすアーキテクチャを基礎から解説。',
        'content' => '<h2>会計伝票の基本構造</h2><p>SAP の会計伝票はヘッダと明細から構成されます。</p><h3>伝票タイプの役割</h3><p>SA（一般仕訳）、KR（仕入先請求書）、DR（得意先請求書）など、伝票タイプごとの制御機能。</p><h3>転記キーの理解</h3><p>借方/貸方を制御する転記キー（40/50など）と勘定タイプの関係。</p>',
        'module' => 'fi',
        'difficulty' => 'beginner',
        'price' => 0,
        'duration' => '1 week',
    ],
    [
        'title' => 'SAP S/4HANA 会計実践マスター',
        'excerpt' => 'Universal Journal の概念から新会計の実務まで。S/4HANA ならではの変更点を徹底解説。',
        'content' => '<h2>Universal Journal とは</h2><p>S/4HANA では FI と CO が統合された Universal Journal（ACDOCA）が中核です。</p><h3>主要な変更点</h3><p>テーブル統合によるメリット、ドキュメント分割の新しい考え方。</p><h3>実務での対応</h3><p>移行時の注意点、新旧比較、よくある設計判断のポイント。</p>',
        'module' => 's4',
        'difficulty' => 'advanced',
        'price' => 26800,
        'duration' => '6 weeks',
    ],
    [
        'title' => 'RAP モデル開発フルコース',
        'excerpt' => 'Restful ABAP Programming Model を使ったモダンなアプリケーション開発手法を学ぶ。',
        'content' => '<h2>RAP 入門</h2><p>RAP（Restful ABAP Programming Model）は S/4HANA の標準開発モデルです。</p><h3>データモデリング</h3><p>CDS View を使ったデータモデルの定義、Behavior Definition の書き方。</p><h3>サービスの公開</h3><p>OData サービスの公開、Fiori  Elements との連携、トランザクションハンドリング。</p>',
        'module' => 'abap',
        'difficulty' => 'advanced',
        'price' => 32800,
        'duration' => '8 weeks',
    ],
    [
        'title' => 'MM 在庫管理実務ハンドブック',
        'excerpt' => '棚卸、在庫評価、移動タイプ — MM 在庫管理の実務に必要な知識を凝縮。',
        'content' => '<h2>在庫管理の基礎</h2><p>MM 在庫管理の実務に必要な知識をコンパクトにまとめました。</p><h3>棚卸の実務</h3><p>定期棚卸と循環棚卸の違い、棚卸差分の処理方法。</p><h3>在庫評価</h3><p>移動平均と標準原価、在庫評価の設定と運用における注意点。</p>',
        'module' => 'mm',
        'difficulty' => 'intermediate',
        'price' => 12800,
        'duration' => '3 weeks',
    ],
    [
        'title' => 'SD 価格設定と条件テクニック',
        'excerpt' => '価格設定のしくみから条件レコード、自由定義条件まで SD 価格のすべて。',
        'content' => '<h2>SD 価格設定の基礎</h2><p>SAP SD の価格設定は条件技術をベースにしています。</p><h3>条件テーブルと条件タイプ</h3><p>価格決定に使われる条件テーブルの構造と条件タイプのカスタマイズ。</p><h3>価格設定の実践</h3><p>得意先固有価格、数量割引、プロモーション価格の設定方法。</p>',
        'module' => 'sd',
        'difficulty' => 'intermediate',
        'price' => 14800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'CO 利益分析（PA）完全ガイド',
        'excerpt' => 'アカウントベース PA とコストベース PA の違いから設定・運用まで。',
        'content' => '<h2>利益分析（PA）の基礎</h2><p>CO-PA は企業の利益構造を分析するための強力なツールです。</p><h3>アカウントベース vs コストベース</h3><p>2つの方法の違い、それぞれのメリット・デメリット、選定基準。</p><h3>PA の設定と運用</h3><p>特性と値フィールドの定義、データソースの設定、実際のレポート活用。</p>',
        'module' => 'co',
        'difficulty' => 'advanced',
        'price' => 22800,
        'duration' => '5 weeks',
    ],
    [
        'title' => 'Basis パフォーマンスチューニング',
        'excerpt' => 'SAP システムの処理遅延を解消するための分析手法とチューニング実践。',
        'content' => '<h2>パフォーマンス分析の基礎</h2><p>STAD/ST05 を使ったパフォーマンス分析の基本手順。</p><h3>メモリとバッファのチューニング</h3><p>ABAP バッファ、テーブルバッファの設定、Extended Memory の管理。</p><h3>SQL チューニング</h3><p>遅い SELECT 文の特定、インデックス戦略、SAP Note の活用方法。</p>',
        'module' => 'basis',
        'difficulty' => 'advanced',
        'price' => 26800,
        'duration' => '5 weeks',
    ],
    [
        'title' => 'PP 繰返製造とカンバン方式',
        'excerpt' => '繰返製造のプロセスとカンバン方式の設定。MRP との使い分けも解説。',
        'content' => '<h2>繰返製造の基礎</h2><p>PP の繰返製造プロセスとカンバン方式について学びます。</p><h3>繰返製造の設定</h3><p>生産バージョン、ライン設計、計画表の使い方。</p><h3>カンバン方式</h3><p>カンバンコントロールサイクルの設定、自動補充、MRP との比較。</p>',
        'module' => 'pp',
        'difficulty' => 'intermediate',
        'price' => 15800,
        'duration' => '4 weeks',
    ],
    [
        'title' => 'SuccessFactors 運用管理ガイド',
        'excerpt' => '従業員データ管理、組織図、レポート — SuccessFactors の日常運用に必要な知識。',
        'content' => '<h2>SuccessFactors の基本運用</h2><p>SAP SuccessFactors の日常運用に必要な知識をまとめました。</p><h3>社員データ管理</h3><p>社員情報の登録・更新、一括インポート、権限設定の基本。</p><h3>レポートと分析</h3><p>アドホックレポートの作成、人材分析ダッシュボードの活用方法。</p>',
        'module' => 'hr',
        'difficulty' => 'beginner',
        'price' => 9800,
        'duration' => '3 weeks',
    ],
];

// ----- ナレッジデータ -----
$knowledges = [
    [
        'title' => 'FB50 で仕訳を入力する方法',
        'excerpt' => '一般仕訳トランザクション FB50 の使い方を画面ショット付きで解説。借方・貸方の入力ルールも。',
        'content' => '<h2>FB50 の基本操作</h2><p>FB50 は SAP で最も基本的な仕訳入力トランザクションです。</p><h3>画面の見方</h3><p>ヘッダ情報（日付、会社コード、通貨）と明細行（勘定科目、金額）の入力方法を解説。</p><h3>よくあるエラーと対処</h3><p>会社コードが異なる、勘定科目が許可されていない等のよくあるエラーと解決方法。</p>',
        'module' => 'fi',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'SAP における組織構造の基本',
        'excerpt' => 'クライアント、会社コード、プラント、販売組織など SAP の組織単位を徹底解説。',
        'content' => '<h2>SAP の組織単位</h2><p>SAP システムにおける組織構造の基本概念を解説します。</p><h3>財務会計の組織単位</h3><p>クライアント、会社コード、セグメント、利益センタの関係性。</p><h3>ロジスティクスの組織単位</h3><p>プラント、保管場所、購買組織、販売組織の定義と使い分け。</p>',
        'module' => 'fi',
        'difficulty' => 'beginner',
        'type' => 'concept',
    ],
    [
        'title' => 'ALV レポートの作り方',
        'excerpt' => 'ABAP の ALV（SAP List Viewer）を使って見やすいレポートを作成する方法。',
        'content' => '<h2>ALV とは</h2><p>ALV は SAP の標準的なレポート表示ツールです。</p><h3>シンプル ALV の実装</h3><p>REUSE_ALV_GRID_DISPLAY を使った基本的なレポート作成手順。</p><h3>インタラクティブ ALV</h3><p>クリックでドリルダウンするインタラクティブなレポートの実装方法。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'type' => 'best_practice',
    ],
    [
        'title' => 'MM の移動タイプ一覧',
        'excerpt' => '在庫移動で使われる主要な移動タイプ（Movement Type）を目的別にまとめました。',
        'content' => '<h2>移動タイプ早見表</h2><table><tr><th>移動タイプ</th><th>名称</th><th>用途</th></tr><tr><td>101</td><td>入庫</td><td>発注に対する入庫</td></tr><tr><td>102</td><td>入庫取消</td><td>101 の取消</td></tr><tr><td>201</td><td>出庫</td><td>予定の出庫</td></tr><tr><td>202</td><td>出庫取消</td><td>201 の取消</td></tr><tr><td>301</td><td>場所間移動</td><td>プラント間移動</td></tr></table>',
        'module' => 'mm',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'VA01 で受注を入力する手順',
        'excerpt' => '標準受注作成トランザクション VA01 の入力手順と注意点を詳しく解説。',
        'content' => '<h2>VA01 の基本</h2><p>VA01 で標準受注を作成する手順を解説します。</p><h3>ヘッダデータの入力</h3><p>販売組織、流通チャネル、得意先コードの入力方法。</p><h3>明細データの入力</h3><p>品目コード、数量、価格の入力と、条件タイプによる価格決定。</p>',
        'module' => 'sd',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'CDS View の基本構文',
        'excerpt' => 'S/4HANA で重要な CDS View の作り方。必須アノテーションと JOIN の書き方。',
        'content' => '<h2>CDS View 入門</h2><p>Core Data Services の基本的な構文を解説します。</p><h3>定義の基本</h3><p>@AbapCatalog.sqlViewName や @AccessControl.authorizationCheck などの必須アノテーション。</p><h3>JOIN と Association</h3><p>INNER JOIN、LEFT OUTER JOIN、そして Association を使った関連付けの方法。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'type' => 'concept',
    ],
    [
        'title' => 'SAP 用語集：よく使う略語 50',
        'excerpt' => 'SD、MM、FI、CO... SAP プロジェクトで必ず出会う略語を厳選して解説。',
        'content' => '<h2>SAP 略語一覧</h2><dl><dt>FI</dt><dd>Financial Accounting（財務会計）</dd><dt>CO</dt><dd>Controlling（管理会計）</dd><dt>MM</dt><dd>Materials Management（購買・在庫管理）</dd><dt>SD</dt><dd>Sales & Distribution（販売管理）</dd><dt>PP</dt><dd>Production Planning（生産計画）</dd><dt>ABAP</dt><dd>Advanced Business Application Programming（SAP 開発言語）</dd><dt>BAPI</dt><dd>Business Application Programming Interface</dd><dt>RFC</dt><dd>Remote Function Call</dd></dl>',
        'module' => 's4',
        'difficulty' => 'beginner',
        'type' => 'glossary',
    ],
    [
        'title' => 'CO と FI の違いを理解する',
        'excerpt' => '「FI と CO って何が違うの？」という疑問に答えます。外部会計と内部会計の違い。',
        'content' => '<h2>FI と CO の違い</h2><p>多くの初心者が混乱する FI と CO の違いをわかりやすく解説。</p><h3>FI：外部会計</h3><p>法定の財務諸表作成が目的。貸借対照表や損益計算書を作成します。</p><h3>CO：内部会計</h3><p>経営管理が目的。原価管理や利益性分析で経営判断を支援します。</p><p>ポイント：FI は「法律のため」、CO は「会社のため」と覚えると理解しやすいです。</p>',
        'module' => 'co',
        'difficulty' => 'beginner',
        'type' => 'concept',
    ],
    [
        'title' => 'SAP トランスポートの仕組みと運用',
        'excerpt' => '開発→品質→本番、トランスポートルートの設定方法と実践的な運用ノウハウ。',
        'content' => '<h2>トランスポートシステムとは</h2><p>SAP の変更管理に欠かせないトランスポートシステムの仕組み。</p><h3>トランスポートルート</h3><p>開発→品質保証→本番という標準的なルート設定の方法。</p><h3>運用のポイント</h3><p>トランスポートの順序管理、コンフリクト回避、リリース戦略について。</p>',
        'module' => 'basis',
        'difficulty' => 'advanced',
        'type' => 'best_practice',
    ],
    [
        'title' => 'SM30 でテーブルメンテナンスする方法',
        'excerpt' => 'カスタマイジングテーブルのメンテナンスを SM30 で行う手順と注意点。',
        'content' => '<h2>SM30 の基本</h2><p>テーブルメンテナンスジェネレータで生成したテーブルの保守を行います。</p><h3>テーブルビューの呼出</h3><p>SM30 にトランザクションコードを入力し、該当するテーブルビューを呼び出す方法。</p><h3>データの操作</h3><p>新規エントリの追加、既存データの変更・削除、そして保存時の自動チェックについて。</p>',
        'module' => 'basis',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    // === 追加 10 ナレッジ ===
    [
        'title' => 'Fiori Launchpad の設定方法',
        'excerpt' => 'Fiori Launchpad のカスタマイズ、タイル設定、カタログとグループの管理方法。',
        'content' => '<h2>Fiori Launchpad 管理</h2><p>Fiori Launchpad は SAP Fiori のエントリポイントです。</p><h3>タイルとカタログ</h3><p>タイルの作成、カタログへの割当、グループ管理の基本。</p><h3>ロールと権限</h3><p>PFCG ロールへの Launchpad 権限付与、ユーザ別の表示制御。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'type' => 'best_practice',
    ],
    [
        'title' => '勘定科目マスタの一括登録方法',
        'excerpt' => 'FS00 だけでなく、一括登録（LSMW/バッチインプット）を使った効率的な登録手順。',
        'content' => '<h2>勘定科目マスタ一括登録</h2><p>大量の勘定科目を効率的に登録する方法を解説。</p><h3>FS00 での個別登録</h3><p>基本画面の入力項目と会社コードセグメントの管理方法。</p><h3>一括登録テクニック</h3><p>バッチインプットを使った一括登録、よくあるエラーと回避方法。</p>',
        'module' => 'fi',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'MRP パラメータの最適化設定',
        'excerpt' => 'MRP の各種パラメータを適切に設定し、効率的な資材計画を実現する方法。',
        'content' => '<h2>MRP パラメータ設定</h2><p>MRP の動作を制御する主要パラメータを解説。</p><h3>MRP タイプとロットサイズ</h3><p>PD（MRP）と VB（時系列消費）の違い、最適なロットサイズキーの選び方。</p><h3>日程調整パラメータ</h3><p>生産日程の前方/後方スケジューリング、能力計画との連携。</p>',
        'module' => 'pp',
        'difficulty' => 'intermediate',
        'type' => 'best_practice',
    ],
    [
        'title' => 'SAP 権限設定のベストプラクティス',
        'excerpt' => 'PFCG を使ったロール管理、権限トレース、よくある権限エラーの対処法。',
        'content' => '<h2>SAP 権限管理の基礎</h2><p>SAP システムの権限設定はセキュリティの要です。</p><h3>PFCG によるロール管理</h3><p>ロールの作成、メニューと権限データの割当、プロファイル生成の流れ。</p><h3>権限エラーのトラブルシュート</h3><p>SU53 を使った権限チェック、トレースファイルの読み方、足りない権限の特定方法。</p>',
        'module' => 'basis',
        'difficulty' => 'intermediate',
        'type' => 'best_practice',
    ],
    [
        'title' => 'ME21N で発注書を作成する手順',
        'excerpt' => '購買発注の作成トランザクション ME21N。標準発注から枠契約まで。',
        'content' => '<h2>ME21N の基本操作</h2><p>ME21N は SAP で発注書を作成する標準トランザクションです。</p><h3>発注書の作成</h3><p>ヘッダデータ（仕入先、購入組織）と明細データ（品目、数量、納期）の入力。</p><h3>枠契約とリリース</h3><p>基本契約（枠契約）の作成と、それに対するリリース発注の方法。</p>',
        'module' => 'mm',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'VF01 で請求書を作成する方法',
        'excerpt' => '出荷に基づく請求書作成 VF01 の操作手順と請求タイプの解説。',
        'content' => '<h2>VF01 の基本</h2><p>VF01 は出荷伝票に基づいて請求書を作成するトランザクションです。</p><h3>請求書の作成手順</h3><p>出荷伝票の選択、請求データの確認、転記の一連の流れ。</p><h3>請求タイプと転記</h3><p>請求タイプの違い（F2: 標準請求書、L2: デビットメモなど）、会計への転記。</p>',
        'module' => 'sd',
        'difficulty' => 'beginner',
        'type' => 'tcode',
    ],
    [
        'title' => 'ABAP 新しい構文（7.4/7.5）早見表',
        'excerpt' => 'インライン宣言、テーブル式、CORRESPONDING #( ) など最新 ABAP 構文を厳選。',
        'content' => '<h2>モダン ABAP 構文</h2><p>ABAP 7.4 / 7.5 で導入された新しい構文をまとめました。</p><h3>インライン宣言</h3><p>DATA(x) = ... によるインライン変数宣言とその利点。</p><h3>テーブル式</h3><p>itab[ key = val ] による簡潔な内部テーブルアクセス。</p><h3>CORRESPONDING 演算子</h3><p>構造間のマッピングを簡略化する CORRESPONDING #( ) の使い方。</p>',
        'module' => 'abap',
        'difficulty' => 'intermediate',
        'type' => 'glossary',
    ],
    [
        'title' => 'S/4HANA 簡素化リストを読み解く',
        'excerpt' => 'S/4HANA で削除・変更された機能。移行前に知っておくべき簡素化項目。',
        'content' => '<h2>簡素化とは</h2><p>S/4HANA では多くのレガシー機能が簡素化・削除されました。</p><h3>主要な簡素化項目</h3><p>MRP の変更点、テーブルの統合（MATDOC など）、トランザクションコードの廃止。</p><h3>移行前チェックリスト</h3><p>簡素化影響分析ツールの使い方、代替機能の確認方法。</p>',
        'module' => 's4',
        'difficulty' => 'advanced',
        'type' => 'concept',
    ],
    [
        'title' => 'CO 内部受注の設定と実務',
        'excerpt' => '内部受注のマスタ設定、予算管理、決済ルールまで実践的に解説。',
        'content' => '<h2>内部受注管理</h2><p>CO の内部受注は個別のコレクション管理に使われます。</p><h3>内部受注の作成</h3><p>内部受注タイプの設定、マスタデータの項目、標準テキストの活用。</p><h3>予算管理と決済</h3><p>予算の配分、実績計上、決済ルールの定義と実際の決済処理。</p>',
        'module' => 'co',
        'difficulty' => 'intermediate',
        'type' => 'concept',
    ],
    [
        'title' => 'PDI（Payroll Data Integration）の基礎',
        'excerpt' => 'SuccessFactors と SAP 給与の連携ツール PDI の設定と運用。',
        'content' => '<h2>PDI とは</h2><p>PDI（Payroll Data Integration）は SuccessFactors と SAP Payroll を連携するツールです。</p><h3>連携の仕組み</h3><p>従業員マスタデータのレプリケーション、給与関連情報の同期方法。</p><h3>設定と運用</h3><p>PDI の設定手順、エラーハンドリング、運用時の注意点。</p>',
        'module' => 'hr',
        'difficulty' => 'advanced',
        'type' => 'concept',
    ],
];

// ----- 実行 -----

$created_courses = 0;
$created_knowledge = 0;
$skipped_courses = 0;
$skipped_knowledge = 0;

// コースの作成
echo "コースを作成中...\n";
foreach ($courses as $c) {
    // 重複チェック（タイトルで）
    $exists = get_posts([
        'post_type' => 'course',
        'title' => $c['title'],
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
    ]);
    if (!empty($exists)) {
        echo "  スキップ（既存）: {$c['title']}\n";
        $skipped_courses++;
        continue;
    }

    $post_id = wp_insert_post([
        'post_type' => 'course',
        'post_title' => $c['title'],
        'post_content' => $c['content'],
        'post_excerpt' => $c['excerpt'],
        'post_status' => 'publish',
        'post_author' => 1,
    ]);

    if (is_wp_error($post_id)) {
        echo "  エラー: {$c['title']} - {$post_id->get_error_message()}\n";
        continue;
    }

    // メタフィールド
    update_post_meta($post_id, 'course_price', $c['price']);
    update_post_meta($post_id, 'course_duration', $c['duration']);

    // タクソノミー
    if (!empty($c['module'])) {
        wp_set_object_terms($post_id, $c['module'], 'sap_module');
    }
    if (!empty($c['difficulty'])) {
        wp_set_object_terms($post_id, $c['difficulty'], 'difficulty');
    }

    echo "  ✓ 作成: {$c['title']} (ID: {$post_id})\n";
    $created_courses++;
}

// ナレッジの作成
echo "\nナレッジを作成中...\n";
foreach ($knowledges as $k) {
    $exists = get_posts([
        'post_type' => 'knowledge',
        'title' => $k['title'],
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
    ]);
    if (!empty($exists)) {
        echo "  スキップ（既存）: {$k['title']}\n";
        $skipped_knowledge++;
        continue;
    }

    $post_id = wp_insert_post([
        'post_type' => 'knowledge',
        'post_title' => $k['title'],
        'post_content' => $k['content'],
        'post_excerpt' => $k['excerpt'],
        'post_status' => 'publish',
        'post_author' => 1,
    ]);

    if (is_wp_error($post_id)) {
        echo "  エラー: {$k['title']} - {$post_id->get_error_message()}\n";
        continue;
    }

    update_post_meta($post_id, 'knowledge_type', $k['type']);

    if (!empty($k['module'])) {
        wp_set_object_terms($post_id, $k['module'], 'sap_module');
    }
    if (!empty($k['difficulty'])) {
        wp_set_object_terms($post_id, $k['difficulty'], 'difficulty');
    }

    echo "  ✓ 作成: {$k['title']} (ID: {$post_id})\n";
    $created_knowledge++;
}

// ----- レッスンデータ（コースごとに3〜4レッスン）-----
$lessons_data = [
    // 各コースのIDを動的に取得してレッスンを作成
];

// ----- ナレッジの参照データ -----
$knowledge_refs = [
    'FB50 で仕訳を入力する方法' => [['url' => '/article/fb50-guide', 'label' => 'FB50 操作ガイド詳細'], ['url' => 'https://help.sap.com/fb50', 'label' => 'SAP Help: FB50']],
    'SAP における組織構造の基本' => [['url' => '/category/fi', 'label' => 'FI モジュール記事一覧']],
    'ALV レポートの作り方' => [['url' => '/step/1', 'label' => 'ABAP 入門パス Step 1'], ['url' => '/category/abap', 'label' => 'ABAP 関連記事']],
    'MM の移動タイプ一覧' => [['url' => '/category/mm', 'label' => 'MM モジュール記事一覧']],
    'VA01 で受注を入力する手順' => [['url' => '/category/sd', 'label' => 'SD モジュール記事一覧']],
    'CDS View の基本構文' => [['url' => '/learning/3', 'label' => 'ABAP × S/4HANA 学習パス']],
    'SAP 用語集：よく使う略語 50' => [['url' => '/category/s4', 'label' => 'S/4HANA 関連記事']],
    'CO と FI の違いを理解する' => [['url' => '/category/co', 'label' => 'CO モジュール記事一覧']],
    'SAP トランスポートの仕組みと運用' => [['url' => '/category/basis', 'label' => 'Basis 関連記事']],
    'SM30 でテーブルメンテナンスする方法' => [['url' => '/category/basis', 'label' => 'Basis 関連記事']],
];

// クイズの作成
echo "\n毎日クイズを作成中...\n";
$quizzes_data = [
    ['title' => '次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？', 'options' => [['text' => 'SA：一般仕訳', 'correct' => false], ['text' => 'KR：仕入先請求書', 'correct' => false], ['text' => 'DR：得意先請求書', 'correct' => false], ['text' => 'XX：在庫移動仕訳', 'correct' => true]], 'explanation' => '「XX」というドキュメントタイプは標準にはありません。在庫移動は MM 領域です。', 'difficulty' => 'beginner', 'module' => 'fi'],
    ['title' => 'ABAP で SELECT ... INTO TABLE を高速に動かすコツとして「正しくない」のは？', 'options' => [['text' => 'WHERE 句にキー項目を入れる', 'correct' => false], ['text' => 'INTO CORRESPONDING FIELDS を使う', 'correct' => true], ['text' => '必要な列だけ取得する', 'correct' => false], ['text' => '内部テーブルを事前に CLEAR する', 'correct' => false]], 'explanation' => 'INTO CORRESPONDING FIELDS はマッピング処理が入るので遅くなります！', 'difficulty' => 'intermediate', 'module' => 'abap'],
    ['title' => 'MM で購買依頼を表すトランザクションコードは？', 'options' => [['text' => 'ME21N', 'correct' => false], ['text' => 'ME51N', 'correct' => true], ['text' => 'MB1A', 'correct' => false], ['text' => 'MIGO', 'correct' => false]], 'explanation' => 'ME51N は購買依頼作成です。ME21N は発注書作成です。', 'difficulty' => 'beginner', 'module' => 'mm'],
    ['title' => 'SD モジュールで受注作成に使用するトランザクションコードは？', 'options' => [['text' => 'VA01', 'correct' => true], ['text' => 'VF01', 'correct' => false], ['text' => 'VL01N', 'correct' => false], ['text' => 'VA03', 'correct' => false]], 'explanation' => 'VA01 が標準受注作成です。', 'difficulty' => 'beginner', 'module' => 'sd'],
    ['title' => 'SAP トランスポートシステムの役割は？', 'options' => [['text' => 'DB バックアップ', 'correct' => false], ['text' => '開発→品質→本番へ変更を移送', 'correct' => true], ['text' => 'メッセージ送信', 'correct' => false], ['text' => '外部連携I/F', 'correct' => false]], 'explanation' => 'CTS は変更管理のための移送システムです。', 'difficulty' => 'beginner', 'module' => 'basis'],
    ['title' => 'CO の内部受注の用途は？', 'options' => [['text' => '顧客受注管理', 'correct' => false], ['text' => '特定プロジェクトの原価収集', 'correct' => true], ['text' => '仕入先発注管理', 'correct' => false], ['text' => '在庫移動管理', 'correct' => false]], 'explanation' => '内部受注は特定プロジェクトの原価収集に使われます。', 'difficulty' => 'intermediate', 'module' => 'co'],
    ['title' => 'CDS View の特徴として正しいものは？', 'options' => [['text' => 'ABAP 内でのみ使用可能', 'correct' => false], ['text' => 'DBレベル定義で OData 公開が容易', 'correct' => true], ['text' => 'SAP GUI のみ表示可能', 'correct' => false], ['text' => '既存テーブルを置き換える', 'correct' => false]], 'explanation' => 'CDS View は DB レベルで定義し OData 公開できます。', 'difficulty' => 'advanced', 'module' => 'abap'],
    ['title' => 'MRP（資材所要量計画）の目的は？', 'options' => [['text' => '製品原価計算', 'correct' => false], ['text' => '資材を必要な時期に過不足なく確保', 'correct' => true], ['text' => '従業員管理', 'correct' => false], ['text' => '販売価格決定', 'correct' => false]], 'explanation' => 'MRP は需要に対して必要な資材を計画します。', 'difficulty' => 'beginner', 'module' => 'pp'],
    ['title' => 'S/4HANA の Universal Journal とは？', 'options' => [['text' => '会社コード連結機能', 'correct' => false], ['text' => 'FI と CO を統合した単一テーブル', 'correct' => true], ['text' => '全トランザクション記録', 'correct' => false], ['text' => '操作履歴管理', 'correct' => false]], 'explanation' => 'Universal Journal（ACDOCA）は FI と CO を統合した中核テーブルです。', 'difficulty' => 'intermediate', 'module' => 's4'],
    ['title' => 'SuccessFactors の正しい説明は？', 'options' => [['text' => 'ERP のアドオン', 'correct' => false], ['text' => 'クラウド人事で ERP と連携可能', 'correct' => true], ['text' => '財務会計モジュール', 'correct' => false], ['text' => 'ETL ツール', 'correct' => false]], 'explanation' => 'SuccessFactors はクラウド人事管理で PDI 等で連携可能です。', 'difficulty' => 'intermediate', 'module' => 'hr'],
];

$qi = 0;
foreach ($quizzes_data as $q) {
    $exists = get_posts(['post_type' => 'daily_quiz', 'title' => $q['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
    if (!empty($exists)) { echo "  スキップ（既存）\n"; continue; }
    $qid = wp_insert_post(['post_type' => 'daily_quiz', 'post_title' => $q['title'], 'post_status' => 'publish', 'post_author' => 1]);
    if (is_wp_error($qid)) { echo "  エラー\n"; continue; }
    update_post_meta($qid, 'quiz_options', $q['options']);
    update_post_meta($qid, 'quiz_explanation', $q['explanation']);
    update_post_meta($qid, 'quiz_date', date('Y-m-d', strtotime("+{$qi} days")));
    if (!empty($q['difficulty'])) update_post_meta($qid, 'quiz_difficulty', $q['difficulty']);
    if (!empty($q['module'])) wp_set_object_terms($qid, $q['module'], 'sap_module');
    echo "  ✓ {$q['title']} (ID: {$qid})\n";
    $qi++;
}
echo "クイズ: {$qi} 件作成\n";

// レッスンの作成
echo "\nレッスンを作成中...\n";
$course_posts = get_posts(['post_type' => 'course', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC']);
$i = 0;

$lesson_templates = [
    [
        'title' => 'コース概要と学習目標',
        'time' => '10 min',
        'content' => '<h2>コース概要</h2>
<p>このレッスンでは、コース全体の構成と学習目標を確認します。</p>
<h3>コースの目的</h3>
<p>本コースを修了することで、実務で即戦力となるスキルを習得できます。各レッスンは段階的に構成されており、初心者でも無理なく学習を進められます。</p>
<h3>学習ロードマップ</h3>
<ul>
<li>基礎概念の理解（レッスン1-3）</li>
<li>実践的な操作演習（レッスン4-7）</li>
<li>応用とケーススタディ（レッスン8-10）</li>
</ul>
<div class="callout-box"><div class="ic">🎯</div><div><div class="title">学習のポイント</div>各レッスンの最後にある確認問題で理解度をチェックしましょう。間違えた箇所は該当レッスンに戻って復習してください。</div></div>',
    ],
    [
        'title' => '事前知識と前提条件',
        'time' => '15 min',
        'content' => '<h2>事前に必要な知識</h2>
<p>このレッスンでは、学習を始める前に知っておくべき前提知識を整理します。</p>
<h3>推奨される前提知識</h3>
<ul>
<li>SAP システムの基本操作（ログイン、画面遷移）</li>
<li>業務プロセスの大まかな流れ</li>
</ul>
<h3>動作環境</h3>
<p>SAP GUI または Fiori Launchpad からアクセス可能な環境が必要です。デモ環境が無い場合は、<strong>パンダ先生のシミュレーター</strong>で代替学習が可能です。</p>
<div class="dialog"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">パンダ先生</span>「事前知識が不安な方は、関連する基礎記事を先に読んでおくとスムーズですよ！」</div></div>',
    ],
    [
        'title' => '基本設定とマスタデータ',
        'time' => '25 min',
        'content' => '<h2>基本設定の理解</h2>
<p>SAP システムでは、業務を正しく遂行するために様々な基本設定とマスタデータが必要です。</p>
<h3>カスタマイジング設定</h3>
<p>IMG（Implementation Guide）を使った設定手順を学びます。トランザクションコード SPRO からアクセスし、各設定項目を確認します。</p>
<h3>マスタデータの管理</h3>
<p>マスタデータは一度登録すれば複数のトランザクションで再利用可能です。適切なマスタデータ管理は、システム運用の効率化に直結します。</p>
<pre><code>重要マスタ一覧：
・取引先マスタ（得意先/仕入先）
・品目マスタ
・勘定科目マスタ
・従業員マスタ</code></pre>
<div class="callout-box warn"><div class="ic">⚠️</div><div><div class="title">注意点</div>マスタデータの入力ルールはプロジェクトごとに異なります。必ずプロジェクト標準のガイドラインに従ってください。</div></div>',
    ],
    [
        'title' => '標準トランザクションの操作',
        'time' => '30 min',
        'content' => '<h2>主要トランザクションを覚える</h2>
<p>SAP には何千ものトランザクションコードがありますが、実務で頻繁に使うものは限られています。</p>
<h3>トランザクションコード早見</h3>
<table><tr><th>T-Code</th><th>名称</th><th>用途</th></tr><tr><td>FB50</td><td>一般仕訳入力</td><td>会計伝票の入力</td></tr><tr><td>ME21N</td><td>発注作成</td><td>購買発注書の作成</td></tr><tr><td>VA01</td><td>受注作成</td><td>販売受注の作成</td></tr><tr><td>MM03</td><td>品目マスタ表示</td><td>品目情報の照会</td></tr></table>
<h3>画面操作のコツ</h3>
<p>F1 キーでヘルプ、F4 で入力候補表示、F8 で実行 — これらのショートカットを覚えるだけで操作速度が格段に上がります。</p>',
    ],
    [
        'title' => '実践シナリオ：基本業務フロー',
        'time' => '35 min',
        'content' => '<h2>基本業務フローを体験する</h2>
<p>実際の業務を想定したシナリオを通じて、トランザクションの流れを体験します。</p>
<h3>シナリオ概要</h3>
<p>ある企業で発生する日々の業務処理を、システム上で再現します。</p>
<h3>演習手順</h3>
<ol>
<li>マスタデータの確認</li>
<li>取引先の登録</li>
<li>業務伝票の作成と転記</li>
<li>結果の確認と分析</li>
</ol>
<div class="callout-box"><div class="ic">💡</div><div><div class="title">パンダ先生のアドバイス</div>最初は操作手順を覚えることに集中しましょう。なぜその操作が必要かは、実際に何度か繰り返すうちに自然と理解できるようになります。</div></div>',
    ],
    [
        'title' => '実践シナリオ：データ分析とレポート',
        'time' => '30 min',
        'content' => '<h2>データ分析とレポート活用</h2>
<p>SAP の豊富なレポート機能を使って、業務データを分析する方法を学びます。</p>
<h3>標準レポートの活用</h3>
<p>SAP 標準のレポート一覧から目的に合ったレポートを選択し、必要な情報を出力する手順を解説します。</p>
<h3>データ分析の実践</h3>
<p>レポート結果を Excel にエクスポートして、ピボットテーブルなどを使って分析する方法もカバーします。</p>
<pre><code>レポート出力の流れ：
1. 該当トランザクションを起動
2. 選択条件を入力
3. 実行（F8）
4. 結果確認とエクスポート（Ctrl+Shift+F11）</code></pre>',
    ],
    [
        'title' => 'エラーハンドリングとトラブル対処',
        'time' => '20 min',
        'content' => '<h2>よくあるエラーとその対処法</h2>
<p>SAP 操作中に遭遇する代表的なエラーメッセージとその解決方法を紹介します。</p>
<h3>エラーメッセージの読み方</h3>
<p>SAP のエラーメッセージは「種類-番号」で構成され、メッセージクラスとメッセージ番号で管理されています。</p>
<h3>よくあるエラー TOP5</h3>
<ol>
<li><strong>勘定科目が定義されていません</strong> — 勘定科目マスタの設定を確認</li>
<li><strong>品目XXは存在しません</strong> — 品目マスタとプラントデータを確認</li>
<li><strong>権限が不足しています</strong> — ロールと権限プロファイルを見直し</li>
<li><strong>会社コードXXにデータがありません</strong> — 会社コードセグメントを確認</li>
<li><strong>ロック競合が発生しました</strong> — SM12 でロックエントリを確認・解除</li>
</ol>
<div class="dialog student"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">たろうくん</span>「エラーが出るたびに毎回パニックになってしまいます…」</div></div>',
    ],
    [
        'title' => 'パフォーマンス最適化と効率化',
        'time' => '25 min',
        'content' => '<h2>作業効率を最大化するテクニック</h2>
<p>日々の操作をより速く、より正確に行うためのテクニックを紹介します。</p>
<h3>バッチインプットの活用</h3>
<p>同じような入力を繰り返す場合は、バッチインプット（SHDB）を使って自動化しましょう。</p>
<h3>バリアントとショートカット</h3>
<p>よく使うレポートはバリアントとして保存しておくと、毎回選択条件を入力する手間が省けます。また、トランザクションコードは自分用のお気に入りリストに登録しておくと便利です。</p>
<div class="callout-box"><div class="ic">💡</div><div><div class="title">パンダ先生の時短ワザ</div>トランザクションコードの代わりに /n コマンドを使うと、現在のセッションを離れずに別のトランザクションにジャンプできます。例：/nFB50</div></div>',
    ],
    [
        'title' => 'ケーススタディ：実務を想定した演習',
        'time' => '40 min',
        'content' => '<h2>総合演習</h2>
<p>ここまで学んだ知識を組み合わせて、実際の業務に近いケーススタディに取り組みます。</p>
<h3>演習シナリオ</h3>
<p>ある企業で発生した一連の業務処理を、システム上で再現してみましょう。</p>
<h3>演習課題</h3>
<ul>
<li>取引先マスタの登録と確認</li>
<li>受注から出荷までの一連の処理</li>
<li>関連する会計伝票の確認</li>
<li>レポート出力とエラーチェック</li>
</ul>
<p>各ステップが完了したら、確認リストにチェックを入れながら進めてください。</p>',
    ],
    [
        'title' => 'まとめと修了テスト',
        'time' => '20 min',
        'content' => '<h2>コースの総まとめ</h2>
<p>全レッスンを通して学んだ内容を振り返り、理解度を確認します。</p>
<h3>学習内容の振り返り</h3>
<ul>
<li>基本概念と設定方法を理解できたか</li>
<li>主要トランザクションを操作できるか</li>
<li>エラー発生時の対処手順を把握しているか</li>
</ul>
<h3>修了テスト</h3>
<p>各レッスンの重要ポイントから出題される確認テストに挑戦しましょう。正答率 80% 以上で修了です。</p>
<h3>次のステップ</h3>
<p>本コースで学んだ内容をベースに、より高度な応用コースや関連モジュールの学習に進むことをおすすめします。</p>
<div class="dialog"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">パンダ先生</span>「お疲れさまでした！学んだ知識はぜひ実務で活かしてくださいね。何か質問があればいつでもコミュニティで聞いてください 🎋」</div></div>',
    ],
    // === 追加 10 レッスン（合計20レッスン）===
    [
        'title' => '権限設定とセキュリティ基礎',
        'time' => '25 min',
        'content' => '<h2>SAP 権限管理の基礎</h2><p>SAP システムのセキュリティは権限設定が要です。</p><h3>PFCG によるロール管理</h3><p>ロールの作成、メニューと権限データの割当、プロファイル生成の流れを解説します。</p><h3>権限エラーのトラブルシュート</h3><p>SU53 を使った権限チェック、不足権限の特定方法、よくある権限エラーのパターンと対処法。</p><div class="callout-box warn"><div class="ic">⚠️</div><div><div class="title">セキュリティの基本</div>最小権限の原則に従い、必要最小限の権限のみを付与するよう心がけましょう。</div></div>',
    ],
    [
        'title' => 'データ移行とバッチ入力の実践',
        'time' => '30 min',
        'content' => '<h2>効率的なデータ移行手法</h2><p>大量データをSAPに取り込む方法を学びます。</p><h3>バッチインプット（SHDB）</h3><p>トランザクションの操作を記録し、繰り返し実行する方法。テンプレートの作成から実行までを解説。</p><h3>LSMW の活用</h3><p>Legacy System Migration Workbench を使ったデータ移行手順。マッピングルールの定義、変換ルールの設定。</p><pre><code>移行の基本手順：
1. ソースデータの準備（Excel/CSV）
2. フィールドマッピング設定
3. 変換ルールの定義
4. テスト実行とエラー修正
5. 本番実行</code></pre>',
    ],
    [
        'title' => 'ワークフローと承認プロセス',
        'time' => '20 min',
        'content' => '<h2>SAP ワークフロー入門</h2><p>SAP のワークフロー機能を使って業務プロセスを自動化する方法を学びます。</p><h3>ワークフローの構成要素</h3><p>ワークフロータスク、ルール、エージェント決定の仕組みについて解説。</p><h3>購買承認ワークフロー</h3><p>発注書の承認プロセスを例に、実際のワークフロー設定手順を追います。</p><div class="dialog"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">パンダ先生</span>「ワークフローを活用すると、承認漏れや二重確認の手間が大幅に削減できますよ。」</div></div>',
    ],
    [
        'title' => 'カスタマイジング実践：IMG設定',
        'time' => '35 min',
        'content' => '<h2>IMG カスタマイジングの実践</h2><p>プロジェクトで実際に行うカスタマイジング作業の進め方を学びます。</p><h3>プロジェクトガイドライン</h3><p>命名規則、ドキュメンテーション基準、トランスポート管理のベストプラクティス。</p><h3>代表的なカスタマイジング実例</h3><p>会社コード設定、勘定科目表のコピー、支払条件の定義など、実務でよく行う設定手順。</p><div class="callout-box"><div class="ic">💡</div><div><div class="title">パンダ先生のポイント</div>カスタマイジングは必ず要件定義書と照らし合わせながら行いましょう。終わったら必ずテスト伝票で動作確認を！</div></div>',
    ],
    [
        'title' => 'システム連携とインターフェース',
        'time' => '25 min',
        'content' => '<h2>SAP と外部システムの連携</h2><p>SAP システムを他のシステムと連携する方法を学びます。</p><h3>インターフェースの種類</h3><p>RFC、BAPI、IDoc、WebService、OData など SAP が提供する連携手段の概要と使い分け。</p><h3>実際の連携シナリオ</h3><p>Web ショップから SAP への受注連携、仕入先との発注データ交換（EDI）など実務例を紹介。</p>',
    ],
    [
        'title' => '月次・年次決算処理の実務',
        'time' => '30 min',
        'content' => '<h2>決算業務の流れを理解する</h2><p>SAP での月次決算・年次決算処理の一連の流れを追います。</p><h3>月次決算の主要タスク</h3><ul><li>仕訳の定例処理</li><li>減価償却の実行</li><li>買掛金・売掛金の残高確認</li><li>仮勘定の洗替</li><li>決算整理仕訳の入力</li></ul><h3>年次決算のポイント</h3><p>残高繰越、新年度準備、監査対応について。</p><div class="callout-box warn"><div class="ic">⚠️</div><div><div class="title">要チェック</div>決算処理は順序が重要です。必ず決算カレンダーに従って順番に実行しましょう。</div></div>',
    ],
    [
        'title' => 'バックアップと障害復旧の基礎',
        'time' => '15 min',
        'content' => '<h2>システム保全の基礎知識</h2><p>SAP システムのバックアップ戦略と障害復旧の基本を理解します。</p><h3>バックアップ戦略</h3><p>データベースバックアップ、トランスポートバックアップ、アーカイブの基本。</p><h3>障害復旧手順</h3><p>よくあるシステム障害のシナリオ別復旧手順。DBA 作業と連携した運用フロー。</p>',
    ],
    [
        'title' => 'ユーザートレーニングと導入支援',
        'time' => '20 min',
        'content' => '<h2>エンドユーザー教育の進め方</h2><p>SAP 導入プロジェクトにおけるユーザートレーニングの計画と実施方法。</p><h3>トレーニング計画</h3><p>役割別のカリキュラム設計、マニュアル作成、テスト環境の準備。</p><h3>効果的な教育手法</h3><p>座学と実機演習のバランス、QA 対応、習熟度確認テストの実施方法。</p><div class="dialog student"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><ellipse cx="58" cy="64" rx="5" ry="3" fill="#f4b8c4" opacity="0.6" /><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 46 70 Q 50 74 54 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">たろうくん</span>「トレーニングで覚えても、本番で実際に使うときにまた迷ってしまいそうです…」</div></div>',
    ],
    [
        'title' => 'SAP Notes と情報源の活用',
        'time' => '15 min',
        'content' => '<h2>問題解決のための情報源</h2><p>SAP に関する疑問や問題を解決するための情報源とその活用方法を紹介します。</p><h3>SAP Notes の読み方</h3><p>SAP Support Portal での Note 検索、適用方法、よく使う Note の種類。</p><h3>役立つコミュニティと情報源</h3><ul><li>SAP Community（旧 SCN）</li><li>SAP Help Portal</li><li>SAP Road Map Explorer</li><li>パンダ先生のナレッジサイト（日本語情報）</li></ul>',
    ],
    [
        'title' => 'プロジェクト実践：最終課題',
        'time' => '45 min',
        'content' => '<h2>実践力確認の最終課題</h2><p>コースで学んだすべての知識を活用した最終課題に取り組みます。</p><h3>課題内容</h3><p>架空企業の SAP 導入プロジェクトを想定し、要件定義から設定、テストまでの一連の流れを実践します。</p><h3>提出物</h3><ul><li>業務フロー図</li><li>カスタマイジング設定書</li><li>テスト結果報告書</li></ul><p>各課題の解答例は次回のセッションで確認できます。わからない点はコミュニティで質問してください。</p><div class="dialog"><svg width="48" height="48" viewBox="-4 -8 108 108"><circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4" /><path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" /><g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g><circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" /><circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" /><ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" /><path d="M 43 70 Q 50 74 57 70" fill="#1a1612" /></svg><div class="bubble"><span class="who">パンダ先生</span>「最終課題は実務を強く意識した内容です。じっくり取り組んでくださいね 🎋」</div></div>',
    ],
];

foreach ($course_posts as $cp) {
    $course_title = esc_html($cp->post_title);
    foreach ($lesson_templates as $j => $lt) {
        $title = $course_title . '：' . $lt['title'];
        $exists = get_posts(['post_type' => 'lesson', 'title' => $title, 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
        if (!empty($exists)) { echo "  スキップ（既存）: {$title}\n"; continue; }
        // コース名を内容に埋め込む
        $content = str_replace(
            ['<h2>コース概要</h2>', '<h2>事前に必要な知識</h2>', '<h2>総合演習</h2>'],
            ['<h2>' . $lt['title'] . '</h2>', '<h2>' . $lt['title'] . '</h2>', '<h2>' . $lt['title'] . '</h2>'],
            $lt['content']
        );
        $content = '<p style="font-size:13px;color:var(--ink-2);margin-bottom:16px;">コース: ' . $course_title . '</p>' . $content;
        $lid = wp_insert_post(['post_type' => 'lesson', 'post_title' => $title, 'post_content' => $content, 'post_status' => 'publish', 'post_author' => 1]);
        if (is_wp_error($lid)) { echo "  エラー: {$title}\n"; continue; }
        update_post_meta($lid, 'lesson_course_id', $cp->ID);
        update_post_meta($lid, 'lesson_order', $j + 1);
        update_post_meta($lid, 'lesson_time', $lt['time']);
        echo "  ✓ 作成: {$title} (ID: {$lid})\n";
        $i++;
    }
}
echo "レッスン: {$i} 件作成\n";

// ナレッジの参照リンク設定
echo "\nナレッジの参照リンクを設定中...\n";
$ref_count = 0;
foreach ($knowledge_refs as $ktitle => $refs) {
    $posts = get_posts(['post_type' => 'knowledge', 'title' => $ktitle, 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
    if (!empty($posts)) {
        update_post_meta($posts[0], 'knowledge_references', $refs);
        echo "  ✓ 設定: {$ktitle} (" . count($refs) . "件)\n";
        $ref_count++;
    }
}
echo "ナレッジ参照: {$ref_count} 件設定\n";
// ----- 案件データ -----
echo "\n案件を作成中...\n";
$cases_data = [
	['title' => 'グローバル製造業 / S/4HANA 移行に伴う FI-CO コンサルタント', 'blurb' => '大手製造業のS/4HANA移行プロジェクト。', 'rate_min' => 85, 'rate_max' => 110, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 2, 'urgent' => true, 'scarce' => false, 'company' => 'SAPナレッジ', 'mods' => ['fi','co'], 'must' => ['FI','CO'], 'want' => ['PM経験']],
	['title' => 'ABAP アドオン開発リーダー', 'blurb' => 'S/4HANA環境でのアドオン開発。CDS View/RAP。', 'rate_min' => 75, 'rate_max' => 95, 'period' => '長期', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => true, 'scarce' => false, 'company' => 'ITソリューションズ', 'mods' => ['abap'], 'must' => ['ABAP','CDS'], 'want' => ['RAP']],
	['title' => 'MM-SD 保守運用 & 機能改善', 'blurb' => '小売業のSAP保守運用。MM/SDの日常運用と改善。', 'rate_min' => 65, 'rate_max' => 80, 'period' => '6ヶ月〜', 'location' => '大阪', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '関西システム', 'mods' => ['mm','sd'], 'must' => ['MM','SD'], 'want' => ['EDI']],
	['title' => 'S/4HANA 導入 PMO・推進支援', 'blurb' => '商社のS/4HANA導入PMO。スケジュール品質管理。', 'rate_min' => 90, 'rate_max' => 110, 'period' => '1年〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '7年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '総合商社A', 'mods' => ['s4','fi'], 'must' => ['S/4HANA','PM'], 'want' => ['FI']],
	['title' => 'CO 原価計算まわりの設計支援', 'blurb' => '製造業の原価計算プロセス見直し。CO設計設定支援。', 'rate_min' => 70, 'rate_max' => 85, 'period' => '3ヶ月〜', 'location' => '名古屋', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 2, 'urgent' => true, 'scarce' => false, 'company' => '中部工業', 'mods' => ['co'], 'must' => ['CO','原価計算'], 'want' => ['生産管理']],
	['title' => 'SAP Basis 運用保守', 'blurb' => '大手企業のSAP基盤運用。パッチ・権限管理。', 'rate_min' => 60, 'rate_max' => 75, 'period' => '長期', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'ITインフラサービス', 'mods' => ['basis'], 'must' => ['Basis','NetWeaver'], 'want' => ['CLOUD']],
	['title' => 'PP-MM 生産・購買プロセス改善', 'blurb' => '製造業の生産購買プロセス改善。BP設計テスト支援。', 'rate_min' => 72, 'rate_max' => 88, 'period' => '6ヶ月〜', 'location' => '福岡', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => true, 'scarce' => false, 'company' => '九州製造', 'mods' => ['pp','mm'], 'must' => ['PP','MM'], 'want' => ['APO']],
	['title' => 'SD 受注〜請求の機能拡張', 'blurb' => 'BtoB企業のSD機能拡張。条件設定出力設定。', 'rate_min' => 68, 'rate_max' => 82, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '商社B', 'mods' => ['sd'], 'must' => ['SD'], 'want' => ['IDOC']],
	['title' => 'SuccessFactors 導入コンサルタント', 'blurb' => 'クラウドHR導入支援。給与連携設定支援。', 'rate_min' => 80, 'rate_max' => 100, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => true, 'scarce' => true, 'company' => 'HRテクノロジーズ', 'mods' => ['hr'], 'must' => ['SuccessFactors'], 'want' => ['EC','ECP']],
	['title' => 'FI 決算業務効率化支援', 'blurb' => '食品メーカーの月次決算効率化。自動化と報告書。', 'rate_min' => 65, 'rate_max' => 78, 'period' => '3ヶ月〜', 'location' => '横浜', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '横浜フーズ', 'mods' => ['fi'], 'must' => ['FI','決算業務'], 'want' => ['FSCM']],
	['title' => 'ABAP パフォーマンス改善 / 基幹システム高速化', 'blurb' => '大規模SAPのパフォーマンスチューニング。', 'rate_min' => 78, 'rate_max' => 95, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '5年以上', 'seats' => 1, 'urgent' => true, 'scarce' => false, 'company' => 'テクノロジーコンサル', 'mods' => ['abap'], 'must' => ['ABAP','SQL'], 'want' => ['HANA']],
	['title' => 'S/4HANA 資産管理導入', 'blurb' => '電力会社のS/4HANA導入。資産管理移行設計。', 'rate_min' => 82, 'rate_max' => 98, 'period' => '1年〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 2, 'urgent' => false, 'scarce' => false, 'company' => '東京電力システムズ', 'mods' => ['s4','fi'], 'must' => ['S/4HANA','資産管理'], 'want' => ['PS']],
	['title' => 'MM 購買プロセス標準化', 'blurb' => '製薬会社の購買標準化プロジェクト。グローバル展開。', 'rate_min' => 72, 'rate_max' => 86, 'period' => '6ヶ月〜', 'location' => '大阪', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '関西製薬', 'mods' => ['mm'], 'must' => ['MM','購買'], 'want' => ['英語']],
	['title' => 'Fiori UX デザイン・開発', 'blurb' => 'SAP Fiori UI/UX改善。画面設計と実装。', 'rate_min' => 70, 'rate_max' => 90, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'UXデザイン', 'mods' => ['abap'], 'must' => ['Fiori','SAPUI5'], 'want' => ['JavaScript']],
	['title' => 'SD 価格設定条件管理高度化', 'blurb' => '流通業の価格設定条件見直しと最適化。', 'rate_min' => 68, 'rate_max' => 80, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '日本流通グループ', 'mods' => ['sd'], 'must' => ['SD','条件技術'], 'want' => ['ABAP']],
	['title' => 'FI-AP/AR 業務移管支援', 'blurb' => 'レガシー会計からSAPへの移行。買掛売掛移行。', 'rate_min' => 62, 'rate_max' => 76, 'period' => '6ヶ月〜', 'location' => '名古屋', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 2, 'urgent' => false, 'scarce' => false, 'company' => '中部会計コンサル', 'mods' => ['fi'], 'must' => ['FI','AP/AR'], 'want' => ['LSMW']],
	['title' => 'BW/4HANA データ分析基盤構築', 'blurb' => 'DWH刷新プロジェクト。BW/4HANA移行とレポート。', 'rate_min' => 80, 'rate_max' => 105, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => true, 'scarce' => false, 'company' => 'データソリューションズ', 'mods' => ['s4','abap'], 'must' => ['BW','ABAP','HANA'], 'want' => ['PowerBI']],
	['title' => 'PP 生産計画高度化プロジェクト', 'blurb' => '生産計画高度化。MRP設定最適化と需要予測。', 'rate_min' => 75, 'rate_max' => 90, 'period' => '6ヶ月〜', 'location' => '大阪', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'ものづくりシステム', 'mods' => ['pp'], 'must' => ['PP','MRP'], 'want' => ['APO']],
	['title' => 'SAP セキュリティ監査・権限見直し', 'blurb' => '大企業SAPセキュリティ監査。SoD分析権限見直し。', 'rate_min' => 72, 'rate_max' => 88, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '5年以上', 'seats' => 1, 'urgent' => true, 'scarce' => false, 'company' => 'セキュリティコンサル', 'mods' => ['basis'], 'must' => ['Basis','GRC'], 'want' => ['CISA']],
	['title' => 'MM サプライチェーン改革', 'blurb' => '化学メーカーSCM改革。購買〜在庫再構築。', 'rate_min' => 70, 'rate_max' => 85, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'ケミカルジャパン', 'mods' => ['mm','pp'], 'must' => ['MM','SCM'], 'want' => ['WM']],
	['title' => 'SAP on Azure / クラウド移行', 'blurb' => 'SAPのクラウド移行。Azure移行設計実施。', 'rate_min' => 85, 'rate_max' => 110, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => true, 'scarce' => true, 'company' => 'クラウドインテグレーター', 'mods' => ['basis'], 'must' => ['Basis','Azure'], 'want' => ['AWS']],
	['title' => 'FI 連結会計システム導入', 'blurb' => '連結会計のグローバルロールアウト。グループ展開。', 'rate_min' => 78, 'rate_max' => 95, 'period' => '1年〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'グローバル商事', 'mods' => ['fi','co'], 'must' => ['FI','CO','連結'], 'want' => ['英語']],
	['title' => 'SAP BTP 拡張開発・インテグレーション', 'blurb' => 'SAP BTP上の拡張アプリ開発。', 'rate_min' => 80, 'rate_max' => 100, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '3年以上', 'seats' => 2, 'urgent' => true, 'scarce' => false, 'company' => 'BTPイノベーションズ', 'mods' => ['abap','s4'], 'must' => ['BTP','CAP'], 'want' => ['Fiori']],
	['title' => 'SD マルチチャネル販売対応', 'blurb' => '小売EC連携強化。オムニチャネルSD拡張。', 'rate_min' => 65, 'rate_max' => 78, 'period' => '3ヶ月〜', 'location' => '大阪', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'リテールソリューションズ', 'mods' => ['sd'], 'must' => ['SD','EC連携'], 'want' => ['CRM']],
	['title' => 'SAP テスト自動化推進', 'blurb' => 'SAPテスト自動化。計画立案からスクリプト作成。', 'rate_min' => 60, 'rate_max' => 75, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '3年以上', 'seats' => 3, 'urgent' => false, 'scarce' => false, 'company' => 'QAテクノロジーズ', 'mods' => ['fi','co','sd'], 'must' => ['SAP全般','テスト'], 'want' => ['CBTA']],
	['title' => 'SAP AMS アプリケーション運用', 'blurb' => '大手製造業SAP運用保守。インシデント改修。', 'rate_min' => 55, 'rate_max' => 70, 'period' => '長期', 'location' => '東京', 'remote' => 'リモート可', 'experience' => '3年以上', 'seats' => 3, 'urgent' => false, 'scarce' => false, 'company' => 'AMSサービス', 'mods' => ['fi','co','mm','sd'], 'must' => ['SAP運用','ABAP'], 'want' => ['英語']],
	['title' => 'SAP Signavio 業務プロセス可視化', 'blurb' => 'Signavioでプロセスモデリングと分析。', 'rate_min' => 72, 'rate_max' => 88, 'period' => '3ヶ月〜', 'location' => '東京', 'remote' => 'フルリモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => true, 'company' => 'プロセスコンサル', 'mods' => ['s4'], 'must' => ['Signavio','BPMN'], 'want' => ['SAP知識']],
	['title' => 'Ariba 購買プラットフォーム導入', 'blurb' => 'SAP Ariba導入。購買クラウド化とサプライヤー管理。', 'rate_min' => 76, 'rate_max' => 92, 'period' => '6ヶ月〜', 'location' => '東京', 'remote' => '一部リモート', 'experience' => '3年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => 'クラウド購買コンサル', 'mods' => ['mm'], 'must' => ['Ariba','購買'], 'want' => ['MM']],
	['title' => 'PP 生産計画最適化（自動車部品）', 'blurb' => '自動車部品メーカー。JITかんばん方式SAP実装。', 'rate_min' => 78, 'rate_max' => 92, 'period' => '6ヶ月〜', 'location' => '愛知', 'remote' => '一部リモート', 'experience' => '5年以上', 'seats' => 1, 'urgent' => false, 'scarce' => false, 'company' => '中部自動車部品', 'mods' => ['pp','mm'], 'must' => ['PP','かんばん'], 'want' => ['LE']],
];
$cases_created = 0;
$cases_skipped = 0;
foreach ($cases_data as $cd) {
	$exists = get_posts(['post_type' => 'sap_case', 'title' => $cd['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
	if (!empty($exists)) { echo "  スキップ（既存）: {$cd['title']}\n"; $cases_skipped++; continue; }
	$pid = wp_insert_post(['post_type' => 'sap_case', 'post_title' => $cd['title'], 'post_content' => $cd['blurb'], 'post_status' => 'publish', 'post_author' => 1]);
	if (is_wp_error($pid)) { echo "  エラー\n"; continue; }
	foreach (['rate_min', 'rate_max', 'period', 'location', 'remote', 'experience', 'company', 'blurb'] as $k) {
		if (isset($cd[$k])) update_post_meta($pid, "case_{$k}", sanitize_text_field(strval($cd[$k])));
	}
	update_post_meta($pid, 'case_seats', $cd['seats']);
	update_post_meta($pid, 'case_urgent', $cd['urgent'] ? '1' : '0');
	update_post_meta($pid, 'case_scarce', $cd['scarce'] ? '1' : '0');
	if (!empty($cd['must'])) {
		$flat = $cd['must'];
		$repeater = array_map(function($s) { return ['skill' => $s]; }, $flat);
		update_post_meta($pid, 'case_skills_must', $repeater);
		update_post_meta($pid, 'case_skills_must_flat', $flat);
	}
	if (!empty($cd['want'])) {
		$want_arr = is_array($cd['want']) ? $cd['want'] : [$cd['want']];
		$repeater = array_map(function($s) { return ['skill' => $s]; }, $want_arr);
		update_post_meta($pid, 'case_skills_want', $repeater);
		update_post_meta($pid, 'case_skills_want_flat', $want_arr);
	}
	foreach ($cd['mods'] as $m) wp_set_object_terms($pid, $m, 'sap_module');
	echo "  ✓ {$cd['title']} (ID: {$pid})\n";
	$cases_created++;
}
echo "案件: {$cases_created} 件作成";
if ($cases_skipped > 0) echo ", {$cases_skipped} 件スキップ";
echo "\n";


// ----- 動画データ -----
echo "\n動画を作成中...\n";
$video_data = [
	['title' => 'SAP S/4HANA とは？ 次世代ERPの全体像をわかりやすく解説', 'youtube_id' => 'T6keCslui-w', 'duration' => '15:22', 'views' => 45200, 'module' => 's4'],
	['title' => 'SAP Fiori 入門：モダンなUXの基本を20分で学ぶ', 'youtube_id' => 'CilkabPmH5k', 'duration' => '20:15', 'views' => 28300, 'module' => 's4'],
	['title' => 'ABAP プログラミング基礎：第一回「Hello World」', 'youtube_id' => '5RgrW5etNvw', 'duration' => '12:08', 'views' => 38900, 'module' => 'abap'],
	['title' => 'CDS View 完全入門：S/4HANA 開発の新常識', 'youtube_id' => 'GZdnF9Ad9TE', 'duration' => '25:30', 'views' => 21500, 'module' => 'abap'],
	['title' => 'SAP FI/CO 基本設定：会社コードから利益センタまで', 'youtube_id' => '27y5aJPBnu0', 'duration' => '35:45', 'views' => 32400, 'module' => 'fi'],
	['title' => '決算業務の効率化：SAPでの月次決算手順', 'youtube_id' => 'CpqqMLqyFf4', 'duration' => '28:12', 'views' => 18100, 'module' => 'fi'],
	['title' => 'MM 購買プロセス完全マスター：購買依頼から発注まで', 'youtube_id' => 'BlUzA02Hg5Y', 'duration' => '32:50', 'views' => 25600, 'module' => 'mm'],
	['title' => '在庫管理の実務：移動タイプと棚卸の完全ガイド', 'youtube_id' => '2eNktRSoP4k', 'duration' => '22:18', 'views' => 14200, 'module' => 'mm'],
	['title' => 'SD 受注から出荷までの流れを徹底解説', 'youtube_id' => '7wijycTVXZo', 'duration' => '18:44', 'views' => 19800, 'module' => 'sd'],
	['title' => 'SAP SD 価格設定の仕組み：条件テクニック完全理解', 'youtube_id' => '4FSv5B-yWVw', 'duration' => '26:30', 'views' => 12500, 'module' => 'sd'],
	['title' => 'CO 原価センタ会計入門：配賦サイクルの設定方法', 'youtube_id' => '5Hg4EeKPC3E', 'duration' => '24:15', 'views' => 16300, 'module' => 'co'],
	['title' => '内部受注の設定と実務：予算管理から決済まで', 'youtube_id' => '43LG7Qkkx7Q', 'duration' => '19:50', 'views' => 9800, 'module' => 'co'],
	['title' => 'ABAP オブジェクト指向プログラミング入門', 'youtube_id' => 'MsDg5-Vpc3E', 'duration' => '28:30', 'views' => 31200, 'module' => 'abap'],
	['title' => 'RAP モデル開発：Restful ABAP Programming Model 実践', 'youtube_id' => 'K6wBDu1S_Ew', 'duration' => '38:20', 'views' => 18700, 'module' => 'abap'],
	['title' => 'SAP Fiori Elements でアプリ開発を10倍速くする方法', 'youtube_id' => '8J3EkPGrZrs', 'duration' => '22:45', 'views' => 22300, 'module' => 'abap'],
	['title' => 'Basis システム管理：ユーザー権限とロール設定の基本', 'youtube_id' => '7YQPxfN1WTQ', 'duration' => '30:10', 'views' => 14500, 'module' => 'basis'],
	['title' => 'SAP トランスポート管理：開発から本番への変更移送', 'youtube_id' => 'H0cygF3iwKQ', 'duration' => '27:35', 'views' => 11200, 'module' => 'basis'],
	['title' => 'SAP パフォーマンスチューニング：ST05/STAD で遅いプログラムを特定', 'youtube_id' => '5tj7s-Y_uIc', 'duration' => '34:20', 'views' => 20800, 'module' => 'basis'],
	['title' => 'PP MRP 完全マスター：資材所要量計画のロジックを理解する', 'youtube_id' => 'KmAhZ8QgAms', 'duration' => '31:40', 'views' => 13800, 'module' => 'pp'],
	['title' => 'BOMと作業手順：生産マスタデータの基礎知識', 'youtube_id' => 'M9rl_ev78lA', 'duration' => '18:55', 'views' => 9400, 'module' => 'pp'],
	['title' => 'SuccessFactors 導入ガイド：クラウドHRの基本から連携まで', 'youtube_id' => 'FIpiqs10Fug', 'duration' => '26:10', 'views' => 16000, 'module' => 'hr'],
	['title' => 'SAP HR 人事マスタ管理：インフォタイプの基礎', 'youtube_id' => 'QTEtdzm8CBQ', 'duration' => '21:30', 'views' => 10500, 'module' => 'hr'],
	['title' => 'SAP S/4HANA 移行プロジェクト実践ガイド', 'youtube_id' => 'F7n1f4Slckk', 'duration' => '42:15', 'views' => 35600, 'module' => 's4'],
	['title' => 'Universal Journal とは？ S/4HANA 会計の核心を解説', 'youtube_id' => 'JZshQ-9uCfM', 'duration' => '16:40', 'views' => 28400, 'module' => 's4'],
	['title' => 'ALV レポート開発：SAP List Viewer を使いこなす', 'youtube_id' => 'RwLCjJcQEmg', 'duration' => '23:50', 'views' => 19800, 'module' => 'abap'],
	['title' => 'SAP バッチインプット：SHDB で大量データ処理を自動化', 'youtube_id' => '5j82VPDb-oY', 'duration' => '19:20', 'views' => 17500, 'module' => 'abap'],
	['title' => 'SM30 テーブルメンテナンス：カスタマイジングテーブルの操作', 'youtube_id' => '5ykKcN4OHiM', 'duration' => '14:35', 'views' => 15200, 'module' => 'basis'],
	['title' => 'SAP 権限エラーのトラブルシュート：SU53 の使い方', 'youtube_id' => 'CUkHmcTTJ-w', 'duration' => '17:50', 'views' => 23100, 'module' => 'basis'],
	['title' => 'ME21N 発注書作成：購買業務の基本操作をマスター', 'youtube_id' => 'BQGHuN4nMo4', 'duration' => '16:10', 'views' => 11400, 'module' => 'mm'],
	['title' => '在庫評価の実務：移動平均法と標準原価法を理解する', 'youtube_id' => 'E3jREujUonU', 'duration' => '20:45', 'views' => 8700, 'module' => 'mm'],
	['title' => 'VA01 受注作成の完全ガイド：標準受注から返品まで', 'youtube_id' => 'EqSizBH2n0w', 'duration' => '22:30', 'views' => 13500, 'module' => 'sd'],
	['title' => 'VF01 請求書作成：出荷ベースの請求処理', 'youtube_id' => '7W5_z0Ic-Hk', 'duration' => '15:15', 'views' => 10200, 'module' => 'sd'],
	['title' => 'SAP S/4HANA Cloud vs On-Premise：違いと選び方', 'youtube_id' => '81DYGSqNssw', 'duration' => '28:00', 'views' => 41000, 'module' => 's4'],
	['title' => 'Greenfield vs Brownfield：S/4HANA 移行方式の選定', 'youtube_id' => '22bPMtTuGz8', 'duration' => '33:20', 'views' => 28500, 'module' => 's4'],
	['title' => 'SAP BTP 入門：ビジネステクノロジープラットフォームの概要', 'youtube_id' => '43LG7Qkkx7Q', 'duration' => '24:50', 'views' => 19800, 'module' => 's4'],
	['title' => 'SAP Analytics Cloud でデータ分析を始めよう', 'youtube_id' => '5RgrW5etNvw', 'duration' => '19:35', 'views' => 14600, 'module' => 's4'],
	['title' => 'FBCJ で小口現金管理：Cash Journal の使い方', 'youtube_id' => '7YQPxfN1WTQ', 'duration' => '13:40', 'views' => 7200, 'module' => 'fi'],
	['title' => 'SAP 連結会計入門：グループ決算の基礎知識', 'youtube_id' => '5j82VPDb-oY', 'duration' => '27:15', 'views' => 16300, 'module' => 'fi'],
	['title' => 'MM 購買情報照会：ME2L/ME2M/ME2N の使い分け', 'youtube_id' => 'H0cygF3iwKQ', 'duration' => '15:50', 'views' => 8900, 'module' => 'mm'],
	['title' => 'PP かんばん方式：SAPでの引当て生産の実装方法', 'youtube_id' => 'M9rl_ev78lA', 'duration' => '22:10', 'views' => 7600, 'module' => 'pp'],
];

$vi = 0;
foreach ($video_data as $vd) {
	$exists = get_posts(['post_type' => 'video', 'title' => $vd['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
	if (!empty($exists)) { echo "  スキップ（既存）\n"; continue; }
	$vpid = wp_insert_post(['post_type' => 'video', 'post_title' => $vd['title'], 'post_excerpt' => $vd['title'] . ' — SAPパンダ先生の解説動画です。', 'post_status' => 'publish', 'post_author' => 1]);
	if (is_wp_error($vpid)) { echo "  エラー\n"; continue; }
	update_post_meta($vpid, 'video_youtube_id', $vd['youtube_id']);
	update_post_meta($vpid, 'video_duration', $vd['duration']);
	update_post_meta($vpid, 'video_views', $vd['views']);
	if (!empty($vd['module'])) wp_set_object_terms($vpid, $vd['module'], 'sap_module');
	echo "  ✓ {$vd['title']} (ID: {$vpid})\n";
	$vi++;
}
echo "動画: {$vi} 件作成\n";

// ----- 固定ページ（about / team / privacy / terms）-----
echo "\n固定ページを作成中...\n";
$site_pages = [
	'about' => [
		'title' => 'サイトについて',
		'content' => '<h2>SAP パンダ先生 NAVI とは</h2>
<p>SAP に関わるすべての人に向けた総合ナレッジサイトです。</p>
<h2>私たちのミッション</h2>
<p>SAP の世界は広く、専門用語も多く、「どこから始めればいいのかわからない」という声をよく聞きます。パンダ先生 NAVI は、そんな迷える SAPer のために、やさしく・わかりやすい解説を提供します。</p>
<h2>カバーする領域</h2>
<ul>
<li>FI（財務会計）、CO（管理会計）、MM（購買管理）、SD（販売管理）</li>
<li>PP（生産計画）、HR（人事管理）、ABAP（開発）、Basis（基盤）</li>
<li>S/4HANA、Fiori、クラウド、最新トピック</li>
</ul>
<h2>運営情報</h2>
<p>運営: パンダ先生プロジェクトチーム</p>',
	],
	'team' => [
		'title' => '執筆メンバー',
		'content' => '<p>SAP パンダ先生 NAVI は、現役 SAP コンサルタントやエンジニアが執筆しています。</p>
<h3>パンダ先生 🐼</h3>
<p>SAP歴20年のベテラン。難しい概念をやさしく解説するのが得意。</p>
<h3>たろうくん 👨‍💻</h3>
<p>24歳・SAP学習中の若手。読者の目線で「わからない」を代弁する。</p>
<h3>タナカ ⚡</h3>
<p>バックエンド開発が専門。ABAP パフォーマンス改善の記事を担当。</p>
<h3>サトウ 📋</h3>
<p>S/4HANA 移行プロジェクトを多数手がける。プロジェクト管理の記事を執筆。</p>',
	],
	'privacy' => [
		'title' => 'プライバシーポリシー',
		'content' => '<h2>個人情報の収集について</h2>
<p>当サイトでは、お問い合わせフォームの送信時に、お名前・メールアドレス等の個人情報をご提供いただく場合がございます。これらの情報は、お問い合わせへの回答のみに利用し、同意なく第三者に提供することはありません。</p>
<h2>アクセス解析について</h2>
<p>当サイトでは、サービス向上のためアクセスログを収集することがあります。収集される情報には、閲覧されたページ、日時、ブラウザの種類などが含まれますが、個人を特定する目的では使用しません。</p>
<h2>Cookie について</h2>
<p>当サイトでは、ユーザー体験向上のために Cookie を使用することがあります。ブラウザの設定で Cookie を無効にすることも可能です。</p>
<h2>免責事項</h2>
<p>当サイトに掲載されている情報の正確性には細心の注意を払っていますが、その完全性・正確性を保証するものではありません。当サイトの情報を利用したことによる損害について、運営者は一切の責任を負いかねます。</p>
<h2>お問い合わせ</h2>
<p>プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>',
	],
	'terms' => [
		'title' => '利用規約',
		'content' => '<h2>はじめに</h2>
<p>本規約は、SAP パンダ先生 NAVI（以下「当サイト」）の利用条件を定めるものです。当サイトをご利用になることで、本規約に同意したものとみなします。</p>
<h2>知的財産権</h2>
<p>当サイトに掲載されている記事、画像、ロゴ等のコンテンツは、特別な断りがない限り運営者に帰属します。無断転載・複製を禁止します。</p>
<h2>禁止行為</h2>
<p>当サイトのご利用にあたり、以下の行為を禁止します：</p>
<ul>
<li>他のユーザーまたは第三者に迷惑・不利益を与える行為</li>
<li>当サイトの運営を妨害する行為</li>
<li>法令または公序良俗に違反する行為</li>
<li>当サイトのコンテンツを無断で転載・複製する行為</li>
</ul>
<h2>免責事項</h2>
<p>当サイトの情報は、SAP に関する学習・参考を目的として提供されています。実際のシステム設定や運用は、必ず公式ドキュメントや専門家の指導のもとで行ってください。</p>
<h2>規約の変更</h2>
<p>当サイトは、予告なく本規約を変更することがあります。変更後の規約は、当サイトに掲載された時点で効力を生じるものとします。</p>
<p style="margin-top:24px;color:#666;font-size:13px">制定日: 2026年1月1日</p>',
	],
];

$page_created = 0;
$page_skipped = 0;
foreach ($site_pages as $slug => $page) {
	$exists = get_posts(['post_type' => 'page', 'name' => $slug, 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
	if (!empty($exists)) {
		echo "  スキップ（既存）: /{$slug}\n";
		$page_skipped++;
		continue;
	}
	$pid = wp_insert_post([
		'post_type' => 'page',
		'post_title' => $page['title'],
		'post_content' => $page['content'],
		'post_name' => $slug,
		'post_status' => 'publish',
		'post_author' => 1,
	]);
	if (is_wp_error($pid)) {
		echo "  エラー: /{$slug}\n";
		continue;
	}
	echo "  ✓ 作成: /{$slug} (ID: {$pid})\n";
	$page_created++;
}
echo "固定ページ: {$page_created} 件作成";
if ($page_skipped > 0) echo ", {$page_skipped} 件スキップ";
echo "\n";

// ====== NOTES ======
echo "\n--- 记事生成 ---\n";
$note_data = [
    ['title' => 'SAP 学習ロードマップ 2025年版', 'module' => 's4', 'difficulty' => 'beginner',
     'excerpt' => 'SAP学習を始める方向けのロードマップ。前提知識から学習順序まで、初学者が迷わないための完全ガイド。',
     'content' => '<h2>はじめに：SAP学習の全体像</h2>
<p>SAPの世界は広大で、「どこから手をつければいいのかわからない」という声をよく聞きます。本記事では、2025年現在の最新情報をもとに、効率的な学習ロードマップを提供します。</p>
<p>SAPの学習はマラソンと同じ。最初に全体像を把握し、計画的に進めることが成功の鍵です。</p>

<h2>ステップ0：学習前の準備</h2>
<p>学習を始める前に、以下の環境を整えましょう。</p>
<ul>
<li><strong>SAP Learning Hub</strong> — SAP公式の学習プラットフォーム。無料トライアルあり</li>
<li><strong>SAP Community</strong> — 世界中のSAPユーザーが集まるフォーラム</li>
<li><strong>SAP トレーニングシステム</strong> — 実際に操作できる練習環境</li>
</ul>
<p>特にSAP Learning Hubは、チュートリアルからハンズオンまで幅広いコンテンツが揃っています。</p>

<h2>ステップ1：基礎知識の習得（1〜2週目）</h2>
<p>まずはERPの基本概念とSAPの歴史を理解しましょう。</p>
<h3>このフェーズで学ぶこと</h3>
<ol>
<li>ERP（Enterprise Resource Planning）とは何か</li>
<li>SAPの歴史と市場での位置づけ</li>
<li>SAP S/4HANAへの移行トレンド</li>
<li>SAPの主要モジュールの役割</li>
</ol>
<p>この段階では、細かいトランザクションコードを覚える必要はありません。「SAPは何をするシステムなのか」という全体像をつかむことが目的です。</p>

<h2>ステップ2：モジュール選択（3週目）</h2>
<p>SAPには多くのモジュールがあります。自分のキャリア目標に合ったモジュールを選びましょう。</p>
<table>
<tr><th>モジュール</th><th>分野</th><th>おすすめの理由</th></tr>
<tr><td>FI/CO</td><td>財務会計・管理会計</td><td>どの企業でも需要が高く、初心者にも理解しやすい</td></tr>
<tr><td>MM</td><td>購買・在庫管理</td><td>ロジスティクスの基礎が学べる</td></tr>
<tr><td>SD</td><td>販売管理</td><td>売上サイクル全体を理解できる</td></tr>
<tr><td>ABAP</td><td>開発言語</td><td>技術スキルを活かしたい方に</td></tr>
</table>
<p>迷ったらFI/COから始めることをおすすめします。会計知識はどのモジュールの基礎にもなります。</p>

<h2>ステップ3：実践学習（4〜8週目）</h2>
<p>SAP GUIやFioriを使って実際に操作しながら学びます。</p>
<p>SAP Learning Hubのシステムにアクセスして、実際の画面を操作してみましょう。座学だけでは身につかない「現場感覚」を養うことが重要です。</p>
<p>このフェーズの学習時間の目安は以下の通りです：</p>
<ul>
<li>週3〜5時間の学習時間を確保</li>
<li>50% 実機操作、30% 座学、20% コミュニティ参加</li>
<li>毎週、学んだことをNoteにまとめる</li>
</ul>

<h2>ステップ4：認定資格への挑戦（9〜12週目）</h2>
<p>学習の集大成として、SAP認定資格に挑戦しましょう。資格取得はキャリアの大きなアドバンテージになります。</p>
<p><strong>次のステップ：</strong> 資格について詳しく知りたい方は「SAP 資格取得ガイド」を参照してください。</p>'],
    ['title' => 'SAP 資格取得ガイド', 'module' => 'fi', 'difficulty' => 'intermediate',
     'excerpt' => 'SAP認定資格の種類と効果的な取得方法を解説。キャリアアップを目指す方は必見。',
     'content' => '<h2>SAP認定資格とは</h2>
<p>SAP認定資格は、SAPの知識とスキルを客観的に証明する国際的な資格です。グローバルなIT業界で広く認知されており、SAPコンサルタントへのキャリアパスとして欠かせないものとなっています。</p>
<p>2025年現在、SAP認定資格は以下の4つのレベルに分類されます：</p>

<h3>アソシエイト（Associate）</h3>
<p>SAPの基礎知識を証明するエントリーレベルの資格です。各モジュールの基本的な機能と設定を理解していることが求められます。</p>
<ul>
<li>対象者：SAP経験1年未満、または学習を完了した方</li>
<li>試験時間：180分</li>
<li>出題数：80問</li>
<li>合格ライン：約65%</li>
</ul>

<h3>プロフェッショナル（Professional）</h3>
<p>より深い知識と実務経験を証明する中級レベルの資格です。</p>
<ul>
<li>対象者：SAP経験2年以上</li>
<li>プロジェクトでの実践的な経験が問われる</li>
<li>ケーススタディ形式の問題が含まれる</li>
</ul>

<h3>スペシャリスト（Specialist）</h3>
<p>SAP S/4HANAの特定分野（CLOUD、セキュリティ等）に特化した資格です。</p>

<h3>マスター（Master）</h3>
<p>SAPの最高峰資格。豊富な経験と深い知識を持つエキスパート向けです。</p>

<h2>おすすめの取得順序</h2>
<p>初心者の方は以下の順序で資格取得を目指すことをおすすめします：</p>
<ol>
<li><strong>SAP Certified Application Associate</strong> — まずは入門資格で基礎を固める</li>
<li><strong>SAP Certified Technology Professional</strong> — 技術力を証明</li>
<li><strong>SAP Certified Application Professional</strong> — 高度な知識と経験をアピール</li>
</ol>
<p>焦って上位資格を目指すよりも、Associateで基礎をしっかり固めてからステップアップする方が結果的に近道です。</p>

<h2>試験対策のポイント</h2>
<p>以下の方法で効果的に対策を進めましょう：</p>

<h3>SAP Learning Hub の活用</h3>
<p>SAP公式の学習プラットフォーム。模擬試験やe-learning、ハンズオン環境が含まれており、効率的な学習が可能です。</p>

<h3>模擬試験の反復</h3>
<p>出題傾向を掴むには、模擬試験を繰り返し解くことが最も効果的です。間違えた問題は必ず復習し、なぜ間違えたのかを理解しましょう。</p>

<h3>SAP Community での情報収集</h3>
<p>実際の試験を受けた人の体験談や、最新の試験情報を得ることができます。また、疑問点を質問すれば、経験者が丁寧に回答してくれます。</p>

<h2>よくある質問</h2>
<h3>Q: 英語の試験は難しいですか？</h3>
<p>日本語で受験可能な試験もありますが、英語の資料の方が情報量が豊富です。SAPの実務では英語が必要になることも多いため、英語での受験をおすすめします。</p>
<h3>Q: 資格の有効期限は？</h3>
<p>SAP認定資格に有効期限はありませんが、SAP製品のバージョンアップに伴い、最新バージョンの資格を取得することを推奨します。</p>'],
    ['title' => 'Fiori と SAPUI5 の違い', 'module' => 'abap', 'difficulty' => 'beginner',
     'excerpt' => 'SAP FioriとSAPUI5の関係性をわかりやすく整理。初学者が混乱しがちなこの2つの違いを徹底解説。',
     'content' => '<h2>はじめに：よくある混乱</h2>
<p>「FioriとSAPUI5って何が違うの？」これはSAPを学び始めた方から非常によく聞かれる質問です。両者は密接に関連していますが、役割と機能はまったく異なります。</p>
<p>この記事では、FioriとSAPUI5の違いを、できるだけシンプルに整理します。</p>

<h2>SAP Fiori とは</h2>
<p><strong>SAP Fiori</strong> は SAP のユーザーエクスペリエンス（UX）製品群の総称です。一言で言えば「SAPの新しいユーザーインターフェース標準」です。</p>
<h3>Fioriの特徴</h3>
<ul>
<li>シンプルで直感的な操作感 — スマホアプリのような使い心地</li>
<li>ロールベースのデザイン — ユーザーの職種に応じた画面構成</li>
<li>レスポンシブデザイン — PC・タブレット・スマホ、すべてのデバイスに対応</li>
<li>2000種類以上の標準アプリが用意されている</li>
<li>従来のSAP GUIと比較して、学習コストが大幅に低い</li>
</ul>

<p>Fioriは、従来のSAP GUI（古くからあるSAPの画面）に代わる、モダンで使いやすいインターフェースを提供するための戦略的な取り組みです。</p>

<h2>SAPUI5 とは</h2>
<p><strong>SAPUI5</strong> は Fiori アプリケーションを開発するためのフレームワーク（開発基盤）です。</p>
<h3>SAPUI5の特徴</h3>
<ul>
<li>HTML5ベースのモダンなWebフレームワーク</li>
<li>MVVM（Model-View-ViewModel）アーキテクチャを採用</li>
<li>豊富なUIコンポーネント（ボタン、テーブル、チャート等）を標準装備</li>
<li>データバインディングにより、少ないコードで高機能なアプリを開発可能</li>
<li>レスポンシブデザインに対応しており、様々な画面サイズに自動適合</li>
</ul>

<h2>両者の関係：家と工具の例え</h2>
<p>両者の関係を理解するのに、家を建てる例えがわかりやすいでしょう。</p>
<ul>
<li><strong>Fiori = 家の設計図・デザイン</strong> — 「どんな家を建てるか」のコンセプト部分</li>
<li><strong>SAPUI5 = 工具・建材</strong> — 実際に家を建てるための道具や材料</li>
</ul>
<p>SAPUI5というフレームワークを使って、Fioriのコンセプトに沿ったアプリケーションを開発する——これが正しい理解です。</p>

<h2>開発者から見た違い</h2>
<h3>Fioriの視点</h3>
<p>Fioriデザインガイドラインに従ってUIを設計します。画面レイアウト、色使い、動きのパターンなどが細かく定義されています。</p>
<h3>SAPUI5の視点</h3>
<p>SAPUI5を使ってコードを書きます。以下のような開発が可能です：</p>
<pre>&lt;mvc:View controllerName="myApp.controller.Main"&gt;
    &lt;Page title="{i18n&gt;title}"&gt;
        &lt;Table items="{/Products}"&gt;
            &lt;columns&gt;
                &lt;Column&gt;&lt;Text text="製品名"/&gt;&lt;/Column&gt;
                &lt;Column&gt;&lt;Text text="価格"/&gt;&lt;/Column&gt;
            &lt;/columns&gt;
            &lt;items&gt;
                &lt;ColumnListItem&gt;
                    &lt;cells&gt;
                        &lt;Text text="{ProductName}"/&gt;
                        &lt;Text text="{Price}"/&gt;
                    &lt;/cells&gt;
                &lt;/ColumnListItem&gt;
            &lt;/items&gt;
        &lt;/Table&gt;
    &lt;/Page&gt;
&lt;/mvc:View&gt;</pre>

<h2>まとめ</h2>
<table>
<tr><th>観点</th><th>SAP Fiori</th><th>SAPUI5</th></tr>
<tr><td>カテゴリ</td><td>UXデザイン戦略</td><td>開発フレームワーク</td></tr>
<tr><td>役割</td><td>「何を作るか」を定義</td><td>「どう作るか」を提供</td></tr>
<tr><td>ユーザー</td><td>エンドユーザー向け</td><td>開発者向け</td></tr>
<tr><td>学習対象</td><td>コンサルタント・企画職</td><td>プログラマー・開発者</td></tr>
</table>
<p>SAP FioriとSAPUI5は「車とエンジン」のような関係です。Fioriというコンセプトを、SAPUI5という技術で実現する——この関係を押さえておけば、もう迷うことはありません。</p>'],
];

$created_notes = 0;
$skipped_notes = 0;
foreach ($note_data as $n) {
    $slug = sanitize_title($n['title']);
    $exists = get_posts([
        'post_type' => 'note',
        'name' => $slug,
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
    ]);
    if (!empty($exists)) {
        echo "  スキップ（既存）: {$n['title']}\n";
        $skipped_notes++;
        continue;
    }
    $pid = wp_insert_post([
        'post_type' => 'note',
        'post_title' => $n['title'],
        'post_content' => $n['content'],
        'post_excerpt' => $n['excerpt'],
        'post_name' => $slug,
        'post_status' => 'publish',
        'post_author' => 1,
    ]);
    if (is_wp_error($pid)) {
        echo "  エラー: {$n['title']}\n";
        continue;
    }
    if (!empty($n['module'])) wp_set_object_terms($pid, $n['module'], 'sap_module');
    if (!empty($n['difficulty'])) wp_set_object_terms($pid, $n['difficulty'], 'difficulty');
    echo "  ✓ 作成: {$n['title']} (ID: {$pid})\n";
    $created_notes++;
}

// 結果表示
echo "\n=== 完了 ===\n";
echo "コース: {$created_courses} 件作成";
if ($skipped_courses > 0) echo ", {$skipped_courses} 件スキップ";
echo "\n";
echo "ナレッジ: {$created_knowledge} 件作成";
if ($skipped_knowledge > 0) echo ", {$skipped_knowledge} 件スキップ";
echo "\n";
echo "レッスン: {$i} 件作成\n";
echo "クイズ: {$qi} 件作成\n";
echo "ナレッジ参照: {$ref_count} 件設定\n";
echo "记事: {$created_notes} 件作成";
if ($skipped_notes > 0) echo ", {$skipped_notes} 件スキップ";
echo "\n";
echo "\n";
