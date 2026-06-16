<?php
/**
 * SAP Panda Taxonomy Meta — 模块分类法扩展字段
 * 为 sap_module 添加颜色/图标/描述等后台编辑 + 列表展示
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_Taxonomy_Meta {

    public function register() {
        $this->register_term_meta();

        if (is_admin()) {
            // 编辑表单字段
            add_action('sap_module_add_form_fields', [$this, 'add_form_fields']);
            add_action('sap_module_edit_form_fields', [$this, 'edit_form_fields'], 10, 2);
            add_action('created_sap_module', [$this, 'save_term_meta'], 10, 2);
            add_action('edited_sap_module', [$this, 'save_term_meta'], 10, 2);
            add_action('admin_enqueue_scripts', [$this, 'enqueue_color_picker']);

            // 列表自定义列
            add_filter('manage_edit-sap_module_columns', [$this, 'custom_columns']);
            add_filter('manage_sap_module_custom_column', [$this, 'custom_column_content'], 10, 3);
            add_filter('manage_edit-sap_module_sortable_columns', [$this, 'sortable_columns']);
        }
    }

    public function register_term_meta() {
        $fields = [
            'module_color'       => ['type' => 'string', 'desc' => '模块主色'],
            'module_bg_color'    => ['type' => 'string', 'desc' => '模块背景色'],
            'module_icon'        => ['type' => 'string', 'desc' => '模块图标'],
            'module_order'       => ['type' => 'integer','desc' => '排序'],
            'module_en_name'     => ['type' => 'string', 'desc' => '英文名'],
            'module_description' => ['type' => 'string', 'desc' => '简要描述'],
            'module_levels'      => ['type' => 'string', 'desc' => '学习级别'],
        ];
        foreach ($fields as $key => $cfg) {
            register_term_meta('sap_module', $key, [
                'show_in_rest' => true,
                'single'       => true,
                'type'         => $cfg['type'],
                'description'  => $cfg['desc'],
            ]);
        }
    }

    // ========== 列表列 ==========

    public function custom_columns($columns) {
        $new = [];
        foreach ($columns as $k => $v) {
            if ($k === 'name') {
                $new[$k] = $v;
                $new['module_icon']   = 'アイコン';
                $new['module_color']  = '表示色';
                $new['module_order']  = '順序';
                $new['module_articles'] = '記事数';
                $new['module_courses']  = 'コース数';
                continue;
            }
            if ($k === 'posts') continue;
            $new[$k] = $v;
        }
        $new['posts'] = '投稿';
        return $new;
    }

    public function custom_column_content($content, $column, $term_id) {
        switch ($column) {
            case 'module_icon':
                $icon = get_term_meta($term_id, 'module_icon', true) ?: '';
                $color = get_term_meta($term_id, 'module_color', true) ?: '#5a9d6e';
                $bg = get_term_meta($term_id, 'module_bg_color', true) ?: '#d8ead9';
                return '<span style="display:inline-block;padding:2px 12px;border-radius:4px;background:'
                    . esc_attr($bg) . ';color:' . esc_attr($color) . ';font-weight:800;font-size:13px;'
                    . 'font-family:monospace;border:1px solid ' . esc_attr($color) . ';">'
                    . esc_html($icon ?: strtoupper(substr(get_term($term_id)->slug, 0, 2))) . '</span>';

            case 'module_color':
                $color = get_term_meta($term_id, 'module_color', true) ?: '#5a9d6e';
                $bg = get_term_meta($term_id, 'module_bg_color', true) ?: '#d8ead9';
                return '<span style="display:inline-flex;align-items:center;gap:6px;">'
                    . '<span style="width:16px;height:16px;border-radius:3px;background:' . esc_attr($color) . ';border:1px solid #ddd;"></span>'
                    . '<code style="font-size:11px;">' . esc_html($color) . '</code>'
                    . ' <span style="width:16px;height:16px;border-radius:3px;background:' . esc_attr($bg) . ';border:1px solid #ddd;"></span>'
                    . '<code style="font-size:11px;">' . esc_html($bg) . '</code></span>';

            case 'module_order':
                $order = (int) get_term_meta($term_id, 'module_order', true);
                return $order ? '<span style="font-family:monospace;font-size:14px;font-weight:700;">' . $order . '</span>' : '—';

            case 'module_articles':
                $term = get_term($term_id);
                $count = new WP_Query([
                    'post_type' => 'post', 'post_status' => 'publish',
                    'tax_query' => [['taxonomy' => 'sap_module', 'field' => 'term_id', 'terms' => $term_id]],
                    'fields' => 'ids', 'posts_per_page' => -1,
                ]);
                return '<span style="font-weight:600;">' . $count->found_posts . '</span>';

            case 'module_courses':
                $count = new WP_Query([
                    'post_type' => 'course', 'post_status' => 'publish',
                    'tax_query' => [['taxonomy' => 'sap_module', 'field' => 'term_id', 'terms' => $term_id]],
                    'fields' => 'ids', 'posts_per_page' => -1,
                ]);
                return '<span style="font-weight:600;">' . $count->found_posts . '</span>';
        }
        return $content;
    }

    public function sortable_columns($columns) {
        $columns['module_order'] = 'module_order';
        $columns['module_articles'] = 'module_articles';
        return $columns;
    }

    // ========== 颜色选择器 ==========

    public function enqueue_color_picker($hook) {
        if ($hook !== 'edit-tags.php' && $hook !== 'term.php') return;
        $screen = get_current_screen();
        if (!$screen || $screen->taxonomy !== 'sap_module') return;
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        add_action('admin_footer', function() {
            echo '<script>jQuery(function($){$(".color-picker").wpColorPicker();});</script>';
        });
    }

    // ========== 新建/编辑表单字段 ==========

    public function add_form_fields($taxonomy) { ?>
        <div class="form-field term-group">
            <label for="module_color">表示色</label>
            <input type="text" id="module_color" name="module_color" class="color-picker" value="#5a9d6e" data-default-color="#5a9d6e" />
        </div>
        <div class="form-field term-group">
            <label for="module_bg_color">背景色</label>
            <input type="text" id="module_bg_color" name="module_bg_color" class="color-picker" value="#d8ead9" data-default-color="#d8ead9" />
        </div>
        <div class="form-field term-group">
            <label for="module_icon">アイコン文字</label>
            <input type="text" id="module_icon" name="module_icon" value="" placeholder="例: FI" style="max-width:100px;" />
            <p style="font-size:11px;color:#646970;margin:4px 0 0;">前端卡片显示的模块缩写</p>
        </div>
        <div class="form-field term-group">
            <label for="module_en_name">英文名</label>
            <input type="text" id="module_en_name" name="module_en_name" value="" placeholder="例: Financial Accounting" style="max-width:250px;" />
        </div>
        <div class="form-field term-group">
            <label for="module_description">簡要説明</label>
            <textarea id="module_description" name="module_description" rows="2" style="width:100%;"></textarea>
        </div>
        <div class="form-field term-group">
            <label for="module_order">並び順</label>
            <input type="number" id="module_order" name="module_order" value="0" min="0" max="99" style="max-width:80px;" />
        </div>
        <div class="form-field term-group">
            <label>学習レベル（複数選択可）</label>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;">
                <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="初級"> 初級</label>
                <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="中級"> 中級</label>
                <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="上級"> 上級</label>
            </div>
        </div>
    <?php }

    public function edit_form_fields($term, $taxonomy) {
        $color    = get_term_meta($term->term_id, 'module_color', true) ?: '#5a9d6e';
        $bg_color = get_term_meta($term->term_id, 'module_bg_color', true) ?: '#d8ead9';
        $icon     = get_term_meta($term->term_id, 'module_icon', true);
        $order    = get_term_meta($term->term_id, 'module_order', true);
        $en_name  = get_term_meta($term->term_id, 'module_en_name', true);
        $desc     = get_term_meta($term->term_id, 'module_description', true);
        ?>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_color">表示色</label></th>
            <td><input type="text" id="module_color" name="module_color" class="color-picker" value="<?php echo esc_attr($color); ?>" data-default-color="#5a9d6e" /></td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_bg_color">背景色</label></th>
            <td><input type="text" id="module_bg_color" name="module_bg_color" class="color-picker" value="<?php echo esc_attr($bg_color); ?>" data-default-color="#d8ead9" /></td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_icon">アイコン文字</label></th>
            <td><input type="text" id="module_icon" name="module_icon" value="<?php echo esc_attr($icon); ?>" placeholder="例: FI" style="max-width:100px;" />
                <p style="font-size:11px;color:#646970;margin:4px 0 0;">前端卡片显示的模块缩写</p>
            </td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_en_name">英文名</label></th>
            <td><input type="text" id="module_en_name" name="module_en_name" value="<?php echo esc_attr($en_name); ?>" placeholder="例: Financial Accounting" style="max-width:250px;" /></td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_description">簡要説明</label></th>
            <td><textarea id="module_description" name="module_description" rows="2" style="width:100%;"><?php echo esc_textarea($desc); ?></textarea></td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label for="module_order">並び順</label></th>
            <td><input type="number" id="module_order" name="module_order" value="<?php echo esc_attr($order); ?>" min="0" max="99" style="max-width:80px;" /></td>
        </tr>
        <tr class="form-field term-group-wrap">
            <th scope="row"><label>学習レベル</label></th>
            <td>
                <?php $levels = get_term_meta($term->term_id, 'module_levels', true) ?: []; if (is_string($levels)) $levels = explode(',', $levels); ?>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="初級" <?php echo in_array('初級', $levels) ? 'checked' : ''; ?>> 初級</label>
                    <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="中級" <?php echo in_array('中級', $levels) ? 'checked' : ''; ?>> 中級</label>
                    <label style="font-weight:400;font-size:13px;"><input type="checkbox" name="module_levels[]" value="上級" <?php echo in_array('上級', $levels) ? 'checked' : ''; ?>> 上級</label>
                </div>
            </td>
        </tr>
    <?php }

    // ========== 保存 ==========

    public function save_term_meta($term_id, $tt_id) {
        if (!current_user_can('manage_categories')) return;
        foreach (['module_color', 'module_bg_color', 'module_icon', 'module_en_name'] as $key) {
            if (isset($_POST[$key])) {
                update_term_meta($term_id, $key, sanitize_text_field($_POST[$key]));
            }
        }
        if (isset($_POST['module_description'])) {
            update_term_meta($term_id, 'module_description', sanitize_textarea_field($_POST['module_description']));
        }
        if (isset($_POST['module_order'])) {
            update_term_meta($term_id, 'module_order', (int) $_POST['module_order']);
        }
        if (isset($_POST['module_levels']) && is_array($_POST['module_levels'])) {
            $levels = array_map('sanitize_text_field', $_POST['module_levels']);
            update_term_meta($term_id, 'module_levels', implode(',', $levels));
        } else {
            delete_term_meta($term_id, 'module_levels');
        }
    }
}
