<?php
/**
 * Plugin Name: SAP Panda API
 * Description: Custom REST API, CPTs, Taxonomies, and ACF fields for SAP Panda Academy
 * Version:     1.0.0
 * Author:      Panda Team
 * Text Domain: sap-panda
 *
 * @package SAP_Panda_API
 */

defined('ABSPATH') || exit;

define('SAP_PANDA_API_VERSION', '1.0.0');
define('SAP_PANDA_API_PATH', plugin_dir_path(__FILE__));
define('SAP_PANDA_API_URL', plugin_dir_url(__FILE__));

// ACF Polyfill — provides get_field() when ACF Pro is not installed
// Options Page 対応。全プラグイン読み込み後に ACF が存在しない場合のみ定義。
add_action('init', 'sap_panda_define_acf_polyfill', 0);
function sap_panda_define_acf_polyfill() {
    if (class_exists('ACF') || function_exists('get_field')) return;

    /**
     * get_field polyfill:
     * - 'option' → sap_panda_module_data option から読み出し
     * - post_id 番号 → get_post_meta
     */
    function get_field($selector, $post_id = false, $format_value = true) {
        // Options Page
        if ('option' === $post_id || 'options' === $post_id) {
            $data = get_option('sap_panda_module_data', array());
            // group field (mod_fi → 配列)
            if (isset($data[$selector]) && is_array($data[$selector])) {
                return $data[$selector];
            }
            // 通常フィールド
            $opt = get_option('options_' . $selector, null);
            if (null !== $opt) {
                return $opt;
            }
            return null;
        }

        if (!$post_id) {
            $post_id = get_the_ID();
        }
        if (!$post_id) {
            return null;
        }

        // タクソノミーターム (term_{$term_id})
        if (is_string($post_id) && 0 === strpos($post_id, 'term_')) {
            $term_id = (int) str_replace('term_', '', $post_id);
            if (!$term_id) {
                return null;
            }
            $value = get_term_meta($term_id, $selector, true);
            if ($value !== '' && $value !== array()) {
                // checkbox で保存されたカンマ区切りはそのまま配列に（互換性）
                if (is_string($value) && false !== strpos($value, ',')) {
                    return explode(',', $value);
                }
                return $value;
            }
            return null;
        }

        $value = get_post_meta($post_id, $selector, true);
        if ($value !== '' && $value !== []) return $value;
        $flat = get_post_meta($post_id, $selector . '_flat', true);
        if (!empty($flat)) return $flat;
        $count = (int) get_post_meta($post_id, $selector, true);
        if ($count > 0) {
            $rows = [];
            for ($i = 0; $i < $count; $i++) {
                $row = [];
                foreach (['option_text', 'is_correct', 'step_title', 'step_time', 'skill', 'feature'] as $sub) {
                    $sub_key = $selector . '_' . $i . '_' . $sub;
                    $sub_val = get_post_meta($post_id, $sub_key, true);
                    if ($sub_val !== '') $row[$sub] = $sub_val;
                }
                if (!empty($row)) $rows[] = $row;
            }
            return !empty($rows) ? $rows : null;
        }
        return null;
    }

    function the_field($selector, $post_id = false) {
        echo get_field($selector, $post_id);
    }
    function has_sub_field($field_name) { return false; }
    function get_sub_field($field_name) { return null; }
    function have_rows($field_name) { return false; }
    function the_row() {}

    /**
     * update_field polyfill:
     * - 'option' → sap_panda_module_data option に保存
     * - ターム → update_term_meta
     * - それ以外 → update_post_meta
     */
    function update_field($selector, $value, $post_id = false) {
        // Options Page
        if ('option' === $post_id || 'options' === $post_id) {
            $data = get_option('sap_panda_module_data', array());
            $data[$selector] = $value;
            return update_option('sap_panda_module_data', $data);
        }

        if (!$post_id) {
            $post_id = get_the_ID();
        }
        if (!$post_id) {
            return false;
        }
        if (is_string($post_id) && 0 === strpos($post_id, 'term_')) {
            $term_id = (int) str_replace('term_', '', $post_id);
            if (!$term_id) {
                return false;
            }
            if (is_array($value)) {
                $value = implode(',', $value);
            }
            return update_term_meta($term_id, $selector, sanitize_text_field((string) $value));
        }
        return update_post_meta($post_id, $selector, $value);
    }
}

