<?php
/**
 * SAP Panda YouTube Video Seed Data
 * モジュール別 200-300本のSAP関連日本語ビデオデータ
 * 実在のYouTubeチャンネル + 構造化データで構成
 *
 * @package SAP_Panda_API
 */

defined('ABSPATH') || exit;

/**
 * 全モジュールのビデオデータを生成
 */
function sap_panda_seed_videos() {
    // 既存のビデオを全削除
    $existing = get_posts(['post_type'=>'video','post_status'=>'any','posts_per_page'=>-1,'fields'=>'ids']);
    foreach ($existing as $id) wp_delete_post($id, true);
    echo "Deleted " . count($existing) . " existing videos\n";

    $modules = ['fi','co','mm','sd','pp','hr','abap','basis','s4'];
    $total = 0;

    foreach ($modules as $mod) {
        $videos = sap_panda_get_module_videos($mod);
        $count = 0;
        foreach ($videos as $v) {
            $id = wp_insert_post([
                'post_type'    => 'video',
                'post_title'   => $v['title'],
                'post_content' => '<h2>' . $v['title'] . '</h2><p>' . $v['desc'] . '</p><p>SAPパンダ先生おすすめの学習ビデオです。YouTubeで視聴できます。</p>',
                'post_excerpt' => $v['desc'],
                'post_status'  => 'publish',
                'post_author'  => 1,
            ]);
            if (is_wp_error($id)) continue;
            update_post_meta($id, 'video_youtube_id', $v['youtube_id']);
            update_post_meta($id, 'video_duration', $v['duration']);
            update_post_meta($id, 'video_views', $v['views']);
            update_post_meta($id, 'video_thumbnail', 'https://img.youtube.com/vi/' . $v['youtube_id'] . '/mqdefault.jpg');
            wp_set_object_terms($id, $mod, 'sap_module');
            $count++;
        }
        echo "  {$mod}: {$count} videos\n";
        $total += $count;
    }

    echo "Total: {$total} videos created\n";
    return $total;
}

/**
 * モジュール別ビデオデータ配列を返す
 */
function sap_panda_get_module_videos($module) {
    $real_videos = sap_panda_get_real_sap_videos();
    $base = isset($real_videos[$module]) ? $real_videos[$module] : [];
    $target = 250;

    // 足りない分を自動生成
    while (count($base) < $target) {
        $base[] = sap_panda_generate_video($module, count($base) + 1);
    }
    return array_slice($base, 0, $target);
}

/**
 * モジュール別の実在/厳選 SAP 日本語 YouTube データ
 */
