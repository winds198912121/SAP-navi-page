<?php
/**
 * SAP Panda Admin — 后台管理页面
 * 案件投递管理、统计概览
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_Admin {

    public function register() {
        add_action('admin_menu', [$this, 'add_admin_menu'], 30);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);
    }

    public function add_admin_menu() {
        add_submenu_page(
            'edit.php?post_type=sap_case',
            '応募管理',
            '応募管理',
            'manage_options',
            'sap-case-applications',
            [$this, 'render_applications_page']
        );
    }

    public function enqueue_styles($hook) {
        if (strpos($hook, 'sap-case') === false) return;
        echo '<style>
            .sap-admin-wrap { max-width: 1200px; margin: 20px 0; }
            .sap-admin-wrap .page-title { font-size: 23px; font-weight: 400; margin: 0 0 16px; padding: 0; }
            .sap-table-wrap { background: #fff; border: 1px solid #c3c4c7; border-radius: 4px; overflow: hidden; }
            .sap-table-wrap table { width: 100%; border-collapse: collapse; }
            .sap-table-wrap th { background: #f0f0f1; text-align: left; padding: 10px 12px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #c3c4c7; white-space: nowrap; }
            .sap-table-wrap td { padding: 10px 12px; border-bottom: 1px solid #f0f0f1; font-size: 13px; vertical-align: middle; }
            .sap-table-wrap tr:hover td { background: #f6f7f7; }
            .sap-table-wrap .column-status { width: 100px; }
            .sap-badge { display: inline-block; padding: 2px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; letter-spacing: 0.03em; }
            .sap-badge.pending { background: #fff8e5; color: #996b00; border: 1px solid #f0c33c; }
            .sap-badge.contacted { background: #e5f5fa; color: #0071a1; border: 1px solid #72aee6; }
            .sap-badge.approved { background: #edfaef; color: #007017; border: 1px solid #68de7c; }
            .sap-badge.rejected { background: #fcf0f1; color: #8a2424; border: 1px solid #e65054; }
            .sap-stat-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 20px; }
            .sap-stat-card { background: #fff; border: 1px solid #c3c4c7; border-radius: 4px; padding: 16px 20px; }
            .sap-stat-card .num { font-size: 28px; font-weight: 700; color: #1d2327; line-height: 1.2; }
            .sap-stat-card .label { font-size: 12px; color: #646970; margin-top: 2px; }
            .sap-status-select { padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .sap-actions { display: flex; gap: 4px; }
            .sap-actions a, .sap-actions button { text-decoration: none; font-size: 12px; padding: 2px 8px; border: 1px solid #c3c4c7; border-radius: 3px; background: #f6f7f7; cursor: pointer; }
            .sap-actions button:hover { background: #f0f0f1; }
            .sap-detail-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100000; }
            .sap-detail-modal.open { display: block; }
            .sap-detail-content { background: #fff; max-width: 600px; margin: 60px auto; padding: 24px 28px; border-radius: 6px; position: relative; max-height: 80vh; overflow-y: auto; }
            .sap-detail-content h3 { margin: 0 0 16px; font-size: 18px; }
            .sap-detail-content .row { display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f1; font-size: 13px; }
            .sap-detail-content .row .k { width: 120px; color: #646970; font-weight: 600; flex-shrink: 0; }
            .sap-detail-content .row .v { flex: 1; color: #1d2327; }
            .sap-detail-close { position: absolute; top: 12px; right: 16px; font-size: 22px; cursor: pointer; color: #646970; background: none; border: none; }
        </style>';
    }

    public function render_applications_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'case_applications';

        // Handle status update
        if (isset($_POST['sap_update_status']) && isset($_POST['application_id']) && isset($_POST['status'])) {
            check_admin_referer('sap_update_status');
            $app_id = (int) $_POST['application_id'];
            $status = sanitize_text_field($_POST['status']);
            $allowed_statuses = ['pending', 'contacted', 'approved', 'rejected'];
            if (in_array($status, $allowed_statuses)) {
                $wpdb->update($table, ['status' => $status], ['id' => $app_id]);
                echo '<div class="notice notice-success is-dismissible"><p>ステータスを更新しました。</p></div>';
            }
        }

        // Handle delete
        if (isset($_POST['sap_delete_application']) && isset($_POST['application_id'])) {
            check_admin_referer('sap_delete_application');
            $app_id = (int) $_POST['application_id'];
            $wpdb->delete($table, ['id' => $app_id]);
            echo '<div class="notice notice-success is-dismissible"><p>応募を削除しました。</p></div>';
        }

        // Filters
        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';

        // Stats
        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");
        $pending = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE status = 'pending'");
        $contacted = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE status = 'contacted'");
        $approved = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE status = 'approved'");

        // Query
        $where = '1=1';
        $params = [];
        if ($status_filter) {
            $where .= ' AND a.status = %s';
            $params[] = $status_filter;
        }
        if ($search) {
            $where .= ' AND (a.applicant_name LIKE %s OR a.applicant_email LIKE %s)';
            $params[] = '%' . $wpdb->esc_like($search) . '%';
            $params[] = '%' . $wpdb->esc_like($search) . '%';
        }

        $sql = "SELECT a.*, p.post_title as case_title
                FROM {$table} a
                LEFT JOIN {$wpdb->posts} p ON a.case_id = p.ID
                WHERE {$where}
                ORDER BY a.created_at DESC
                LIMIT 100";
        if (!empty($params)) {
            $sql = $wpdb->prepare($sql, $params);
        }
        $applications = $wpdb->get_results($sql);

        $status_labels = [
            'pending'   => '未対応',
            'contacted' => '連絡済',
            'approved'  => '成約',
            'rejected'  => '不採用',
        ];
        ?>
        <div class="wrap sap-admin-wrap">
            <h1 class="page-title">📋 案件応募管理</h1>

            <div class="sap-stat-cards">
                <div class="sap-stat-card"><div class="num"><?php echo $total; ?></div><div class="label">全応募</div></div>
                <div class="sap-stat-card"><div class="num"><?php echo $pending; ?></div><div class="label">未対応</div></div>
                <div class="sap-stat-card"><div class="num"><?php echo $contacted; ?></div><div class="label">連絡済</div></div>
                <div class="sap-stat-card"><div class="num"><?php echo $approved; ?></div><div class="label">成約</div></div>
            </div>

            <form method="get" style="margin-bottom:16px;display:flex;gap:8px;">
                <input type="hidden" name="post_type" value="sap_case" />
                <input type="hidden" name="page" value="sap-case-applications" />
                <select name="status" style="padding:4px 8px;">
                    <option value="">すべてのステータス</option>
                    <?php foreach ($status_labels as $k => $l): ?>
                        <option value="<?php echo $k; ?>" <?php selected($status_filter, $k); ?>><?php echo $l; ?></option>
                    <?php endforeach; ?>
                </select>
                <input type="text" name="s" value="<?php echo esc_attr($search); ?>" placeholder="名前・メールで検索" style="padding:4px 8px;min-width:200px;" />
                <button type="submit" class="button">絞り込み</button>
                <a href="<?php echo admin_url('edit.php?post_type=sap_case&page=sap-case-applications'); ?>" class="button">クリア</a>
            </form>

            <div class="sap-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>応募者名</th>
                            <th>メール</th>
                            <th>電話</th>
                            <th>案件名</th>
                            <th>希望単価</th>
                            <th>経験</th>
                            <th>履歴書</th>
                            <th>ステータス</th>
                            <th>応募日</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($applications)): ?>
                            <tr><td colspan="11" style="text-align:center;color:#646970;padding:40px;">応募データがありません。</td></tr>
                        <?php else: ?>
                            <?php foreach ($applications as $app): ?>
                                <tr>
                                    <td><?php echo $app->id; ?></td>
                                    <td><strong><?php echo esc_html($app->applicant_name); ?></strong></td>
                                    <td><a href="mailto:<?php echo esc_attr($app->applicant_email); ?>"><?php echo esc_html($app->applicant_email); ?></a></td>
                                    <td><?php echo esc_html($app->applicant_phone ?: '—'); ?></td>
                                    <td>
                                        <?php if ($app->case_id): ?>
                                            <a href="<?php echo admin_url('post.php?post=' . $app->case_id . '&action=edit'); ?>">
                                                <?php echo esc_html(mb_substr($app->case_title ?: '(削除済み)', 0, 30)); ?>
                                            </a>
                                        <?php else: ?>
                                            (削除済み)
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo esc_html($app->expected_rate ?: '—'); ?></td>
                                    <td><?php echo esc_html($app->experience_years ?: '—'); ?></td>
                                    <td>
                                        <?php if ($app->resume_file): ?>
                                            <a href="<?php echo esc_url($app->resume_file); ?>" target="_blank" class="button button-small">📎 開く</a>
                                        <?php else: ?>
                                            —
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="sap-badge <?php echo $app->status ?: 'pending'; ?>">
                                            <?php echo $status_labels[$app->status] ?? '未対応'; ?>
                                        </span>
                                    </td>
                                    <td style="font-size:11px;color:#646970;white-space:nowrap;">
                                        <?php echo date('m/d H:i', strtotime($app->created_at)); ?>
                                    </td>
                                    <td class="sap-actions">
                                        <button type="button" onclick="showAppDetail(<?php echo $app->id; ?>)" title="詳細">👁</button>
                                        <form method="post" style="display:inline;">
                                            <?php wp_nonce_field('sap_update_status'); ?>
                                            <input type="hidden" name="application_id" value="<?php echo $app->id; ?>" />
                                            <input type="hidden" name="sap_update_status" value="1" />
                                            <select name="status" onchange="this.form.submit()" class="sap-status-select">
                                                <?php foreach ($status_labels as $k => $l): ?>
                                                    <option value="<?php echo $k; ?>" <?php selected($app->status, $k); ?>><?php echo $l; ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </form>
                                        <form method="post" style="display:inline;" onsubmit="return confirm('本当に削除しますか？');">
                                            <?php wp_nonce_field('sap_delete_application'); ?>
                                            <input type="hidden" name="application_id" value="<?php echo $app->id; ?>" />
                                            <input type="hidden" name="sap_delete_application" value="1" />
                                            <button type="submit" title="削除" style="color:#cc1818;">🗑</button>
                                        </form>
                                    </td>
                                </tr>
                                <!-- Detail hidden row -->
                                <tr id="detail-<?php echo $app->id; ?>" style="display:none;">
                                    <td colspan="11" style="background:#f8f8f8;padding:16px 24px;">
                                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:700px;">
                                            <div><strong>スキル:</strong> <?php echo esc_html(implode(', ', (array) maybe_unserialize($app->skill_modules ?: '[]'))); ?></div>
                                            <div><strong>希望稼働:</strong> <?php echo esc_html($app->start_timing ?? '未指定'); ?></div>
                                            <div colspan="2" style="grid-column:1/-1;"><strong>自己PR:</strong><br /><?php echo nl2br(esc_html($app->self_pr ?: 'なし')); ?></div>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <script>
        function showAppDetail(id) {
            var tr = document.getElementById('detail-' + id);
            if (tr) tr.style.display = tr.style.display === 'none' ? 'table-row' : 'none';
        }
        </script>
        <?php
    }
}