// Autoload includes
$includes = [
    'class-cpt.php',
    'class-taxonomies.php',
    'class-taxonomy-meta.php',
    'class-acf.php',
    'class-rest.php',
    'class-auth.php',
    'class-metabox.php',
    'class-admin.php',
];

// コンテンツにSVG / dialog クラスを許可（wp_kses_post で除去されないように）
add_filter('wp_kses_allowed_html', 'sap_panda_allow_content_html', 10, 2);
function sap_panda_allow_content_html($allowed, $context) {
    if ($context !== 'post') return $allowed;
    $svg_tags = ['svg','g','path','circle','ellipse','rect','text','line','polyline','polygon','defs','use','image','mask','filter','stop','animate','animateTransform'];
    $svg_attrs = ['id','class','style','width','height','viewBox','xmlns','fill','opacity','stroke','stroke-width','stroke-linecap','stroke-linejoin','transform','d','cx','cy','r','rx','ry','x','y','dx','dy','font-size','font-weight','font-family','text-anchor','href','target','xlink:href','points'];
    foreach ($svg_tags as $tag) {
        $allowed[$tag] = [];
        foreach ($svg_attrs as $a) $allowed[$tag][$a] = true;
    }
    foreach (['div','span','p','td','th','tr','table','code','pre','ul','ol','li','a','img','blockquote','h1','h2','h3','h4','h5','h6'] as $tag) {
        $allowed[$tag]['class'] = true;
        $allowed[$tag]['style'] = true;
    }
    return $allowed;
}

foreach ($includes as $file) {
    $path = SAP_PANDA_API_PATH . 'includes/' . $file;
    if (file_exists($path)) {
        require_once $path;
    }
}

// Init
add_action('init', 'sap_panda_init');
function sap_panda_init() {
    if (class_exists('SAP_Panda_CPT')) {
        (new SAP_Panda_CPT())->register();
    }
    if (class_exists('SAP_Panda_Taxonomies')) {
        (new SAP_Panda_Taxonomies())->register();
    }
    if (class_exists('SAP_Panda_Meta_Boxes')) {
        (new SAP_Panda_Meta_Boxes())->register();
    }
    if (is_admin() && class_exists('SAP_Panda_Taxonomy_Meta')) {
        (new SAP_Panda_Taxonomy_Meta())->register();
    }
}

// Init REST API
add_action('rest_api_init', 'sap_panda_rest_init');
function sap_panda_rest_init() {
    if (class_exists('SAP_Panda_REST')) {
        (new SAP_Panda_REST())->register_routes();
    }
    if (class_exists('SAP_Panda_Auth')) {
        (new SAP_Panda_Auth())->register_routes();
    }
}

// Init ACF (after ACF is loaded)
add_action('acf/init', 'sap_panda_acf_init');
function sap_panda_acf_init() {
    if (function_exists('acf_add_local_field_group') && class_exists('SAP_Panda_ACF')) {
        (new SAP_Panda_ACF())->register_fields();
        // acf_register_block_type が利用可能な場合のみブロック登録
        if (function_exists('acf_register_block_type')) {
            (new SAP_Panda_ACF())->register_blocks();
        }
    }
}

// Activation hook
register_activation_hook(__FILE__, 'sap_panda_activate');
function sap_panda_activate() {
    sap_panda_init();
    sap_panda_create_tables();
    sap_panda_seed_site_pages();
    sap_panda_seed_modules();
    sap_panda_seed_topic_articles();
    if ( function_exists( 'sap_panda_seed_videos' ) ) {
        sap_panda_seed_videos();
    }
    update_option( 'sap_panda_topic_articles_seeded', true );
    update_option( 'sap_panda_videos_seeded', true );
    delete_option( 'sap_panda_terms_seeded' );
    flush_rewrite_rules();
}

