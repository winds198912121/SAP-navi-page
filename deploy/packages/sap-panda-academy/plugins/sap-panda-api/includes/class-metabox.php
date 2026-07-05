<?php
/**
 * Custom Meta Boxes for SAP Panda CPTs
 * 为 sap_case 等 CPT 在后台添加完整字段编辑
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_Meta_Boxes {

    public function register() {
        add_action('add_meta_boxes', [$this, 'add_case_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_course_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_teacher_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_quiz_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_knowledge_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_video_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_learning_path_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_step_meta_box']);
        add_action('add_meta_boxes', [$this, 'add_lesson_meta_box']);
        add_action('save_post_sap_case', [$this, 'save_case_meta'], 10, 2);
        add_action('save_post_course', [$this, 'save_course_meta'], 10, 2);
        add_action('save_post_teacher', [$this, 'save_teacher_meta'], 10, 2);
        add_action('save_post_daily_quiz', [$this, 'save_quiz_meta'], 10, 2);
        add_action('save_post_knowledge', [$this, 'save_knowledge_meta'], 10, 2);
        add_action('save_post_learning_path', [$this, 'save_learning_path_meta'], 10, 2);
        add_action('save_post_path_step', [$this, 'save_step_meta'], 10, 2);
        add_action('save_post_lesson', [$this, 'save_lesson_meta'], 10, 2);
        add_filter('manage_learning_path_posts_columns', [$this, 'learning_path_columns']);
        add_filter('manage_path_step_posts_columns', [$this, 'step_columns']);
        add_action('manage_path_step_posts_custom_column', [$this, 'step_columns_content'], 10, 2);
        add_action('manage_learning_path_posts_custom_column', [$this, 'learning_path_columns_content'], 10, 2);
        add_filter('manage_knowledge_posts_columns', [$this, 'knowledge_columns']);
        add_action('manage_knowledge_posts_custom_column', [$this, 'knowledge_columns_content'], 10, 2);
        add_filter('manage_lesson_posts_columns', [$this, 'lesson_columns']);
        add_action('manage_lesson_posts_custom_column', [$this, 'lesson_columns_content'], 10, 2);
    }

    public function add_course_meta_box() {
        add_meta_box('sap_course_details', 'コース詳細情報', [$this, 'render_course_meta_box'], 'course', 'normal', 'high');
    }

    public function add_teacher_meta_box() {
        add_meta_box('sap_teacher_details', '講師情報', [$this, 'render_teacher_meta_box'], 'teacher', 'normal', 'high');
    }

    public function render_course_meta_box($post) {
        wp_nonce_field('sap_course_meta', 'sap_course_meta_nonce');
        $fields = [
            'course_price'      => ['label' => '価格（円）', 'type' => 'number'],
            'course_duration'   => ['label' => 'コース期間', 'type' => 'text', 'placeholder' => '3週間'],
            'course_instructor' => ['label' => '講師名', 'type' => 'text', 'placeholder' => 'パンダ先生'],
        ];
        echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px 0;">';
        foreach ($fields as $key => $cfg) {
            $val = get_post_meta($post->ID, $key, true);
            echo '<div style="display:flex;flex-direction:column;gap:4px;">';
            echo '<label for="' . esc_attr($key) . '" style="font-weight:600;font-size:12px;">' . esc_html($cfg['label']) . '</label>';
            if ($cfg['type'] === 'number') {
                echo '<input type="number" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($val) . '" style="width:100%;padding:6px 8px;" />';
            } else {
                echo '<input type="text" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($val) . '" style="width:100%;padding:6px 8px;" placeholder="' . esc_attr($cfg['placeholder'] ?? '') . '" />';
            }
            echo '</div>';
        }
        echo '</div>';
    }

    public function render_teacher_meta_box($post) {
        wp_nonce_field('sap_teacher_meta', 'sap_teacher_meta_nonce');
        $fields = [
            'teacher_avatar'    => ['label' => 'アバターURL', 'type' => 'url'],
            'teacher_bio'       => ['label' => '経歴', 'type' => 'textarea'],
            'teacher_specialty' => ['label' => '専門分野', 'type' => 'text'],
        ];
        foreach ($fields as $key => $cfg) {
            $val = get_post_meta($post->ID, $key, true);
            echo '<div style="margin-bottom:12px;">';
            echo '<label for="' . esc_attr($key) . '" style="font-weight:600;font-size:12px;display:block;margin-bottom:4px;">' . esc_html($cfg['label']) . '</label>';
            if ($cfg['type'] === 'textarea') {
                echo '<textarea id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" rows="3" style="width:100%;padding:6px 8px;">' . esc_textarea($val) . '</textarea>';
            } else {
                echo '<input type="' . $cfg['type'] . '" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($val) . '" style="width:100%;padding:6px 8px;" />';
            }
            echo '</div>';
        }
    }

    public function save_course_meta($post_id, $post) {
        if (!isset($_POST['sap_course_meta_nonce']) || !wp_verify_nonce($_POST['sap_course_meta_nonce'], 'sap_course_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        foreach (['course_price', 'course_duration', 'course_instructor'] as $key) {
            if (isset($_POST[$key])) update_post_meta($post_id, $key, sanitize_text_field($_POST[$key]));
        }
    }

    public function save_teacher_meta($post_id, $post) {
        if (!isset($_POST['sap_teacher_meta_nonce']) || !wp_verify_nonce($_POST['sap_teacher_meta_nonce'], 'sap_teacher_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        foreach (['teacher_avatar', 'teacher_bio', 'teacher_specialty'] as $key) {
            if (isset($_POST[$key])) update_post_meta($post_id, $key, sanitize_text_field($_POST[$key]));
        }
    }

    /**
     * 注册每日一问 Meta Box
     */
    public function add_quiz_meta_box() {
        add_meta_box('sap_quiz_details', 'クイズ設定', [$this, 'render_quiz_meta_box'], 'daily_quiz', 'normal', 'high');
    }

    public function render_quiz_meta_box($post) {
        wp_nonce_field('sap_quiz_meta', 'sap_quiz_meta_nonce');
        $options = get_post_meta($post->ID, 'quiz_options', true) ?: array_fill(0, 4, ['text' => '', 'correct' => false]);
        $explanation = get_post_meta($post->ID, 'quiz_explanation', true);
        $difficulty = get_post_meta($post->ID, 'quiz_difficulty', true);
        $module = get_post_meta($post->ID, 'quiz_module', true);
        ?>
        <p style="font-size:12px;color:#646970;">問題文は「タイトル」フィールドに入力してください。</p>

        <h4 style="margin:12px 0 8px;">選択肢（4つ）</h4>
        <?php for ($i = 0; $i < 4; $i++): ?>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px;background:#f6f7f7;border-radius:4px;">
                <span style="font-weight:700;font-size:16px;min-width:24px;color:#2271b1;"><?php echo chr(65 + $i); ?></span>
                <input type="text" name="quiz_option_<?php echo $i; ?>" value="<?php echo esc_attr($options[$i]['text'] ?? ''); ?>"
                    placeholder="選択肢 <?php echo $i + 1; ?>" style="flex:1;padding:5px 8px;" />
                <label style="white-space:nowrap;font-size:13px;display:flex;align-items:center;gap:4px;">
                    <input type="radio" name="quiz_correct" value="<?php echo $i; ?>" <?php checked(!empty($options[$i]['correct'])); ?> />
                    正解
                </label>
            </div>
        <?php endfor; ?>

        <h4 style="margin:16px 0 8px;">出題日</h4>
        <input type="date" name="quiz_date" value="<?php echo esc_attr(get_post_meta($post->ID, 'quiz_date', true)); ?>" style="padding:5px 8px;" />
        <p style="font-size:11px;color:#646970;margin:4px 0 0;">設定した日付に出題されます。空欄の場合は日付順に自動割り当てされます。</p>

        <h4 style="margin:16px 0 8px;">解説</h4>
        <textarea name="quiz_explanation" rows="4" style="width:100%;padding:6px 8px;"><?php echo esc_textarea($explanation); ?></textarea>

        <h4 style="margin:16px 0 8px;">オプション</h4>
        <div style="display:flex;gap:16px;">
            <select name="quiz_difficulty">
                <option value="">難易度を選択</option>
                <option value="beginner" <?php selected($difficulty, 'beginner'); ?>>初級</option>
                <option value="intermediate" <?php selected($difficulty, 'intermediate'); ?>>中級</option>
                <option value="advanced" <?php selected($difficulty, 'advanced'); ?>>上級</option>
            </select>
            <select name="quiz_module">
                <option value="">モジュールを選択</option>
                <?php
                $terms = get_terms(['taxonomy' => 'sap_module', 'hide_empty' => false]);
                foreach ($terms as $t):
                ?>
                    <option value="<?php echo $t->slug; ?>" <?php selected($module, $t->slug); ?>><?php echo $t->name; ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php
    }

    public function save_quiz_meta($post_id, $post) {
        if (!isset($_POST['sap_quiz_meta_nonce']) || !wp_verify_nonce($_POST['sap_quiz_meta_nonce'], 'sap_quiz_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        $options = [];
        for ($i = 0; $i < 4; $i++) {
            $key = 'quiz_option_' . $i;
            $options[] = [
                'text'    => isset($_POST[$key]) ? sanitize_text_field($_POST[$key]) : '',
                'correct' => isset($_POST['quiz_correct']) && (int) $_POST['quiz_correct'] === $i,
            ];
        }
        update_post_meta($post_id, 'quiz_options', $options);
        if (isset($_POST['quiz_explanation'])) update_post_meta($post_id, 'quiz_explanation', sanitize_textarea_field($_POST['quiz_explanation']));
        if (isset($_POST['quiz_difficulty'])) update_post_meta($post_id, 'quiz_difficulty', sanitize_text_field($_POST['quiz_difficulty']));
        if (isset($_POST['quiz_module'])) update_post_meta($post_id, 'quiz_module', sanitize_text_field($_POST['quiz_module']));
        if (isset($_POST['quiz_date'])) update_post_meta($post_id, 'quiz_date', sanitize_text_field($_POST['quiz_date']));
    }

    /**
     * 学習パス Meta Box
     */
    public function add_learning_path_meta_box() {
        add_meta_box('sap_learning_path_details', '学習パス設定', [$this, 'render_learning_path_meta_box'], 'learning_path', 'normal', 'high');
    }

    public function render_learning_path_meta_box($post) {
        wp_nonce_field('sap_learning_path_meta', 'sap_learning_path_meta_nonce');
        $audience = get_post_meta($post->ID, 'path_audience', true);
        $description = get_post_meta($post->ID, 'path_description', true);
        $duration = get_post_meta($post->ID, 'path_duration', true);
        $accent = get_post_meta($post->ID, 'path_accent', true) ?: '#5a9d6e';
        $cta_url = get_post_meta($post->ID, 'path_cta_url', true) ?: '/';
        $steps = get_post_meta($post->ID, 'path_steps', true) ?: [];
        ?>
        <p>投稿パネルでタイトル・説明文を編集できます。</p>
        <table class="form-table">
            <tr><th><label for="path_audience">対象者</label></th>
                <td><input type="text" id="path_audience" name="path_audience" value="<?php echo esc_attr($audience); ?>" class="regular-text" /></td></tr>
            <tr><th><label for="path_description">説明文</label></th>
                <td><textarea id="path_description" name="path_description" rows="3" class="large-text"><?php echo esc_textarea($description); ?></textarea></td></tr>
            <tr><th><label for="path_duration">期間</label></th>
                <td><input type="text" id="path_duration" name="path_duration" value="<?php echo esc_attr($duration); ?>" class="regular-text" /></td></tr>
            <tr><th><label for="path_accent">アクセント色</label></th>
                <td><input type="color" id="path_accent" name="path_accent" value="<?php echo esc_attr($accent); ?>" /></td></tr>
            <tr><th><label for="path_cta_url">CTAリンク先</label></th>
                <td><input type="text" id="path_cta_url" name="path_cta_url" value="<?php echo esc_attr($cta_url); ?>" class="regular-text" /></td></tr>
        </table>
        <h4>関連記事</h4>
        <div style="margin-bottom:12px;">
            <select name="path_related_articles[]" multiple style="width:100%;min-height:100px;">
                <?php
                $selected = get_post_meta($post->ID, 'path_related_articles', true) ?: [];
                $articles = get_posts(['post_type' => 'post', 'posts_per_page' => 50, 'post_status' => 'publish', 'orderby' => 'title', 'order' => 'ASC']);
                foreach ($articles as $a):
                    $sel = in_array($a->ID, $selected) ? 'selected' : '';
                ?>
                    <option value="<?php echo $a->ID; ?>" <?php echo $sel; ?>><?php echo esc_html($a->post_title); ?></option>
                <?php endforeach; ?>
            </select>
            <p style="font-size:11px;color:#646970;margin:4px 0 0;">Ctrl+クリックで複数選択。パスに含める記事を選んでください。</p>
        </div>
        <h4>学習ステップ <span style="font-size:11px;color:#646970;font-weight:400;">（各ステップに説明文を入力）</span></h4>
        <div id="path-steps-container">
        <?php foreach ($steps as $i => $step): ?>
            <div class="path-step-block" style="margin-bottom:14px;padding:12px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;">
                <div style="display:flex;gap:8px;margin-bottom:6px;align-items:center;">
                    <span style="font-weight:700;min-width:24px;color:#2271b1;"><?php echo $i+1; ?></span>
                    <input type="text" name="path_step_title[]" value="<?php echo esc_attr($step['step_title']??$step['title']??''); ?>" placeholder="ステップ名" style="flex:1;padding:5px 8px;" />
                    <input type="text" name="path_step_time[]" value="<?php echo esc_attr($step['step_time']??$step['time']??''); ?>" placeholder="所要時間" style="width:100px;padding:5px 8px;" />
                    <button type="button" onclick="this.parentElement.remove()" style="padding:2px 6px;background:#dc3232;color:white;border:none;border-radius:3px;cursor:pointer;">×</button>
                </div>
                <div>
                    <textarea name="path_step_content[]" rows="4" style="width:100%;padding:6px 8px;font-size:12px;font-family:monospace;" placeholder="このステップの説明・学習内容をHTMLで入力（例: &lt;p&gt;ここに説明文を記入&lt;/p&gt;）"><?php echo esc_textarea($step['step_content']??$step['content']??''); ?></textarea>
                </div>
            </div>
        <?php endforeach; ?>
        </div>
        <button type="button" onclick="var c=document.getElementById('path-steps-container');var i=c.children.length;var d=document.createElement('div');d.className='path-step-block';d.style.cssText='margin-bottom:14px;padding:12px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;';d.innerHTML='<div style=\"display:flex;gap:8px;margin-bottom:6px;align-items:center;\"><span style=\"font-weight:700;min-width:24px;color:#2271b1;\">'+(i+1)+'</span><input type=\"text\" name=\"path_step_title[]\" value=\"\" placeholder=\"ステップ名\" style=\"flex:1;padding:5px 8px;\" /><input type=\"text\" name=\"path_step_time[]\" value=\"\" placeholder=\"所要時間\" style=\"width:100px;padding:5px 8px;\" /><button type=\"button\" onclick=\"this.parentElement.remove()\" style=\"padding:2px 6px;background:#dc3232;color:white;border:none;border-radius:3px;cursor:pointer;\">×</button></div><div><textarea name=\"path_step_content[]\" rows=\"4\" style=\"width:100%;padding:6px 8px;font-size:12px;font-family:monospace;\" placeholder=\"説明文を入力\"></textarea></div>';c.appendChild(d);" style="padding:4px 12px;background:#2271b1;color:white;border:none;border-radius:4px;cursor:pointer;">+ ステップ追加</button>
        <?php
    }

    public function save_learning_path_meta($post_id, $post) {
        if (!isset($_POST['sap_learning_path_meta_nonce']) || !wp_verify_nonce($_POST['sap_learning_path_meta_nonce'], 'sap_learning_path_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        foreach (['path_audience', 'path_duration', 'path_accent', 'path_cta_url'] as $k) {
            if (isset($_POST[$k])) update_post_meta($post_id, $k, sanitize_text_field($_POST[$k]));
        }
        if (isset($_POST['path_description'])) update_post_meta($post_id, 'path_description', sanitize_textarea_field($_POST['path_description']));
        if (isset($_POST['path_related_articles'])) {
            $articles = array_map('intval', (array) $_POST['path_related_articles']);
            update_post_meta($post_id, 'path_related_articles', $articles);
        } else {
            update_post_meta($post_id, 'path_related_articles', []);
        }

        $titles = isset($_POST['path_step_title']) ? (array) $_POST['path_step_title'] : [];
        $times = isset($_POST['path_step_time']) ? (array) $_POST['path_step_time'] : [];
        $contents = isset($_POST['path_step_content']) ? (array) $_POST['path_step_content'] : [];
        $steps = [];
        for ($i = 0; $i < count($titles); $i++) {
            if (!empty(trim($titles[$i]))) {
                $steps[] = [
                    'step_title' => sanitize_text_field($titles[$i]),
                    'step_time' => sanitize_text_field($times[$i] ?? ''),
                    'step_content' => isset($contents[$i]) ? wp_kses_post($contents[$i]) : '',
                ];
            }
        }
        update_post_meta($post_id, 'path_steps', $steps);

        // Auto-calculate article count from related articles
        $related = get_post_meta($post_id, 'path_related_articles', true);
        if (is_array($related) && !empty($related)) {
            update_post_meta($post_id, 'path_article_count', count($related));
        }
    }

    public function learning_path_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'title') { $new[$k] = $v; $new['audience'] = '対象'; $new['steps'] = 'Step'; $new['duration'] = '期間'; continue; }
            $new[$k] = $v;
        }
        return $new;
    }

    public function learning_path_columns_content($column, $post_id) {
        if ($column === 'audience') echo esc_html(get_post_meta($post_id, 'path_audience', true) ?: '—');
        if ($column === 'steps') { $s = get_post_meta($post_id, 'path_steps', true); echo is_array($s) ? count($s) . ' steps' : '—'; }
        if ($column === 'duration') echo esc_html(get_post_meta($post_id, 'path_duration', true) ?: '—');
    }

    /**
     * 注册案件 Meta Box
     */
    public function add_knowledge_meta_box() {
        add_meta_box('sap_knowledge_details', 'ナレッジ設定', [$this, 'render_knowledge_meta_box'], 'knowledge', 'normal', 'high');
    }

    public function render_knowledge_meta_box($post) {
        wp_nonce_field('sap_knowledge_meta', 'sap_knowledge_meta_nonce');
        $type = get_post_meta($post->ID, 'knowledge_type', true);
        $refs = get_post_meta($post->ID, 'knowledge_references', true);
        $refs_text = '';
        if (is_array($refs)) {
            foreach ($refs as $r) {
                $refs_text .= ($r['url'] ?? '') . '|' . ($r['label'] ?? '') . "\n";
            }
        }
        ?>
        <p style="font-size:12px;color:#646970;">投稿パネルで本文・モジュール・難易度を設定できます。</p>
        <div style="display:flex;gap:16px;">
            <select name="knowledge_type">
                <option value="">タイプを選択</option>
                <option value="concept" <?php selected($type, 'concept'); ?>>概念解説</option>
                <option value="tcode" <?php selected($type, 'tcode'); ?>>T-Code</option>
                <option value="best_practice" <?php selected($type, 'best_practice'); ?>>Best Practice</option>
                <option value="glossary" <?php selected($type, 'glossary'); ?>>用語集</option>
            </select>
        </div>
        <div style="margin-top:16px;">
            <label style="font-weight:600;font-size:12px;display:block;margin-bottom:4px;">参考リンク</label>
            <p style="font-size:11px;color:#646970;margin:0 0 6px;">1行につき「URL|ラベル」形式で入力</p>
            <textarea name="knowledge_references" style="width:100%;min-height:80px;font-family:monospace;font-size:12px;"><?php echo esc_textarea($refs_text); ?></textarea>
        </div>
        <?php
    }

    public function save_knowledge_meta($post_id, $post) {
        if (!isset($_POST['sap_knowledge_meta_nonce']) || !wp_verify_nonce($_POST['sap_knowledge_meta_nonce'], 'sap_knowledge_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (isset($_POST['knowledge_type'])) update_post_meta($post_id, 'knowledge_type', sanitize_text_field($_POST['knowledge_type']));
        if (isset($_POST['knowledge_references'])) {
            $lines = explode("\n", $_POST['knowledge_references']);
            $refs = [];
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line)) continue;
                $parts = explode('|', $line, 2);
                $url = trim($parts[0]);
                $label = isset($parts[1]) ? trim($parts[1]) : $url;
                if (!empty($url)) $refs[] = ['url' => esc_url_raw($url), 'label' => sanitize_text_field($label)];
            }
            update_post_meta($post_id, 'knowledge_references', $refs);
        }
    }

    public function video_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'title') { $new[$k] = 'タイトル'; $new['youtube_id'] = 'YouTube ID'; $new['duration'] = '時間'; $new['views'] = '再生数'; $new['module'] = 'モジュール'; continue; }
            $new[$k] = $v;
        }
        return $new;
    }

    public function video_columns_content($column, $post_id) {
        if ($column === 'youtube_id') echo esc_html(get_post_meta($post_id, 'video_youtube_id', true) ?: '--');
        if ($column === 'duration') echo esc_html(get_post_meta($post_id, 'video_duration', true) ?: '--');
        if ($column === 'views') echo number_format((int) get_post_meta($post_id, 'video_views', true));
        if ($column === 'module') {
            $terms = wp_get_object_terms($post_id, 'sap_module', array('fields' => 'names'));
            echo $terms ? implode(', ', $terms) : '--';
        }
    }

    public function add_video_meta_box() {
        add_meta_box('sap_video_details', '動画設定', array($this, 'render_video_meta_box'), 'video', 'side', 'default');
    }

    public function render_video_meta_box($post) {
        wp_nonce_field('sap_video_meta', 'sap_video_meta_nonce');
        $youtube_id = get_post_meta($post->ID, 'video_youtube_id', true);
        $duration = get_post_meta($post->ID, 'video_duration', true);
        $views = get_post_meta($post->ID, 'video_views', true);
        ?>
        <p><label style="font-weight:600;font-size:12px;">YouTube動画ID</label>
        <input type="text" name="video_youtube_id" value="<?php echo esc_attr($youtube_id); ?>" placeholder="dQw4w9WgXcQ" style="width:100%;font-family:monospace;" /></p>
        <p><label style="font-weight:600;font-size:12px;">再生時間</label>
        <input type="text" name="video_duration" value="<?php echo esc_attr($duration); ?>" placeholder="32:14" style="width:80px;" /></p>
        <p><label style="font-weight:600;font-size:12px;">再生回数</label>
        <input type="number" name="video_views" value="<?php echo esc_attr($views ?: '0'); ?>" min="0" style="width:100px;" /></p>
        <p><label style="font-weight:600;font-size:12px;">サムネイル画像URL</label>
        <input type="text" name="video_thumbnail" value="<?php echo esc_attr(get_post_meta($post->ID, 'video_thumbnail', true)); ?>" placeholder="https://example.com/thumbnail.jpg" style="width:100%;font-family:monospace;font-size:12px;" /></p>
        <?php if ($youtube_id): ?><p><iframe width="100%" height="180" src="https://www.youtube.com/embed/<?php echo esc_attr($youtube_id); ?>" frameborder="0" allowfullscreen></iframe></p><?php endif; ?>
        <?php
    }

    public function save_video_meta($post_id, $post) {
        if (!isset($_POST['sap_video_meta_nonce']) || !wp_verify_nonce($_POST['sap_video_meta_nonce'], 'sap_video_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        foreach (array('video_youtube_id', 'video_duration', 'video_views', 'video_thumbnail') as $k) {
            if (isset($_POST[$k])) update_post_meta($post_id, $k, sanitize_text_field($_POST[$k]));
        }
    }

    public function knowledge_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'title') { $new[$k] = $v; $new['knowledge_type'] = 'タイプ'; $new['module'] = 'モジュール'; continue; }
            $new[$k] = $v;
        }
        return $new;
    }

    public function knowledge_columns_content($column, $post_id) {
        if ($column === 'knowledge_type') {
            $map = ['concept' => '概念解説', 'tcode' => 'T-Code', 'best_practice' => 'Best Practice', 'glossary' => '用語集'];
            $type = get_post_meta($post_id, 'knowledge_type', true);
            echo $map[$type] ?? '—';
        }
        if ($column === 'module') {
            $terms = wp_get_object_terms($post_id, 'sap_module', ['fields' => 'names']);
            echo $terms ? implode(', ', $terms) : '—';
        }
    }

    public function step_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'title') { $new[$k] = $v; $new['step_path'] = '所属パス'; $new['step_order'] = '順序'; $new['step_time'] = '時間'; continue; }
            $new[$k] = $v;
        }
        return $new;
    }

    public function step_columns_content($column, $post_id) {
        if ($column === 'step_path') {
            $pid = get_post_meta($post_id, 'step_path_id', true);
            if ($pid) { $p = get_post($pid); echo $p ? esc_html($p->post_title) : '—'; }
            else echo '—';
        }
        if ($column === 'step_order') echo (int) get_post_meta($post_id, 'step_order', true);
        if ($column === 'step_time') echo esc_html(get_post_meta($post_id, 'step_time', true) ?: '—');
    }

    public function add_step_meta_box() {
        add_meta_box('sap_step_details', 'ステップ設定', [$this, 'render_step_meta_box'], 'path_step', 'side', 'default');
    }

    public function render_step_meta_box($post) {
        wp_nonce_field('sap_step_meta', 'sap_step_meta_nonce');
        $path_id = get_post_meta($post->ID, 'step_path_id', true);
        $order = get_post_meta($post->ID, 'step_order', true);
        $time = get_post_meta($post->ID, 'step_time', true);
        $paths = get_posts(['post_type' => 'learning_path', 'posts_per_page' => 20, 'post_status' => 'publish']);
        ?>
        <p><label style="font-weight:600;font-size:12px;">所属パス</label>
        <select name="step_path_id" style="width:100%;margin-top:4px;">
            <option value="">— 選択 —</option>
            <?php foreach ($paths as $p): ?>
                <option value="<?php echo $p->ID; ?>" <?php selected($path_id, $p->ID); ?>><?php echo esc_html($p->post_title); ?></option>
            <?php endforeach; ?>
        </select></p>
        <p><label style="font-weight:600;font-size:12px;">順序</label>
        <input type="number" name="step_order" value="<?php echo esc_attr($order ?: '0'); ?>" min="0" max="99" style="width:60px;margin-top:4px;" /></p>
        <p><label style="font-weight:600;font-size:12px;">所要時間</label>
        <input type="text" name="step_time" value="<?php echo esc_attr($time ?: ''); ?>" placeholder="例: 20min" style="width:100%;margin-top:4px;" /></p>
        <?php
    }

    public function save_step_meta($post_id, $post) {
        if (!isset($_POST['sap_step_meta_nonce']) || !wp_verify_nonce($_POST['sap_step_meta_nonce'], 'sap_step_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        foreach (['step_path_id', 'step_time'] as $k) {
            if (isset($_POST[$k])) update_post_meta($post_id, $k, sanitize_text_field($_POST[$k]));
        }
        if (isset($_POST['step_order'])) update_post_meta($post_id, 'step_order', (int) $_POST['step_order']);
    }

    public function add_case_meta_box() {
        add_meta_box(
            'sap_case_details',
            '案件詳細情報',
            [$this, 'render_case_meta_box'],
            'sap_case',
            'normal',
            'high'
        );
    }

    /**
     * 渲染案件字段表单
     */
    public function render_case_meta_box($post) {
        wp_nonce_field('sap_case_meta', 'sap_case_meta_nonce');

        $fields = [
            'case_rate_min'     => ['label' => '最低単価（万円）', 'type' => 'number', 'min' => 0],
            'case_rate_max'     => ['label' => '最高単価（万円）', 'type' => 'number', 'min' => 0],
            'case_period'       => ['label' => '契約期間', 'type' => 'text', 'placeholder' => '長期（6ヶ月〜）'],
            'case_utilization'  => ['label' => '稼働形態', 'type' => 'text', 'placeholder' => '週5・一部リモート'],
            'case_location'     => ['label' => '勤務地', 'type' => 'text', 'placeholder' => '東京・大手町'],
            'case_remote'       => ['label' => 'リモート可否', 'type' => 'text', 'placeholder' => 'リモート併用 / フルリモート / 出社'],
            'case_experience'   => ['label' => '必要経験年数', 'type' => 'text', 'placeholder' => '5年〜'],
            'case_seats'        => ['label' => '募集人数', 'type' => 'number', 'min' => 1, 'default' => 1],
            'case_company'      => ['label' => '企業名（任意）', 'type' => 'text', 'placeholder' => '株式会社○○'],
            'case_blurb'        => ['label' => '案件紹介文', 'type' => 'textarea'],
        ];

        $toggle_fields = [
            'case_urgent' => '急募',
            'case_scarce' => '残り僅か',
        ];

        $skills_fields = [
            'case_skills_must' => '必須スキル',
            'case_skills_want' => '歓迎スキル',
        ];

        echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px 0;">';

        foreach ($fields as $key => $config) {
            $value = get_post_meta($post->ID, $key, true);
            $default = $config['default'] ?? '';
            $value = $value !== '' ? $value : $default;
            echo '<div style="display:flex;flex-direction:column;gap:4px;">';
            echo '<label for="' . esc_attr($key) . '" style="font-weight:600;font-size:12px;">' . esc_html($config['label']) . '</label>';
            if ($config['type'] === 'textarea') {
                echo '<textarea id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" rows="4" style="width:100%;padding:6px 8px;" placeholder="' . esc_attr($config['placeholder'] ?? '') . '">' . esc_textarea($value) . '</textarea>';
            } elseif ($config['type'] === 'number') {
                echo '<input type="number" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($value) . '" min="' . esc_attr($config['min'] ?? 0) . '" style="width:100%;padding:6px 8px;" />';
            } else {
                echo '<input type="text" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($value) . '" style="width:100%;padding:6px 8px;" placeholder="' . esc_attr($config['placeholder'] ?? '') . '" />';
            }
            echo '</div>';
        }

        echo '</div>';

        // Toggle fields
        echo '<hr style="margin:16px 0;" /><h4 style="margin:0 0 12px;">フラグ設定</h4><div style="display:flex;gap:24px;">';
        foreach ($toggle_fields as $key => $label) {
            $checked = get_post_meta($post->ID, $key, true) ? 'checked' : '';
            echo '<label style="display:flex;align-items:center;gap:6px;font-size:13px;">';
            echo '<input type="checkbox" name="' . esc_attr($key) . '" value="1" ' . $checked . ' />';
            echo esc_html($label);
            echo '</label>';
        }
        echo '</div>';

        // Skills repeater
        echo '<hr style="margin:16px 0;" /><h4 style="margin:0 0 12px;">スキル要件</h4>';

        foreach ($skills_fields as $key => $label) {
            $items = get_field($key, $post->ID) ?: [];
            echo '<div style="margin-bottom:16px;">';
            echo '<label style="font-weight:600;font-size:12px;display:block;margin-bottom:4px;">' . esc_html($label) . '</label>';
            echo '<div id="' . esc_attr($key) . '_container">';
            if (!empty($items)) {
                foreach ($items as $i => $item) {
                    $skill = is_array($item) ? ($item['skill'] ?? '') : $item;
                    echo '<div style="display:flex;gap:6px;margin-bottom:6px;">';
                    echo '<input type="text" name="' . esc_attr($key) . '[]" value="' . esc_attr($skill) . '" style="flex:1;padding:5px 8px;" placeholder="スキル名を入力" />';
                    echo '<button type="button" onclick="this.parentElement.remove()" style="padding:4px 10px;background:#dc3232;color:white;border:none;border-radius:4px;cursor:pointer;">×</button>';
                    echo '</div>';
                }
            } else {
                echo '<div style="display:flex;gap:6px;margin-bottom:6px;">';
                echo '<input type="text" name="' . esc_attr($key) . '[]" value="" style="flex:1;padding:5px 8px;" placeholder="スキル名を入力" />';
                echo '<button type="button" onclick="this.parentElement.remove()" style="padding:4px 10px;background:#dc3232;color:white;border:none;border-radius:4px;cursor:pointer;">×</button>';
                echo '</div>';
            }
            echo '</div>';
            echo '<button type="button" onclick="addSkillRow(\'' . esc_attr($key) . '\')" style="padding:4px 12px;background:#2271b1;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">+ 追加</button>';
            echo '</div>';
        }
        ?>
        <script>
        function addSkillRow(containerId) {
            var container = document.getElementById(containerId + '_container');
            var div = document.createElement('div');
            div.style.display = 'flex';
            div.style.gap = '6px';
            div.style.marginBottom = '6px';
            div.innerHTML = '<input type="text" name="' + containerId + '[]" value="" style="flex:1;padding:5px 8px;" placeholder="スキル名を入力" />' +
                '<button type="button" onclick="this.parentElement.remove()" style="padding:4px 10px;background:#dc3232;color:white;border:none;border-radius:4px;cursor:pointer;">×</button>';
            container.appendChild(div);
        }
        </script>
        <?php
    }

    /**
     * 保存案件元数据
     */
    public function save_case_meta($post_id, $post) {
        if (!isset($_POST['sap_case_meta_nonce']) || !wp_verify_nonce($_POST['sap_case_meta_nonce'], 'sap_case_meta')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        // Save text/number fields
        $text_fields = [
            'case_rate_min', 'case_rate_max', 'case_period', 'case_utilization',
            'case_location', 'case_remote', 'case_experience', 'case_seats',
            'case_company', 'case_blurb',
        ];
        foreach ($text_fields as $key) {
            if (isset($_POST[$key])) {
                update_post_meta($post_id, $key, sanitize_text_field($_POST[$key]));
            }
        }

        // Save toggle fields
        foreach (['case_urgent', 'case_scarce'] as $key) {
            update_post_meta($post_id, $key, isset($_POST[$key]) ? '1' : '0');
        }

        // Save skills as ACF-compatible repeater format
        foreach (['case_skills_must', 'case_skills_want'] as $key) {
            $skills = isset($_POST[$key]) ? (array) $_POST[$key] : [];
            $skills = array_filter(array_map('sanitize_text_field', $skills));
            $repeater = [];
            foreach ($skills as $s) {
                $repeater[] = ['skill' => $s];
            }
            update_post_meta($post_id, $key, $repeater);
            // Also save flat array for easy access
            update_post_meta($post_id, $key . '_flat', array_values($skills));
        }
    }

    // ==================== Lesson Meta Box ====================

    public function add_lesson_meta_box() {
        add_meta_box('sap_lesson_details', 'レッスン設定', [$this, 'render_lesson_meta_box'], 'lesson', 'side', 'default');
    }

    public function render_lesson_meta_box($post) {
        wp_nonce_field('sap_lesson_meta', 'sap_lesson_meta_nonce');
        $course_id = get_post_meta($post->ID, 'lesson_course_id', true);
        $order = get_post_meta($post->ID, 'lesson_order', true);
        $time = get_post_meta($post->ID, 'lesson_time', true);
        $courses = get_posts(['post_type' => 'course', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC']);
        ?>
        <p><label style="font-weight:600;font-size:12px;">所属コース</label>
        <select name="lesson_course_id" style="width:100%;margin-top:4px;">
            <option value="">選択してください</option>
            <?php foreach ($courses as $c): ?>
                <option value="<?php echo $c->ID; ?>" <?php selected($course_id, $c->ID); ?>><?php echo esc_html($c->post_title); ?></option>
            <?php endforeach; ?>
        </select></p>
        <p><label style="font-weight:600;font-size:12px;">順序</label>
        <input type="number" name="lesson_order" value="<?php echo esc_attr($order ?: 0); ?>" min="0" step="1" style="width:80px;margin-top:4px;" /></p>
        <p><label style="font-weight:600;font-size:12px;">所要時間</label>
        <input type="text" name="lesson_time" value="<?php echo esc_attr($time ?: ''); ?>" placeholder="例: 20 min" style="width:100%;margin-top:4px;" /></p>
        <?php
    }

    public function save_lesson_meta($post_id, $post) {
        if (!isset($_POST['sap_lesson_meta_nonce']) || !wp_verify_nonce($_POST['sap_lesson_meta_nonce'], 'sap_lesson_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        if (isset($_POST['lesson_course_id'])) update_post_meta($post_id, 'lesson_course_id', (int) $_POST['lesson_course_id']);
        if (isset($_POST['lesson_order'])) update_post_meta($post_id, 'lesson_order', (int) $_POST['lesson_order']);
        if (isset($_POST['lesson_time'])) update_post_meta($post_id, 'lesson_time', sanitize_text_field($_POST['lesson_time']));
    }

    public function lesson_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'title') { $new[$k] = 'レッスン名'; $new['course'] = '所属コース'; $new['order'] = '順序'; $new['time'] = '時間'; continue; }
            $new[$k] = $v;
        }
        return $new;
    }

    public function lesson_columns_content($column, $post_id) {
        if ($column === 'course') {
            $cid = get_post_meta($post_id, 'lesson_course_id', true);
            if ($cid) { $c = get_post($cid); echo $c ? esc_html($c->post_title) : '--'; }
            else echo '--';
        }
        if ($column === 'order') echo (int) get_post_meta($post_id, 'lesson_order', true);
        if ($column === 'time') echo esc_html(get_post_meta($post_id, 'lesson_time', true) ?: '--');
    }
}
