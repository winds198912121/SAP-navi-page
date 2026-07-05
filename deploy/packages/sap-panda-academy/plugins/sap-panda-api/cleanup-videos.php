<?php
/**
 * SAP Panda Video Data Cleanup Script
 *
 * seed-videos.php で作成された大量の自動生成ビデオデータを削除し、
 * seed-data.php の厳選された40件（実際のYouTube IDを持つ）のみを保持します。
 *
 * 使い方:
 *   wp eval-file cleanup-videos.php
 *   （Docker 環境の場合はコンテナ内で実行）
 *
 * @package SAP_Panda_API
 */

defined('ABSPATH') || exit;

/**
 * seed-data.php に定義されている保持すべきビデオタイトル
 * これらのタイトルに一致する video 投稿は削除しません。
 */
function sap_panda_get_keep_video_titles() {
    return [
        'SAP S/4HANA とは？ 次世代ERPの全体像をわかりやすく解説',
        'SAP Fiori 入門：モダンなUXの基本を20分で学ぶ',
        'ABAP プログラミング基礎：第一回「Hello World」',
        'CDS View 完全入門：S/4HANA 開発の新常識',
        'SAP FI/CO 基本設定：会社コードから利益センタまで',
        '決算業務の効率化：SAPでの月次決算手順',
        'MM 購買プロセス完全マスター：購買依頼から発注まで',
        '在庫管理の実務：移動タイプと棚卸の完全ガイド',
        'SD 受注から出荷までの流れを徹底解説',
        'SAP SD 価格設定の仕組み：条件テクニック完全理解',
        'CO 原価センタ会計入門：配賦サイクルの設定方法',
        '内部受注の設定と実務：予算管理から決済まで',
        'ABAP オブジェクト指向プログラミング入門',
        'RAP モデル開発：Restful ABAP Programming Model 実践',
        'SAP Fiori Elements でアプリ開発を10倍速くする方法',
        'Basis システム管理：ユーザー権限とロール設定の基本',
        'SAP トランスポート管理：開発から本番への変更移送',
        'SAP パフォーマンスチューニング：ST05/STAD で遅いプログラムを特定',
        'PP MRP 完全マスター：資材所要量計画のロジックを理解する',
        'BOMと作業手順：生産マスタデータの基礎知識',
        'SuccessFactors 導入ガイド：クラウドHRの基本から連携まで',
        'SAP HR 人事マスタ管理：インフォタイプの基礎',
        'SAP S/4HANA 移行プロジェクト実践ガイド',
        'Universal Journal とは？ S/4HANA 会計の核心を解説',
        'ALV レポート開発：SAP List Viewer を使いこなす',
        'SAP バッチインプット：SHDB で大量データ処理を自動化',
        'SM30 テーブルメンテナンス：カスタマイジングテーブルの操作',
        'SAP 権限エラーのトラブルシュート：SU53 の使い方',
        'ME21N 発注書作成：購買業務の基本操作をマスター',
        '在庫評価の実務：移動平均法と標準原価法を理解する',
        'VA01 受注作成の完全ガイド：標準受注から返品まで',
        'VF01 請求書作成：出荷ベースの請求処理',
        'SAP S/4HANA Cloud vs On-Premise：違いと選び方',
        'Greenfield vs Brownfield：S/4HANA 移行方式の選定',
        'SAP BTP 入門：ビジネステクノロジープラットフォームの概要',
        'SAP Analytics Cloud でデータ分析を始めよう',
        'FBCJ で小口現金管理：Cash Journal の使い方',
        'SAP 連結会計入門：グループ決算の基礎知識',
        'MM 購買情報照会：ME2L/ME2M/ME2N の使い分け',
        'PP かんばん方式：SAPでの引当て生産の実装方法',
    ];
}

/**
 * 全ビデオデータをクリーンアップ
 *
 * seed-data.php の厳選ビデオ以外をすべて削除します。
 * wp_delete_post($id, true) で完全削除（ゴミ箱を経由しません）。
 */
function sap_panda_cleanup_videos() {
    global $wpdb;

    $keep_titles = sap_panda_get_keep_video_titles();

    // === Step 1: 削除前のカウント ===
    $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'video'");
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "  SAP Panda 動画データクリーンアップ\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "  現在の動画総数: {$total} 件\n";

    // === Step 2: 保持対象のIDを特定 ===
    $keep_ids = [];
    $found_keep = 0;
    foreach ($keep_titles as $title) {
        $posts = get_posts([
            'post_type'      => 'video',
            'title'          => $title,
            'post_status'    => 'any',
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ]);
        if (!empty($posts)) {
            $keep_ids[] = (int) $posts[0];
            $found_keep++;
        }
    }
    echo "  保持対象（seed-dataの動画）: {$found_keep} 件\n";

    // === Step 3: 削除対象を取得 ===
    $all_video_ids = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type = 'video'");
    $delete_ids = array_values(array_diff(array_map('intval', $all_video_ids), $keep_ids));
    $delete_count = count($delete_ids);

    echo "  削除対象: {$delete_count} 件\n";

    if ($delete_count === 0) {
        echo "\n  削除する動画はありません。\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        return 0;
    }

    // === Step 4: 確認 ===
    if (php_sapi_name() !== 'cli') {
        echo "\n  CLI環境以外での実行は推奨しません。\n";
        echo "  wp eval-file cleanup-videos.php を使用してください。\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        return -1;
    }

    echo "\n  削除を開始します...\n";
    echo "  （この操作は元に戻せません）\n";
    echo "\n";

    // === Step 5: 削除実行 ===
    $deleted = 0;
    $errors = 0;
    $batch_size = 50;
    $total_batches = ceil($delete_count / $batch_size);

    foreach (array_chunk($delete_ids, $batch_size) as $batch_index => $batch) {
        foreach ($batch as $id) {
            $post = get_post($id);
            $title = $post ? $post->post_title : '(unknown)';
            $result = wp_delete_post($id, true);
            if ($result) {
                $deleted++;
            } else {
                $errors++;
                echo "  ✗ 削除失敗 ID:{$id} - {$title}\n";
            }
        }
        $batch_num = $batch_index + 1;
        $progress = round(($batch_num / $total_batches) * 100);
        echo "  進捗: {$batch_num}/{$total_batches} バッチ ({$progress}%) - {$deleted} 件削除済み\n";
    }

    // === Step 6: 結果表示 ===
    $remaining = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'video'");

    echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "  クリーンアップ完了\n";
    echo "  削除成功: {$deleted} 件\n";
    if ($errors > 0) {
        echo "  削除失敗: {$errors} 件\n";
    }
    echo "  保持した動画: {$remaining} 件\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

    return $deleted;
}

// 実行
if (php_sapi_name() === 'cli') {
    $result = sap_panda_cleanup_videos();
    exit($result >= 0 ? 0 : 1);
}