// init でモジュール Options が未設定なら自動シード
add_action( 'init', 'sap_panda_auto_seed_modules', 20 );
function sap_panda_auto_seed_modules() {
    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
        return;
    }
    $data = get_option( 'sap_panda_module_data', array() );
    if ( ! empty( $data ) ) {
        return; // すでに Options にデータあり
    }
    sap_panda_seed_modules();
}

// init で topic ターム（用語集/トレンド/転職ガイド）が不足なら追加
add_action( 'init', 'sap_panda_ensure_topic_terms', 25 );
function sap_panda_ensure_topic_terms() {
    if ( ! taxonomy_exists( 'topic' ) ) {
        return;
    }
    $required = array(
        'glossary'     => '用語集',
        'trends'       => 'SAPトレンド',
        'career-guide' => '転職ガイド',
    );
    foreach ( $required as $slug => $name ) {
        if ( ! term_exists( $slug, 'topic' ) ) {
            wp_insert_term( $name, 'topic', array( 'slug' => $slug ) );
        }
    }
}

// init でビデオデータが不足していれば自動シード
add_action( 'init', 'sap_panda_auto_seed_videos', 32 );
function sap_panda_auto_seed_videos() {
    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) return;
    $seeded = get_option( 'sap_panda_videos_seeded', false );
    if ( $seeded ) return;
    if ( function_exists( 'sap_panda_seed_videos' ) ) {
        sap_panda_seed_videos();
        update_option( 'sap_panda_videos_seeded', true );
    }
}

// init で topic 記事が不足していれば自動シード
add_action( 'init', 'sap_panda_auto_seed_topic_articles', 30 );
function sap_panda_auto_seed_topic_articles() {
    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) return;
    $seeded = get_option( 'sap_panda_topic_articles_seeded', false );
    if ( $seeded ) return;
    sap_panda_seed_topic_articles();
    update_option( 'sap_panda_topic_articles_seeded', true );
}

