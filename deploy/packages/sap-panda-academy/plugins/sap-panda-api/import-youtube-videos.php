<?php
/**
 * Import YouTube Videos into WordPress
 *
 * scripts/collect-youtube-sap/collector.py で出力した JSON を読み込み、
 * WordPress の video カスタム投稿タイプとしてインポートします。
 *
 * 使い方:
 *   # デフォルトのJSONをインポート
 *   wp eval-file import-youtube-videos.php
 *
 *   # 特定のJSONファイルを指定
 *   wp eval-file import-youtube-videos.php -- /path/to/videos.json
 *
 *   # 既存動画を全て削除してからインポート（クリーンインストール）
 *   wp eval-file import-youtube-videos.php -- --clean
 *
 *   # ドライラン（何も書き込まずに件数のみ表示）
 *   wp eval-file import-youtube-videos.php -- --dry-run
 *
 * @package SAP_Panda_API
 */

defined('ABSPATH') || exit;

// ---- CLI引数パース ----
$args = isset($argv) ? array_slice($argv, 2) : [];
$json_path = null;
$clean = false;
$dry_run = false;

foreach ($args as $arg) {
    if ($arg === '--clean') {
        $clean = true;
    } elseif ($arg === '--dry-run') {
        $dry_run = true;
    } elseif (strpos($arg, '--') !== 0) {
        $json_path = $arg;
    }
}

// JSONファイルパスの解決
if (!$json_path) {
    // デフォルト: scripts/youtube-sap-videos.json
    $json_path = dirname(SAP_PANDA_API_PATH) . '/scripts/youtube-sap-videos.json';
}

if (!file_exists($json_path)) {
    echo "❌ JSONファイルが見つかりません: {$json_path}\n";
    echo "   まず collector.py でデータを収集してください。\n";
    echo "   cd scripts/collect-youtube-sap && python3 collector.py\n";
    exit(1);
}

$json_data = json_decode(file_get_contents($json_path), true);
if (!$json_data || !isset($json_data['modules'])) {
    echo "❌ JSONパース失敗: {$json_path}\n";
    exit(1);
}

// ---- モジュール名マッピング ----
$module_names = [
    'fi'    => 'FI 財務会計',
    'co'    => 'CO 管理会計',
    'mm'    => 'MM 購買管理',
    'sd'    => 'SD 販売管理',
    'pp'    => 'PP 生産計画',
    'hr'    => 'HR 人事管理',
    'abap'  => 'ABAP',
    'basis' => 'Basis 基盤管理',
    's4'    => 'S/4HANA',
];