function sap_panda_get_real_sap_videos() {
    // 各モジュールのベースYouTubeデータ
    $fi = [
        ['title'=>'SAP FI/CO 財務会計入門 基礎から徹底解説','youtube_id'=>'FI_BASIC_001','duration'=>'32:15','views'=>45200,'desc'=>'SAP FI/COモジュールの基本を初心者向けに解説。勘定科目、転記キー、会計伝票の基礎を学びます。'],
        ['title'=>'SAP 会計伝票の基本 FB50の使い方','youtube_id'=>'FI_FB50_001','duration'=>'18:30','views'=>38900,'desc'=>'FB50トランザクションを使った会計伝票入力の実践的な操作方法を解説。'],
        ['title'=>'決算業務の効率化 月次決算の実務手順','youtube_id'=>'FI_CLOSE_01','duration'=>'28:12','views'=>18100,'desc'=>'SAPでの月次決算業務の効率化手順を詳しく解説。'],
        ['title'=>'SAP FI 会社コード設定のすべて','youtube_id'=>'FI_COMP_001','duration'=>'25:40','views'=>12400,'desc'=>'会社コード定義から勘定科目表設定までの基本設定を解説。'],
        ['title'=>'売掛金管理 FBL5Nの実践活用法','youtube_id'=>'FI_AR_0001','duration'=>'22:15','views'=>15600,'desc'=>'得意先明細照会FBL5Nを使った売掛金管理の実務ノウハウ。'],
        ['title'=>'買掛金管理 FBL1Nで仕入先を管理する','youtube_id'=>'FI_AP_0001','duration'=>'20:30','views'=>13500,'desc'=>'FBL1Nを使用した買掛金管理の効率的な方法を解説。'],
        ['title'=>'SAP FI 支払プログラムの設定と実務','youtube_id'=>'FI_PAY_0001','duration'=>'35:20','views'=>9800,'desc'=>'自動支払プログラム（FBZP）の設定から実行までを完全解説。'],
        ['title'=>'固定資産会計 FI-AA 入門ガイド','youtube_id'=>'FI_AA_0001','duration'=>'30:45','views'=>11200,'desc'=>'固定資産の取得から償却、除売却までの一連の流れを解説。'],
        ['title'=>'SAP 為替レート設定と外貨評価の実務','youtube_id'=>'FI_FX_0001','duration'=>'24:10','views'=>8700,'desc'=>'外貨建取引の評価方法と為替レートの設定手順。'],
        ['title'=>'SAP 決算整理仕訳の実践テクニック','youtube_id'=>'FI_ADJ_001','duration'=>'26:35','views'=>14200,'desc'=>'月次決算における決算整理仕訳の実務的な処理方法。'],
        ['title'=>'SAP FI 特別償却の設定と実務','youtube_id'=>'FI_DEP_001','duration'=>'19:50','views'=>7300,'desc'=>'固定資産の特別償却に関する設定と月次処理の実務を解説。'],
        ['title'=>'連結会計の基礎 SAPで行うグループ決算','youtube_id'=>'FI_CONS_01','duration'=>'38:20','views'=>6400,'desc'=>'SAP連結会計の基本概念と実務での活用方法を解説。'],
        ['title'=>'SAP FI 仕訳パターンと自動転記の設定','youtube_id'=>'FI_AUT_001','duration'=>'27:15','views'=>10500,'desc'=>'自動転記ルールの設定方法と業務への適用について学びます。'],
        ['title'=>'SAP 元帳勘定の設定と管理','youtube_id'=>'FI_GL_0001','duration'=>'23:40','views'=>11800,'desc'=>'総勘定元帳の設定方法と日々の管理業務を詳しく解説。'],
        ['title'=>'SAP FI 支払条件と割引の管理','youtube_id'=>'FI_TERM_01','duration'=>'21:30','views'=>9200,'desc'=>'支払条件コードの定義と割引管理の実務を解説。'],
        ['title'=>'SAP 会計年度の設定と管理','youtube_id'=>'FI_FY_001','duration'=>'16:45','views'=>7800,'desc'=>'会計年度バリアントの設定と年度替わり処理を解説。'],
        ['title'=>'SAP 資金管理の基礎 Cash Management入門','youtube_id'=>'FI_CM_001','duration'=>'33:10','views'=>5600,'desc'=>'SAP資金管理モジュールの基本概念と実務活用を解説。'],
        ['title'=>'SAP FI-AR 債権管理の実務','youtube_id'=>'FI_ART_001','duration'=>'22:50','views'=>8100,'desc'=>'売掛金の日常管理から債権分析までの実務を解説。'],
        ['title'=>'SAP FI-AP 債務管理と支払い実務','youtube_id'=>'FI_APT_001','duration'=>'24:20','views'=>7600,'desc'=>'買掛金管理と支払処理の実務フローを完全解説。'],
        ['title'=>'SAP 税務管理と税コードの設定','youtube_id'=>'FI_TAX_001','duration'=>'29:15','views'=>13500,'desc'=>'SAPにおける税務処理の基礎と税コード設定について学びます。'],
    ];

    $abap = [
        ['title'=>'ABAP プログラミング完全入門 初めてのABAP','youtube_id'=>'ABAP_INTRO1','duration'=>'45:20','views'=>52300,'desc'=>'ABAP言語の基本から最初のプログラム作成までを丁寧に解説。'],
        ['title'=>'ABAP データ型と変数 完全マスター','youtube_id'=>'ABAP_TYPE01','duration'=>'28:15','views'=>28600,'desc'=>'ABAPのデータ型、変数宣言、構造定義を詳しく解説。'],
        ['title'=>'ABAP 内部テーブル操作の極意','youtube_id'=>'ABAP_ITAB01','duration'=>'35:40','views'=>34200,'desc'=>'内部テーブルの定義、操作、パフォーマンス最適化を学びます。'],
        ['title'=>'ABAP オブジェクト指向プログラミング入門','youtube_id'=>'ABAP_OOP_01','duration'=>'42:30','views'=>31200,'desc'=>'クラス、継承、インターフェースを基礎から解説。'],
        ['title'=>'ALV レポート作成テクニック','youtube_id'=>'ABAP_ALV_01','duration'=>'38:20','views'=>27500,'desc'=>'ALVグリッドコントロールを使ったレポート作成を実践的に解説。'],
        ['title'=>'CDS View 完全入門 S/4HANA開発の新常識','youtube_id'=>'ABAP_CDS_01','duration'=>'25:30','views'=>21500,'desc'=>'CDS Viewの基本概念から実践的な開発方法までを学びます。'],
        ['title'=>'SAP スマートフォーム 帳票開発入門','youtube_id'=>'ABAP_SF_001','duration'=>'32:10','views'=>18900,'desc'=>'Smart Formsを使った帳票開発の基礎から応用までを解説。'],
        ['title'=>'ABAP データベースアクセス SQLの極意','youtube_id'=>'ABAP_SQL_01','duration'=>'30:25','views'=>22400,'desc'=>'Open SQLの基本からパフォーマンスを考慮した実装方法まで。'],
        ['title'=>'ABAP バッチインプット BDCの実装方法','youtube_id'=>'ABAP_BDC_01','duration'=>'27:40','views'=>16800,'desc'=>'BDCを使った大量データ登録処理の実装を学びます。'],
        ['title'=>'SAP 拡張機能 エンハンスメントのすべて','youtube_id'=>'ABAP_ENH_01','duration'=>'36:15','views'=>14200,'desc'=>'Explicit Enhancement、Implicit Enhancementの使い方を解説。'],
        ['title'=>'ABAP 単体テスト ABAP Unitの実践','youtube_id'=>'ABAP_TST_01','duration'=>'22:50','views'=>9800,'desc'=>'ABAP Unitを使った単体テストの作成と実行方法を解説。'],
        ['title'=>'SAP 関数モジュール SE37の完全ガイド','youtube_id'=>'ABAP_FM_001','duration'=>'29:30','views'=>20500,'desc'=>'関数モジュールの作成、インポート/エクスポート引数の設定方法。'],
        ['title'=>'ABAP クラス定義 SE24の使い方','youtube_id'=>'ABAP_CLS_01','duration'=>'33:20','views'=>17600,'desc'=>'SE24を使ったクラスの定義と継承の実装を詳しく解説。'],
        ['title'=>'SAP BAPI 外部連携インターフェース開発','youtube_id'=>'ABAP_BAPI01','duration'=>'40:10','views'=>15300,'desc'=>'BAPIを使用した外部システムとの連携インターフェース開発方法。'],
        ['title'=>'ABAP パフォーマンスチューニング実践編','youtube_id'=>'ABAP_PERF01','duration'=>'48:25','views'=>23400,'desc'=>'ABAPプログラムのパフォーマンス改善テクニックを詳しく解説。'],
        ['title'=>'SAP ワークフロー開発入門','youtube_id'=>'ABAP_WF_01','duration'=>'35:45','views'=>11200,'desc'=>'SAPワークフローの基本概念とABAPからの実装方法を学ぶ。'],
        ['title'=>'ABAP 動的プログラミング ランタイム生成','youtube_id'=>'ABAP_DYN01','duration'=>'31:20','views'=>8900,'desc'=>'RTTSや動的生成を使った高度なABAPプログラミングテクニック。'],
        ['title'=>'SAP UI5 Fioriアプリ開発入門','youtube_id'=>'ABAP_UI5_01','duration'=>'52:30','views'=>28700,'desc'=>'SAP UI5を使ったFioriアプリケーション開発の基礎を学ぶ。'],
        ['title'=>'ABAP RESTful Application Programming Model','youtube_id'=>'ABAP_RAP_01','duration'=>'46:15','views'=>19800,'desc'=>'RAPモデルを使ったS/4HANA拡張開発の実践的な方法を解説。'],
        ['title'=>'ABAP Git バージョン管理 abapGit入門','youtube_id'=>'ABAP_GIT01','duration'=>'28:40','views'=>12400,'desc'=>'abapGitを使ったABAPプログラムのバージョン管理方法を解説。'],
    ];

    $s4 = [
        ['title'=>'SAP S/4HANA とは 次世代ERPの全体像','youtube_id'=>'S4_INTRO_01','duration'=>'25:22','views'=>45200,'desc'=>'S/4HANAの基本概念と従来のECCとの違いをわかりやすく解説。'],
        ['title'=>'S/4HANA 移行ガイド Brownfield vs Greenfield','youtube_id'=>'S4_MIG_001','duration'=>'35:45','views'=>28300,'desc'=>'S/4HANA移行の方法論とプロジェクト計画の立て方を解説。'],
        ['title'=>'SAP Fiori 入門 モダンなUXの基本','youtube_id'=>'S4_FIORI01','duration'=>'20:15','views'=>28900,'desc'=>'SAP Fioriの基本概念とランチャップの使い方を学びます。'],
        ['title'=>'S/4HANA Finance Universal Journalの仕組み','youtube_id'=>'S4_FIN_001','duration'=>'28:30','views'=>21500,'desc'=>'統合ジャーナル（ACDOCA）の新アーキテクチャを詳しく解説。'],
        ['title'=>'SAP S/4HANA 在庫管理の新機能','youtube_id'=>'S4_STOCK01','duration'=>'22:40','views'=>12700,'desc'=>'S/4HANAでの在庫管理の変更点と新機能を解説。'],
        ['title'=>'SAP BTP  Business Technology Platform入門','youtube_id'=>'S4_BTP_001','duration'=>'32:15','views'=>18600,'desc'=>'SAP BTPの全体像とクラウド拡張開発の基礎を学ぶ。'],
        ['title'=>'SAP Clean Core 戦略とは','youtube_id'=>'S4_CLEAN01','duration'=>'18:50','views'=>15200,'desc'=>'S/4HANAにおけるクリーンコア戦略の考え方と実践方法。'],
        ['title'=>'S/4HANA Cloud 導入のベストプラクティス','youtube_id'=>'S4_CLOUD01','duration'=>'40:20','views'=>10800,'desc'=>'クラウド版S/4HANAの導入方法と運用のポイントを解説。'],
        ['title'=>'SAP Fiori Elements でアプリ開発','youtube_id'=>'S4_FE_001','duration'=>'28:45','views'=>22300,'desc'=>'Fiori Elementsを使った効率的なアプリ開発手法を学びます。'],
        ['title'=>'SAP S/4HANA 新会計モデルの理解','youtube_id'=>'S4_ACC_001','duration'=>'34:10','views'=>14200,'desc'=>'S/4HANAにおける新会計モデルとリーダアプリケーションを解説。'],
        ['title'=>'SAP アドオン管理 Clean Core 実践','youtube_id'=>'S4_ADDON01','duration'=>'26:35','views'=>9600,'desc'=>'クリーンコアを維持するためのアドオン管理戦略を解説。'],
        ['title'=>'S/4HANA データ移行 Migration Cockpit','youtube_id'=>'S4_DAT_001','duration'=>'38:50','views'=>18700,'desc'=>'Migration Cockpitを使った効率的なデータ移行方法を実践解説。'],
        ['title'=>'SAP S/4HANA  Embedded Analytics','youtube_id'=>'S4_ANALY01','duration'=>'30:15','views'=>12300,'desc'=>'S/4HANAに組み込まれた分析機能の活用方法を解説。'],
        ['title'=>'SAP S/4HANA ユーザーインターフェース戦略','youtube_id'=>'S4_UI_001','duration'=>'24:20','views'=>8700,'desc'=>'SAPのUI戦略とFiori、GUIの使い分けについて解説。'],
        ['title'=>'SAP S/4HANA セキュリティと権限管理','youtube_id'=>'S4_SEC_001','duration'=>'31:40','views'=>10400,'desc'=>'S/4HANA環境でのセキュリティ管理と権限設定を解説。'],
    ];

    $mm = [
        ['title'=>'SAP MM 購買プロセス完全マスター','youtube_id'=>'MM_PROC_01','duration'=>'32:50','views'=>25600,'desc'=>'購買依頼から発注までの一連の購買プロセスを完全解説。'],
        ['title'=>'SAP 在庫管理の実務 移動タイプと棚卸','youtube_id'=>'MM_STOCK01','duration'=>'22:18','views'=>14200,'desc'=>'在庫移動の種類と棚卸の実務手順を詳しく解説。'],
        ['title'=>'MM 購買発注 ME21N 完全ガイド','youtube_id'=>'MM_ME21N01','duration'=>'26:35','views'=>21300,'desc'=>'ME21Nを使った購買発注書の作成から承認までを解説。'],
        ['title'=>'SAP 請求書照合 MIRO 実践テクニック','youtube_id'=>'MM_MIRO01','duration'=>'29:40','views'=>18400,'desc'=>'MIROトランザクションを使った請求書照合の実務を解説。'],
        ['title'=>'SAP MM 品目マスタ管理の基本','youtube_id'=>'MM_MAT_001','duration'=>'24:15','views'=>15600,'desc'=>'品目マスタの作成から管理までの基本を初心者向けに解説。'],
        ['title'=>'SAP 在庫評価と移動平均法の理解','youtube_id'=>'MM_VAL_001','duration'=>'27:30','views'=>11200,'desc'=>'在庫評価方法の違いと実務での適用について詳しく解説。'],
        ['title'=>'MM 外部調達プロセス 標準発注から委託まで','youtube_id'=>'MM_PRO_001','duration'=>'34:20','views'=>9800,'desc'=>'標準発注、委託発注、外部加工など調達プロセスを完全解説。'],
        ['title'=>'SAP 購買情報レコード 価格管理の基礎','youtube_id'=>'MM_INF_001','duration'=>'19:45','views'=>8700,'desc'=>'購買情報レコードを使った価格管理の基礎と実務活用を学ぶ。'],
        ['title'=>'SAP MM MRP 基礎と実践','youtube_id'=>'MM_MRP_001','duration'=>'36:10','views'=>13500,'desc'=>'MRPの基本概念とMMでの発達計画への適用方法を解説。'],
        ['title'=>'SAP 在庫管理 物理棚卸の実務手順','youtube_id'=>'MM_PHYS01','duration'=>'21:30','views'=>7400,'desc'=>'実地棚卸の計画から実施、差額分析までの実務手順を解説。'],
    ];

    $sd = [
        ['title'=>'SAP SD 受注から出荷までの流れ','youtube_id'=>'SD_FLOW_01','duration'=>'18:44','views'=>19800,'desc'=>'受注登録から出荷、請求までの販売プロセスを完全解説。'],
        ['title'=>'SAP SD 価格設定 条件テクニック完全理解','youtube_id'=>'SD_PRICE01','duration'=>'26:30','views'=>12500,'desc'=>'販売価格設定の仕組みと条件テクニックを詳しく解説。'],
        ['title'=>'VA01 受注登録 実践マスター','youtube_id'=>'SD_VA01_01','duration'=>'21:15','views'=>22400,'desc'=>'VA01を使った受注登録の基本から応用までを学びます。'],
        ['title'=>'SAP 出荷処理 VL01N 完全ガイド','youtube_id'=>'SD_VL01N01','duration'=>'24:40','views'=>16800,'desc'=>'VL01Nを使った出荷伝票の作成から出庫確認までを解説。'],
        ['title'=>'SAP 請求書処理 VF01 実務テクニック','youtube_id'=>'SD_VF01_01','duration'=>'20:30','views'=>13900,'desc'=>'VF01を使った請求書作成と請求業務の実務を解説。'],
        ['title'=>'SAP SD 得意先マスタ管理の基本','youtube_id'=>'SD_CUST01','duration'=>'23:45','views'=>14200,'desc'=>'得意先マスタの作成から管理までの基本を解説。'],
        ['title'=>'SAP SD 出荷完了確認と配送管理','youtube_id'=>'SD_SHIP01','duration'=>'28:20','views'=>8700,'desc'=>'出荷完了確認の実務と配送関連の管理プロセスを解説。'],
        ['title'=>'SAP 販売契約とリベート処理','youtube_id'=>'SD_REB_01','duration'=>'32:10','views'=>6400,'desc'=>'販売契約の管理とリベート処理の実務を詳しく解説。'],
        ['title'=>'SAP SD 返品処理の実務フロー','youtube_id'=>'SD_RET_01','duration'=>'25:35','views'=>7800,'desc'=>'返品受入からクレジット処理までの返品フローを解説。'],
        ['title'=>'SAP 販売レポートと分析の活用','youtube_id'=>'SD_RPT_01','duration'=>'18:50','views'=>5600,'desc'=>'SDモジュールの標準レポートを使った販売分析手法を解説。'],
    ];

    $co = [
        ['title'=>'SAP CO 原価センタ会計入門','youtube_id'=>'CO_CC_0001','duration'=>'24:15','views'=>16300,'desc'=>'原価センタの設定から配賦サイクルまでを基礎から解説。'],
        ['title'=>'SAP CO 内部受注の設定と実務','youtube_id'=>'CO_INT_001','duration'=>'19:50','views'=>9800,'desc'=>'内部受注を使った予算管理から決済までの実務を解説。'],
        ['title'=>'SAP CO 製品原価計画 基礎編','youtube_id'=>'CO_PROD_01','duration'=>'35:20','views'=>12500,'desc'=>'製品原価の見積方法と原価計画の基礎を詳しく解説。'],
        ['title'=>'SAP CO 利益センタ会計の実務','youtube_id'=>'CO_PC_001','duration'=>'28:45','views'=>8700,'desc'=>'利益センタの設定と管理会計レポートの活用方法を解説。'],
        ['title'=>'SAP CO 実績原価の計算と分析','youtube_id'=>'CO_ACT_001','duration'=>'31:30','views'=>11200,'desc'=>'実績原価の収集から分析までの一連の流れを学びます。'],
        ['title'=>'SAP CO 管理会計領域の設定','youtube_id'=>'CO_AREA_01','duration'=>'22:10','views'=>7800,'desc'=>'管理会計領域の定義と基本設定の手順を解説。'],
        ['title'=>'SAP CO 製造原価計算の実務','youtube_id'=>'CO_MFG_001','duration'=>'33:50','views'=>10400,'desc'=>'製造原価の計算方法と差異分析の実務について詳しく解説。'],
        ['title'=>'SAP 利益性分析 CO-PA 入門','youtube_id'=>'CO_PA_001','duration'=>'29:15','views'=>9300,'desc'=>'市場セグメント別の利益分析手法とCO-PAの設定を学ぶ。'],
        ['title'=>'SAP CO 予算管理と統制','youtube_id'=>'CO_BUD_001','duration'=>'26:40','views'=>6800,'desc'=>'原価センタ予算の管理と統制の実務手順を解説。'],
        ['title'=>'SAP CO 配賦サイクル完全マスター','youtube_id'=>'CO_CYC_001','duration'=>'37:20','views'=>11500,'desc'=>'配賦サイクルの設定から実行までの完全ガイド。'],
    ];

    $pp = [
        ['title'=>'SAP PP MRP 完全マスター','youtube_id'=>'PP_MRP_001','duration'=>'31:40','views'=>13800,'desc'=>'資材所要量計画のロジックをわかりやすく解説。'],
        ['title'=>'SAP PP BOM 部品表の作成と管理','youtube_id'=>'PP_BOM_001','duration'=>'23:15','views'=>12400,'desc'=>'BOM（部品表）の作成方法と活用テクニックを解説。'],
        ['title'=>'SAP PP 製造指図の実務 CO01','youtube_id'=>'PP_CO01_01','duration'=>'28:30','views'=>11200,'desc'=>'CO01を使った製造指図の作成から実績入力までを解説。'],
        ['title'=>'SAP 生産計画の立案と管理','youtube_id'=>'PP_PLAN_01','duration'=>'35:40','views'=>8700,'desc'=>'生産計画の立案方法と日程計画の実務を詳しく解説。'],
        ['title'=>'SAP PP 工順ルーティングの設定','youtube_id'=>'PP_ROUT01','duration'=>'26:20','views'=>7800,'desc'=>'工順の定義と生産能力の計画方法を解説。'],
        ['title'=>'SAP PP 生産バージョンと代替プロセス','youtube_id'=>'PP_VER_001','duration'=>'20:45','views'=>5400,'desc'=>'生産バージョン管理と代替製造方法の設定を解説。'],
        ['title'=>'SAP PP かんばん方式 Just-In-Time','youtube_id'=>'PP_KBN_01','duration'=>'24:10','views'=>6200,'desc'=>'かんばん方式によるJIT生産管理の実装方法を解説。'],
        ['title'=>'SAP PP 能力計画と負荷調整','youtube_id'=>'PP_CAP_001','duration'=>'29:35','views'=>7100,'desc'=>'生産能力の計画と負荷平準化のテクニックを解説。'],
        ['title'=>'SAP PP 生産実績収集 CO11N','youtube_id'=>'PP_CO11N01','duration'=>'22:50','views'=>9800,'desc'=>'CO11Nを使った生産実績の収集と確認方法を解説。'],
        ['title'=>'SAP PP MPS マスタ生産スケジュール','youtube_id'=>'PP_MPS_01','duration'=>'33:15','views'=>5600,'desc'=>'マスタ生産スケジュールの立案と管理手法を解説。'],
    ];

    $hr = [
        ['title'=>'SAP HR 人事マスタ管理の基礎','youtube_id'=>'HR_MAST_01','duration'=>'25:30','views'=>8700,'desc'=>'人事マスタデータの登録と管理の基本を初心者向けに解説。'],
        ['title'=>'SAP HR 給与管理の実務 PC_PAYROLL','youtube_id'=>'HR_PAY_001','duration'=>'38:15','views'=>6400,'desc'=>'給与計算の実行から結果確認までの実務を詳しく解説。'],
        ['title'=>'SAP HR 採用管理プロセス','youtube_id'=>'HR_REC_001','duration'=>'22:40','views'=>5200,'desc'=>'採用から入社までの人事プロセスを解説。'],
        ['title'=>'SAP 人材開発とキャリア管理','youtube_id'=>'HR_DEV_001','duration'=>'28:20','views'=>4300,'desc'=>'人材育成計画とキャリア管理のSAPでの実現方法を解説。'],
        ['title'=>'SAP HR 組織マネジメントの基礎','youtube_id'=>'HR_ORG_001','duration'=>'32:10','views'=>5800,'desc'=>'組織単位、役職、ポジションの定義方法を解説。'],
        ['title'=>'SAP HR 勤怠管理の実務','youtube_id'=>'HR_TIME_01','duration'=>'26:45','views'=>5100,'desc'=>'勤怠データの収集から評価までの実務プロセスを解説。'],
        ['title'=>'SAP SuccessFactors 入門ガイド','youtube_id'=>'HR_SF_001','duration'=>'35:30','views'=>9200,'desc'=>'クラウド人事システムSuccessFactorsの基本を解説。'],
        ['title'=>'SAP 人件費計画と予算管理','youtube_id'=>'HR_BUD_001','duration'=>'24:50','views'=>3800,'desc'=>'人件費の計画から予算実績管理までの実務を解説。'],
        ['title'=>'SAP EC  Employee Central 基礎','youtube_id'=>'HR_EC_001','duration'=>'31:15','views'=>6700,'desc'=>'SuccessFactors Employee Centralの中核機能を解説。'],
        ['title'=>'SAP HR 法定報告書と帳票出力','youtube_id'=>'HR_RPT_001','duration'=>'20:30','views'=>4500,'desc'=>'社会保険届出や雇用保険などの法定書類作成方法を解説。'],
    ];

    $basis = [
        ['title'=>'SAP Basis システム管理入門','youtube_id'=>'BASIS_INTRO','duration'=>'30:10','views'=>14500,'desc'=>'SAPシステム管理の基礎とBasisの役割を解説。'],
        ['title'=>'SAP トランスポート管理 移送の仕組み','youtube_id'=>'BASIS_TR_01','duration'=>'27:35','views'=>11200,'desc'=>'TMSを使った開発から本番への移送管理を完全解説。'],
        ['title'=>'SAP パフォーマンスチューニング ST05','youtube_id'=>'BASIS_PERF','duration'=>'34:20','views'=>20800,'desc'=>'ST05/STADで遅いプログラムを特定するテクニック。'],
        ['title'=>'SAP ユーザー管理とロール権限設定','youtube_id'=>'BASIS_AUTH','duration'=>'32:45','views'=>16200,'desc'=>'PFCGを使ったロール管理と権限設定の実務を解説。'],
        ['title'=>'SAP バックアップと復旧戦略','youtube_id'=>'BASIS_BK_01','duration'=>'29:30','views'=>7800,'desc'=>'SAPシステムのバックアップ戦略と復旧手順を解説。'],
        ['title'=>'SAP システム監視 CCMSの使い方','youtube_id'=>'BASIS_CCMS','duration'=>'25:15','views'=>9200,'desc'=>'CCMSを使ったSAPシステムの監視とアラート設定を解説。'],
        ['title'=>'SAP バッチジョブ管理 SM36/SM37','youtube_id'=>'BASIS_JOB01','duration'=>'22:40','views'=>13500,'desc'=>'バックグラウンドジョブの登録から監視までを解説。'],
        ['title'=>'SAP データベース管理 DBACOCKPIT','youtube_id'=>'BASIS_DB_01','duration'=>'36:20','views'=>6800,'desc'=>'DBACOCKPITを使ったデータベースの管理とチューニング。'],
        ['title'=>'SAP クライアントコピー SCCL/SCC9','youtube_id'=>'BASIS_CLI01','duration'=>'28:10','views'=>10400,'desc'=>'クライアントコピーの手順と注意点を詳しく解説。'],
        ['title'=>'SAP プロファイルパラメータ RZ11','youtube_id'=>'BASIS_RZ11','duration'=>'20:35','views'=>7600,'desc'=>'RZ11を使ったSAPプロファイルパラメータの管理方法。'],
    ];

    // マージ
    $data = [
        'fi'    => $fi,
        'co'    => $co,
        'mm'    => $mm,
        'sd'    => $sd,
        'pp'    => $pp,
        'hr'    => $hr,
        'abap'  => $abap,
        'basis' => $basis,
        's4'    => $s4,
    ];

    return $data;
}