function sap_panda_seed_topic_articles() {
    $glossary = array(
        array( 'title' => 'SAPとは？ — 世界の企業を支えるERPの基本', 'desc' => 'SAPの基本的な概念と歴史を初心者向けに解説します。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'FIモジュール入門 — 財務会計の基礎知識', 'desc' => 'FIモジュールの役割と主要な機能について解説。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'COモジュールとは？管理会計の基礎', 'desc' => '原価管理と管理会計の基本をわかりやすく解説。', 'mod' => 'co', 'diff' => 'beginner' ),
        array( 'title' => 'MMモジュール — 購買調達プロセス完全ガイド', 'desc' => '購買リクエストから発注、入庫までの流れを解説。', 'mod' => 'mm', 'diff' => 'beginner' ),
        array( 'title' => 'SDモジュールの全体像 — 販売から出荷まで', 'desc' => '受注処理から出荷・請求までの業務プロセスを解説。', 'mod' => 'sd', 'diff' => 'beginner' ),
        array( 'title' => 'ABAPとは？SAP独自のプログラミング言語解説', 'desc' => 'ABAP言語の基礎構文と開発環境について。', 'mod' => 'abap', 'diff' => 'beginner' ),
        array( 'title' => 'Basis入門 — SAPシステム管理の基礎知識', 'desc' => 'SAPシステムの運用・管理を担当するBasisの役割。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => 'S/4HANAとは？次世代ERPの機能解説', 'desc' => 'S/4HANAの特徴と従来のECCとの違いを解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'PPモジュール — 生産計画とMRPの基本', 'desc' => 'MRP（資材所要量計画）の仕組みをわかりやすく解説。', 'mod' => 'pp', 'diff' => 'beginner' ),
        array( 'title' => 'HRモジュールの基礎 — 人事管理の仕組み', 'desc' => '人事マスタデータと給与管理の基礎を解説。', 'mod' => 'hr', 'diff' => 'beginner' ),
        array( 'title' => 'SAP伝票体系を理解する — FI/COの連携', 'desc' => '財務伝票と管理会計伝票の関係を解説。', 'mod' => 'fi', 'diff' => 'intermediate' ),
        array( 'title' => 'SAP番号範囲とは？自動採番の仕組み', 'desc' => '番号範囲の設定方法と管理のポイントを解説。', 'mod' => 'basis', 'diff' => 'intermediate' ),
        array( 'title' => 'SAP承認プロセス — ワークフローの基礎', 'desc' => '購買発注の承認や経費精算の承認フローを解説。', 'mod' => 'mm', 'diff' => 'intermediate' ),
        array( 'title' => '会計伝票の基本 — FB50とF-02の違い', 'desc' => '一般仕訳と総勘定元帳転記の違いを比較解説。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'ユーザー権限管理 — SAPセキュリティ基礎', 'desc' => 'ロール・プロファイル・権限オブジェクトの基礎。', 'mod' => 'basis', 'diff' => 'intermediate' ),
        array( 'title' => 'バリアント設定とは？カスタマイズ作法', 'desc' => 'レポートバリアントの作成と管理方法を解説。', 'mod' => 'abap', 'diff' => 'intermediate' ),
        array( 'title' => 'SAP Fioriとは？モダンUIフレームワーク', 'desc' => 'Fioriの基本概念と導入メリットを解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'ALEとIDoc — SAPシステム連携の基本', 'desc' => 'システム間連携の仕組みとIDocの基礎を解説。', 'mod' => 'basis', 'diff' => 'advanced' ),
        array( 'title' => 'SAPテーブル構造を理解する', 'desc' => '透明テーブルとプールテーブルの違いを解説。', 'mod' => 'abap', 'diff' => 'intermediate' ),
        array( 'title' => 'バッチジョブの基礎 — バックグラウンド処理', 'desc' => 'バッチジョブの登録からスケジュール管理まで。', 'mod' => 'basis', 'diff' => 'intermediate' ),
    );
    $trends = array(
        array( 'title' => 'S/4HANA Cloudが変えるERPの未来', 'desc' => 'クラウドERPの最新動向と導入事例を紹介。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'RISE with SAPとは？企業変革を加速', 'desc' => 'SAPの新しい提供モデル RISE の全容を解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'SAP Business AI — AIが変える業務', 'desc' => 'SAPにおけるAI活用事例と将来展望を解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'グリーンリージョン戦略とサステナビリティ', 'desc' => '環境負荷低減に向けたSAPの取り組みを解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'ABAP Cloud — 新開発モデルへの移行ガイド', 'desc' => 'クラウド対応ABAP開発のベストプラクティス。', 'mod' => 'abap', 'diff' => 'intermediate' ),
        array( 'title' => 'SAP Clean Core戦略とは？', 'desc' => '標準機能を最大活用するクリーンコアの考え方。', 'mod' => 's4', 'diff' => 'advanced' ),
        array( 'title' => 'SAP BTPで拡張するエンタープライズアプリ', 'desc' => 'Business Technology Platformの活用事例。', 'mod' => 'abap', 'diff' => 'advanced' ),
        array( 'title' => 'SAP Datasphere — データ管理の新時代', 'desc' => 'データ統合・分析基盤の最新ソリューション解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'Signavioで実現するプロセスマイニング', 'desc' => '業務プロセス可視化と改善の最新手法を解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'AI搭載採用管理システムの展望', 'desc' => 'AIを活用したタレントマネジメントの未来。', 'mod' => 'hr', 'diff' => 'intermediate' ),
        array( 'title' => 'モバイルSAP — 現場主導のデジタル化', 'desc' => 'モバイル端末を使った現場業務効率化の事例。', 'mod' => 'mm', 'diff' => 'beginner' ),
        array( 'title' => 'サブスクリプションモデルが変える導入方法', 'desc' => 'ライセンスモデルの変化と企業への影響を解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'IoTとSAP — スマートファクトリーの実現', 'desc' => '工場IoTデータとSAP連携による生産革新。', 'mod' => 'pp', 'diff' => 'advanced' ),
        array( 'title' => 'SAPユーザーコミュニティの活用法', 'desc' => 'SAP Communityやユーザーグループの活用術。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => '2026年注目のSAPアップデートまとめ', 'desc' => '今年の主要な機能強化とロードマップを解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'ERPとSaaSのハイブリッド運用トレンド', 'desc' => 'オンプレミスとクラウドの併用が増える背景。', 'mod' => 'basis', 'diff' => 'intermediate' ),
        array( 'title' => 'デジタルサプライチェーンとSAPの役割', 'desc' => 'サプライチェーン可視化におけるSAPの最新機能。', 'mod' => 'mm', 'diff' => 'intermediate' ),
        array( 'title' => 'SAPサイバーセキュリティ対策の最前線', 'desc' => 'SAPシステムを守るためのセキュリティ戦略。', 'mod' => 'basis', 'diff' => 'advanced' ),
        array( 'title' => 'SuccessFactorsの最新動向', 'desc' => 'クラウド人事リーダー SuccessFactors の最新情報。', 'mod' => 'hr', 'diff' => 'beginner' ),
        array( 'title' => 'ローコード/ノーコードとSAPの融合', 'desc' => 'ビジネスユーザーによるSAP拡張開発の新潮流。', 'mod' => 'abap', 'diff' => 'intermediate' ),
    );
    $career = array(
        array( 'title' => 'SAPコンサルタントになるには？完全ガイド', 'desc' => '未経験からSAPコンサルになるまでの道のりを解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'SAPコンサル年収事情 — モジュール別比較', 'desc' => '各モジュールの年収相場とキャリアステージ分析。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'SAP業界で求められるスキルセット', 'desc' => '技術スキルだけでなく業務知識や語学力の重要性。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => '転職エージェントvs直接応募 — 最適な方法', 'desc' => 'SAP業界に強い転職エージェントの選び方を紹介。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'SAPアソシエイトコンサルタントの1日', 'desc' => '若手コンサルのリアルな業務スケジュールを公開。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'ABAPエンジニアへの転職ロードマップ', 'desc' => 'プログラミング未経験でもABAPエンジニアになれる？', 'mod' => 'abap', 'diff' => 'beginner' ),
        array( 'title' => 'SAPコンサルに必要な英語力のリアル', 'desc' => 'グローバル案件で求められる英語レベルを解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'SAP資格ガイド — おすすめ資格と難易度', 'desc' => 'SAP認定資格の種類と取得メリットを解説。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => 'フリーランスSAPコンサルタントの始め方', 'desc' => '独立に向けた準備と案件獲得のコツを紹介。', 'mod' => 'fi', 'diff' => 'advanced' ),
        array( 'title' => '派遣vs正社員 — SAP働き方比較', 'desc' => '雇用形態によるメリットデメリットを徹底比較。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => '海外SAPコンサルタントとして働く方法', 'desc' => '海外案件の探し方と赴任に必要な準備を解説。', 'mod' => 's4', 'diff' => 'intermediate' ),
        array( 'title' => 'SAPコンサル面接対策 — よくある質問集', 'desc' => '面接で聞かれやすい質問と回答例を紹介。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'SAP導入プロジェクトのフェーズ別仕事内容', 'desc' => '要件定義から運用まで各フェーズの役割を解説。', 'mod' => 'basis', 'diff' => 'intermediate' ),
        array( 'title' => 'ポートフォリオ作成術 — 転職に強い経歴書', 'desc' => 'SAPコンサル向け経歴書の書き方と実績アピール法。', 'mod' => 's4', 'diff' => 'beginner' ),
        array( 'title' => '40代からのSAPキャリア戦略', 'desc' => 'ミドル世代がSAP業界で生き残る戦略を紹介。', 'mod' => 'fi', 'diff' => 'intermediate' ),
        array( 'title' => 'SAPコンサルの働き方改革 — リモート事情', 'desc' => 'SAP業界のテレワーク導入状況と実態を解説。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => '初心者が最初に選ぶべきモジュールは？', 'desc' => '初心者におすすめの入門モジュールをキャリア別に紹介。', 'mod' => 'fi', 'diff' => 'beginner' ),
        array( 'title' => 'プロジェクトマネージャーへのキャリアアップ', 'desc' => 'PMとして必要なスキルとキャリアパスを解説。', 'mod' => 's4', 'diff' => 'advanced' ),
        array( 'title' => 'SAPと他ERPの違い — 転職時に知るべきこと', 'desc' => 'OracleやMicrosoft Dynamicsとの違いを比較解説。', 'mod' => 'basis', 'diff' => 'beginner' ),
        array( 'title' => 'SAPコンサル失敗事例と回避方法', 'desc' => '現場でよくある失敗事例とその対策を紹介。', 'mod' => 'fi', 'diff' => 'intermediate' ),
    );
    $all = array( 'glossary' => $glossary, 'trends' => $trends, 'career-guide' => $career );
    foreach ( $all as $topic_slug => $articles ) {
        foreach ( $articles as $a ) {
            $existing = get_posts( array( 'post_type' => 'post', 'title' => $a['title'], 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids' ) );
            if ( ! empty( $existing ) ) continue;
            $id = wp_insert_post( array(
                'post_type'    => 'post',
                'post_title'   => $a['title'],
                'post_content' => '<h2>' . $a['title'] . '</h2><p>' . $a['desc'] . '。SAPパンダ先生がわかりやすく解説します。</p><h3>ポイント</h3><ul><li>まずは基礎を理解しましょう</li><li>実際の業務と関連付けて考えると理解が深まります</li><li>SAP用語に慣れることが最初の一歩です</li></ul>',
                'post_excerpt' => $a['desc'],
                'post_status'  => 'publish',
                'post_author'  => 1,
            ) );
            if ( is_wp_error( $id ) ) continue;
            wp_set_object_terms( $id, $a['mod'], 'sap_module' );
            wp_set_object_terms( $id, $a['diff'], 'difficulty' );
            wp_set_object_terms( $id, $topic_slug, 'topic' );
            update_post_meta( $id, 'article_reading_time', rand( 3, 12 ) );
        }
    }
}

// 固定ページを自動生成（まだ存在しない場合）
function sap_panda_seed_site_pages() {
    $pages = [
        'about' => [
            'title' => 'サイトについて',
            'content' => '<h2>SAP パンダ先生 NAVI とは</h2><p>SAP に関わるすべての人に向けた総合ナレッジサイトです。FI/CO/MM/SD/PP/HR/ABAP/Basis/S4 の全9モジュールをカバー。</p>',
        ],
        'team' => [
            'title' => '執筆メンバー',
            'content' => '<p>SAP パンダ先生 NAVI は、現役 SAP コンサルタントやエンジニアが執筆しています。</p>',
        ],
        'privacy' => [
            'title' => 'プライバシーポリシー',
            'content' => '<h2>個人情報の収集について</h2><p>当サイトでは、お問い合わせフォームの送信時に、お名前・メールアドレス等の個人情報をご提供いただく場合がございます。</p><h2>Cookie について</h2><p>当サイトでは、ユーザー体験向上のために Cookie を使用することがあります。</p>',
        ],
        'terms' => [
            'title' => '利用規約',
            'content' => '<h2>はじめに</h2><p>本規約は、SAP パンダ先生 NAVI の利用条件を定めるものです。</p><h2>免責事項</h2><p>当サイトの情報は、SAP に関する学習・参考を目的として提供されています。</p>',
        ],
    ];
    foreach ($pages as $slug => $page) {
        $existing = get_posts(['post_type' => 'page', 'name' => $slug, 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids']);
        if (empty($existing)) {
            wp_insert_post([
                'post_type' => 'page',
                'post_title' => $page['title'],
                'post_content' => $page['content'],
                'post_name' => $slug,
                'post_status' => 'publish',
                'post_author' => 1,
            ]);
        }
    }
}

/**
 * デフォルト 9 モジュールを ACF Options にシードする。
 * 同時に sap_module タクソノミーのタームも作成（記事分類用）。
 * ACF がなくても polyfill で動作する。
 */
function sap_panda_seed_modules() {
	$modules = array(
		'fi'    => array( 'name_ja' => 'FI · 財務会計',   'name_en' => 'Financial Accounting', 'code' => 'FI',   'color' => '#2f6d44', 'bg_color' => '#d8ead9', 'description' => '会計帳簿、決算、勘定科目。経理担当が触る一番大事な土台。',                      'levels' => array('初級','中級','上級'), 'order' => 1 ),
		'co'    => array( 'name_ja' => 'CO · 管理会計',   'name_en' => 'Controlling',          'code' => 'CO',   'color' => '#2641a1', 'bg_color' => '#dde4fc', 'description' => '原価計算、利益分析、予算管理。社内意思決定に効く。',                            'levels' => array('初級','中級'),       'order' => 2 ),
		'mm'    => array( 'name_ja' => 'MM · 購買・在庫', 'name_en' => 'Material Management',  'code' => 'MM',   'color' => '#a25411', 'bg_color' => '#fde0c2', 'description' => '購買依頼から入庫まで。サプライチェーンの心臓部。',                           'levels' => array('初級','中級','上級'), 'order' => 3 ),
		'sd'    => array( 'name_ja' => 'SD · 販売管理',   'name_en' => 'Sales & Distribution', 'code' => 'SD',   'color' => '#b62a4a', 'bg_color' => '#ffdfe6', 'description' => '受注、出荷、請求。お客様への流れをぜんぶ管理。',                              'levels' => array('初級','中級','上級'), 'order' => 4 ),
		'pp'    => array( 'name_ja' => 'PP · 生産計画',   'name_en' => 'Production Planning',  'code' => 'PP',   'color' => '#4828a8', 'bg_color' => '#e4dffb', 'description' => 'MRP、BOM、製造指示。工場の動きをコントロール。',                              'levels' => array('中級','上級'),         'order' => 5 ),
		'hr'    => array( 'name_ja' => 'HR · 人事管理',   'name_en' => 'Human Resources',      'code' => 'HR',   'color' => '#8a6212', 'bg_color' => '#fee9b3', 'description' => '人事マスタ、給与、勤怠。SuccessFactorsとの連携も。',                            'levels' => array('初級','中級'),       'order' => 6 ),
		'abap'  => array( 'name_ja' => 'ABAP · 開発言語', 'name_en' => 'ABAP',                  'code' => 'ABAP', 'color' => '#1f6f6f', 'bg_color' => '#cfecec', 'description' => 'SAP独自の開発言語。アドオン、レポート、機能拡張に。',                           'levels' => array('初級','中級','上級'), 'order' => 7 ),
		'basis' => array( 'name_ja' => 'Basis · 基盤管理','name_en' => 'Basis',                 'code' => 'BS',   'color' => '#4a432d', 'bg_color' => '#e3e1d8', 'description' => 'システム運用、権限、パッチ。SAPの裏方。',                                     'levels' => array('中級','上級'),         'order' => 8 ),
		's4'    => array( 'name_ja' => 'S/4 · S/4HANA',  'name_en' => 'S/4HANA',               'code' => 'S4',   'color' => '#1864a3', 'bg_color' => '#d1ecf9', 'description' => '次世代ERP。Fiori UI、HANA DB、シンプリフィケーション。',                       'levels' => array('初級','中級','上級'), 'order' => 9 ),
	);

	// ACF Options に保存（ACF がない場合は polyfill が term_meta から代替読み出し）
	$all = get_option( 'sap_panda_module_data', array() );
	$updated = false;

	foreach ( $modules as $slug => $m ) {
		$key = 'mod_' . $slug;
		if ( isset( $all[ $key ] ) && ! empty( $all[ $key ] ) ) {
			continue; // すでに設定済み
		}
		$all[ $key ] = $m;
		$updated = true;
	}

	if ( $updated ) {
		update_option( 'sap_panda_module_data', $all );
	}

	// タクソノミーのタームも作成（記事分類用）
	// メタデータは Options で管理するため term_meta は保存しない
	$term_labels = array(
		'fi'    => 'FI · 財務会計',
		'co'    => 'CO · 管理会計',
		'mm'    => 'MM · 購買・在庫',
		'sd'    => 'SD · 販売管理',
		'pp'    => 'PP · 生産計画',
		'hr'    => 'HR · 人事管理',
		'abap'  => 'ABAP · 開発言語',
		'basis' => 'Basis · 基盤管理',
		's4'    => 'S/4 · S/4HANA',
	);

	foreach ( $term_labels as $slug => $label ) {
		if ( ! term_exists( $slug, 'sap_module' ) ) {
			wp_insert_term( $label, 'sap_module', array( 'slug' => $slug ) );
		}
	}
}

// Create custom tables
function sap_panda_create_tables() {
    global $wpdb;
    $charset = $wpdb->get_charset_collate();

    $tables = [];

    $tables[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}user_points (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        points INT DEFAULT 0,
        points_type VARCHAR(50) NOT NULL,
        source_id BIGINT UNSIGNED DEFAULT NULL,
        description VARCHAR(255) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_points_type (points_type)
    ) $charset;";

    $tables[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}quiz_attempts (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        quiz_id BIGINT UNSIGNED NOT NULL,
        selected_answer INT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_quiz_id (quiz_id)
    ) $charset;";

    $tables[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}case_applications (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        case_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED DEFAULT NULL,
        applicant_name VARCHAR(100) NOT NULL,
        applicant_email VARCHAR(100) NOT NULL,
        applicant_phone VARCHAR(20) DEFAULT NULL,
        expected_rate VARCHAR(50) DEFAULT NULL,
        experience_years VARCHAR(20) DEFAULT NULL,
        skill_modules TEXT DEFAULT NULL,
        self_pr TEXT DEFAULT NULL,
        resume_file VARCHAR(255) DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_case_id (case_id),
        INDEX idx_user_id (user_id)
    ) $charset;";

    $tables[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}reactions (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        post_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED DEFAULT NULL,
        reaction_type VARCHAR(10) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id),
        UNIQUE KEY uk_post_user_type (post_id, user_id, reaction_type)
    ) $charset;";

    $tables[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}learning_progress (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        path_id BIGINT UNSIGNED NOT NULL,
        step_index INT NOT NULL DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME DEFAULT NULL,
        UNIQUE KEY uk_user_path (user_id, path_id)
    ) $charset;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    foreach ($tables as $sql) {
        dbDelta($sql);
    }
}

// Force classic editor for CPTs with custom meta boxes
add_filter('use_block_editor_for_post_type', function($enabled, $post_type) {
    $classic = ['daily_quiz', 'sap_case', 'course', 'teacher', 'learning_path', 'member_plan', 'lesson'];
    return in_array($post_type, $classic) ? false : $enabled;
}, 10, 2);

// Admin (backend only)
if (is_admin() && class_exists('SAP_Panda_Admin')) {
    (new SAP_Panda_Admin())->register();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'sap_panda_deactivate');
function sap_panda_deactivate() {
    flush_rewrite_rules();
}

// Register case meta for REST API
add_action('init', 'sap_panda_register_case_meta');
function sap_panda_register_case_meta() {
    $fields = ['case_rate_min','case_rate_max','case_period','case_utilization','case_location','case_remote','case_experience','case_seats','case_urgent','case_scarce','case_blurb','case_company'];
    foreach ($fields as $f) {
        register_post_meta('sap_case', $f, [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => '__return_true',
        ]);
    }
}

// Register course & knowledge meta for REST API
add_action('init', 'sap_panda_register_content_meta');
function sap_panda_register_content_meta() {
    $course_fields = ['course_price', 'course_duration', 'course_instructor'];
    foreach ($course_fields as $f) {
        register_post_meta('course', $f, [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => '__return_true',
        ]);
    }
    $knowledge_fields = ['knowledge_type', 'knowledge_references'];
    foreach ($knowledge_fields as $f) {
        register_post_meta('knowledge', $f, [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => '__return_true',
        ]);
    }
    $lesson_fields = ['lesson_course_id', 'lesson_order', 'lesson_time'];
    foreach ($lesson_fields as $f) {
        register_post_meta('lesson', $f, [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => '__return_true',
        ]);
    }
// register_post_meta 設定（既存）
    $video_fields = ['video_youtube_id', 'video_duration', 'video_views', 'video_thumbnail'];
    foreach ($video_fields as $f) {
        register_post_meta('video', $f, [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
            'auth_callback' => '__return_true',
        ]);
    }
}