// ---- 統計 ----
$total_in_json = 0;
foreach ($json_data['modules'] as $videos) {
    $total_in_json += count($videos);
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  YouTube動画 インポーター\n";
echo "  ソース: {$json_path}\n";
echo "  全動画数: {$total_in_json} 件\n";
echo "  モジュール数: " . count($json_data['modules']) . "\n";
if ($clean) echo "  📢 モード: クリーン（既存動画を全削除）\n";
if ($dry_run) echo "  📢 モード: ドライラン（実際の書き込みなし）\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

// ---- クリーン（既存動画の全削除） ----
if ($clean && !$dry_run) {
    echo "🗑 既存動画を全削除中...\n";
    $existing = get_posts([
        'post_type'      => 'video',
        'post_status'    => 'any',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ]);
    $deleted = 0;
    foreach ($existing as $id) {
        if (wp_delete_post($id, true)) {
            $deleted++;
        }
    }
    echo "  ✓ {$deleted}件 削除完了\n\n";
    // ターム関係もクリア
    $terms = get_terms(['taxonomy' => 'sap_module', 'hide_empty' => false, 'fields' => 'ids']);
    foreach ($terms as $term_id) {
        wp_delete_term($term_id, 'sap_module');
    }
    echo "  ✓ タームもクリア\n\n";
}

// ---- インポート ----
$total_imported = 0;
$total_skipped = 0;
$total_errors = 0;
$module_counts = [];

foreach ($json_data['modules'] as $module_key => $videos) {
    $mod_name = isset($module_names[$module_key]) ? $module_names[$module_key] : strtoupper($module_key);
    $count = count($videos);
    $imported = 0;
    $skipped = 0;
    $errors = 0;

    echo "📦 {$mod_name}: {$count}件処理中...\n";

    // プログレス表示用
    $batch_size = 10;
    $total_batches = ceil($count / $batch_size);

    foreach (array_chunk($videos, $batch_size) as $batch_index => $batch) {
        foreach ($batch as $video) {
            $title = isset($video['title']) ? trim($video['title']) : '';

            if (empty($title)) {
                $errors++;
                continue;
            }

            // 重複チェック: 同じyoutube_id または 同じタイトルの動画が既に存在するか
            $existing_by_id = get_posts([
                'post_type'      => 'video',
                'meta_key'       => 'video_youtube_id',
                'meta_value'     => $video['youtube_id'],
                'post_status'    => 'any',
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ]);

            if (!empty($existing_by_id)) {
                $skipped++;
                continue;
            }

            // 同じタイトルもスキップ
            $existing_by_title = get_posts([
                'post_type'      => 'video',
                'title'          => $title,
                'post_status'    => 'any',
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ]);

            if (!empty($existing_by_title)) {
                $skipped++;
                continue;
            }

            if ($dry_run) {
                $imported++;
                continue;
            }

            // 説明文を生成
            $desc = $video['description'] ?? '';
            $channel = $video['channel_title'] ?? '';

            $content = sprintf(
                '<h2>%s</h2>%s<p>チャンネル: %s</p><div class="video-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/%s" frameborder="0" allowfullscreen></iframe></div>',
                esc_html($title),
                $desc ? '<p>' . esc_html($desc) . '</p>' : '',
                esc_html($channel),
                esc_attr($video['youtube_id'])
            );

            $post_id = wp_insert_post([
                'post_type'    => 'video',
                'post_title'   => $title,
                'post_content' => $content,
                'post_excerpt' => wp_trim_words($desc ?: $title, 30),
                'post_status'  => 'publish',
                'post_author'  => 1,
            ]);

            if (is_wp_error($post_id)) {
                $errors++;
                continue;
            }

            // Meta fields
            update_post_meta($post_id, 'video_youtube_id', sanitize_text_field($video['youtube_id']));
            update_post_meta($post_id, 'video_duration', sanitize_text_field($video['duration']));
            update_post_meta($post_id, 'video_views', intval($video['views'] ?? 0));
            update_post_meta($post_id, 'video_thumbnail', esc_url_raw($video['thumbnail'] ?? ''));
            update_post_meta($post_id, 'video_likes', intval($video['like_count'] ?? 0));
            update_post_meta($post_id, 'video_channel', sanitize_text_field($channel));
            update_post_meta($post_id, 'video_published_at', sanitize_text_field($video['published_at'] ?? ''));

            // タグ（post_meta として保存、video CPTはpost_tag非対応）
            if (!empty($video['tags'])) {
                $tags_safe = array_map('sanitize_text_field', array_slice($video['tags'], 0, 100));
                update_post_meta($post_id, 'video_tags', $tags_safe);
            }

            // SAPモジュール分類
            $module_slug = $video['module'] ?? $module_key;
            if (!term_exists($module_slug, 'sap_module')) {
                $mod_label = isset($module_names[$module_slug])
                    ? $module_names[$module_slug]
                    : strtoupper($module_slug);
                wp_insert_term($mod_label, 'sap_module', ['slug' => $module_slug]);
            }
            wp_set_object_terms($post_id, $module_slug, 'sap_module');

            $imported++;
        }

        // 進捗表示
        $batch_num = $batch_index + 1;
        $progress = min(100, round(($batch_num / $total_batches) * 100));
        $bar_len = 20;
        $bar_fill = round($progress / 100 * $bar_len);
        $bar = str_repeat('█', $bar_fill) . str_repeat('░', $bar_len - $bar_fill);
        echo "\r  {$bar} {$progress}% ({$imported}件 / {$count}件)";
    }

    echo "\n";

    $total_imported += $imported;
    $total_skipped += $skipped;
    $total_errors += $errors;
    $module_counts[$module_key] = $imported;

    echo "  ✓ {$imported}件 インポート";
    if ($skipped > 0) echo ", {$skipped}件 スキップ";
    if ($errors > 0) echo ", {$errors}件 エラー";
    echo "\n\n";
}

// ---- 結果サマリー ----
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  インポート完了!\n";
echo "  正常: {$total_imported} 件\n";
if ($total_skipped > 0) echo "  スキップ: {$total_skipped} 件\n";
if ($total_errors > 0) echo "  エラー: {$total_errors} 件\n";
echo "\n";
echo "  モジュール別:\n";
foreach ($module_counts as $mod => $count) {
    $mn = isset($module_names[$mod]) ? $module_names[$mod] : strtoupper($mod);
    $bar = str_repeat('■', max(1, round($count / 10))) . str_repeat('□', max(0, 30 - round($count / 10)));
    printf("    %-18s %4d件 %s\n", $mn, $count, $bar);
}

$grand_total = (int) wp_count_posts('video')->publish ?? 0;
echo "\n  データベース上の公開動画数: {$grand_total} 件\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