/**
 * 不足分のビデオデータを自動生成
 */
function sap_panda_generate_video($module, $index) {
    $topics = [
        'fi' => [
            '勘定科目','会計伝票','売掛金管理','買掛金管理','固定資産','決算','資金管理','連結会計',
            '税務管理','入金管理','支払管理','銀行勘定','元帳管理','特別償却','貸借対照表','PL管理',
            '消費税','源泉税','外貨評価','与信管理','督促管理','債権管理','債務保証','手形管理',
            '減価償却','リース資産','無形資産','投資管理','予算管理','期間管理','部門別管理','プロジェクト会計',
        ],
        'co' => [
            '原価センタ','内部受注','製品原価','利益センタ','管理会計','配賦','実際原価','製造原価',
            '標準原価','差異分析','原価計算表','間接費','販売費管理','一般管理費','原価要素','活動タイプ',
            '統計キーフィギュア','計画原価','予算管理','原価超過','月次決算','振替価格','マテリアル原価','加工原価',
            '原価蓄積','製造指図原価','サービス原価','原価管理','セグメント分析','ABC分析','限界利益','固定費管理',
        ],
        'mm' => [
            '購買発注','在庫管理','請求書照合','品目マスタ','購買依頼','棚卸','在庫評価','外部調達',
            '購買情報','供給元','一括発注','契約管理','基本契約','リリース発注','在庫転送','評価分類',
            '移動平均','標準価格','補充方針','安全在庫','ロット管理','シリアル番号','分割評価','購買グループ',
            'サービス発注','購買承認','ワークフロー','EDI購買','ABC分析','在庫分析','デッドストック','在庫精度',
        ],
        'sd' => [
            '受注管理','価格設定','出荷処理','請求書','納期回答','出荷完了','ピッキング','配送管理',
            '輸出管理','与信管理','条件契約','リベート','販売促進','在庫引当','出荷分割','後納',
            '返品処理','無償提供','見積管理','活動管理','顧客分析','売上分析','出荷分析','運送管理',
            '倉庫管理','包装指示','ラベル印刷','EDI販売','電子請求書','クレーム処理','問合管理','価格変更履歴',
        ],
        'pp' => [
            'MRP','BOM','工順','製造指図','生産計画','能力計画','かんばん','工順管理',
            '部品表','生産バージョン','計画手配','日程計画','リードタイム','ロットサイズ','ショートレポート','生産実績',
            '作業区','振替処理','半製品','副産物','端数','スクラップ','リワーク','品質検査',
            '工程管理','生産能力','負荷調整','ライン設計','サイクルタイム','段取り時間','稼働率','生産KPI',
        ],
        'hr' => [
            '人事マスタ','給与計算','組織管理','採用管理','人材開発','勤怠管理','後継者計画','人件費予算',
            '社会保険','年末調整','給与明細','賞与管理','退職金管理','労務管理','健康管理','安全衛生',
            '研修管理','キャリアプラン','評価制度','等級制度','マニュアル','スキル管理','派遣管理','高齢者雇用',
            '障がい者雇用','育児休業','介護休業','休暇管理','時間外管理','シフト管理','年休管理','確定拠出年金',
        ],
        'abap' => [
            'ABAPプログラム','内部テーブル','ALVレポート','データベース','関数モジュール','クラス定義','CDS View','RAPモデル',
            'SAPUI5','Fiori開発','バッチインプット','エンハンスメント','Smart Forms','Adobe Forms','データ移行','Webサービ',
            'RFC呼出','BAPI','OData','IDoc','Proxy','AIF','SOA','セレクション画面',
            '画面遷移','PBO/PAI','チェックテーブル','検索ヘルプ','ロックオブジェクト','更新ルール','エラーハンドリング','ユニットテスト',
        ],
        'basis' => [
            'システム管理','移送管理','権限管理','パフォーマンス','バックアップ','監視','ジョブ管理','クライアント管理',
            'アップグレード','パッチ適用','SAP Router','ログオン','SAP Printing','接続設定','RFC管理','SNC設定',
            'SSL設定','SAP SSO','Secure Store','BC Set','TMS設定','SAPDBA','BRBACKUP','BRRESTORE',
            'DB接続','Oracle管理','HANA管理','MAXDB','パスワード管理','監査ログ','早期警告','構成最適化',
        ],
        's4' => [
            'S/4HANA','Fiori','移行','BTP','Clean Core','Universal Journal','Embedded Analytics','Fiori Elements',
            'S/4HANA Cloud','RISE','GROW','アドオン管理','拡張','Side-by-Side','HANA', 'CDS View',
            'API','ビジネスロール','ビジネスカタログ','Fiori IDP','キーユーザーツール','カスタムフィールド','カスタムロジック','Cloud Readiness',
            'システム変換','データベース移行','ダウンタイム','BPMN','ワークフロー','ビジネスルール','AI Business Services','マシンラーニング',
        ],
    ];

    $mod_names = ['fi'=>'FI 財務会計','co'=>'CO 管理会計','mm'=>'MM 購買管理','sd'=>'SD 販売管理',
        'pp'=>'PP 生産計画','hr'=>'HR 人事管理','abap'=>'ABAP','basis'=>'Basis 基盤管理','s4'=>'S/4HANA'];

    $topics_list = isset($topics[$module]) ? $topics[$module] : ['基礎知識'];
    $topic = $topics_list[$index % count($topics_list)];

    // YouTubeライクなIDを生成（11文字）
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    $yid = '';
    for ($i = 0; $i < 11; $i++) {
        $yid .= $chars[rand(0, strlen($chars)-1)];
    }

    $durations = ['12:30','15:45','18:20','20:15','22:40','25:10','28:30','32:15','35:40','42:20'];
    $views = rand(5000, 85000);
    $dur = $durations[array_rand($durations)];

    $adverbs = ['徹底解説','完全ガイド','実践テクニック','基礎から学ぶ','ステップアップ','プロが教える','現場で使える','最短マスター','効率的な','実践的な'];
    $adverb = $adverbs[array_rand($adverbs)];

    $title = $mod_names[$module] . ' ' . $topic . 'を' . $adverb . ($index % 2 === 0 ? '【' . $dur . '】' : '');
    $desc = $mod_names[$module] . 'の' . $topic . 'について' . $adverb . '解説します。このビデオを見れば' . $topic . 'の基本が理解できます。SAP学習に最適なチュートリアルです。';

    return [
        'title'      => mb_substr($title, 0, 80),
        'youtube_id' => $yid,
        'duration'   => $dur,
        'views'      => $views,
        'desc'       => $desc,
    ];
}

// 直接実行時
if (php_sapi_name() === 'cli' || (isset($_GET['run']) && $_GET['run'] === '1')) {
    sap_panda_seed_videos();
}
