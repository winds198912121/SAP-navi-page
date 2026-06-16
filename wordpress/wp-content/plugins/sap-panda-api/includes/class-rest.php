<?php
/**
 * REST API Endpoints for SAP Panda
 * @package SAP_Panda_API
 */
class SAP_Panda_REST {
    public function register_routes() {
        // Articles
        register_rest_route('sap/v1', '/articles', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_article($r) : $this->get_articles($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); $s = $r->get_param('status'); if (in_array($s, ['all', 'draft'])) return $this->check_admin(); return true; },
        ]);
        register_rest_route('sap/v1', '/articles/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_article($r) : ($m === 'DELETE' ? $this->delete_article($r) : $this->get_article($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/articles/popular', ['methods' => 'GET', 'callback' => [$this, 'get_popular_articles'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/articles/search', ['methods' => 'GET', 'callback' => [$this, 'search_articles'], 'permission_callback' => '__return_true']);
        // Modules
        register_rest_route('sap/v1', '/modules', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_module($r) : $this->get_modules(); },
            'permission_callback' => function($r) { return $r->get_method() === 'POST' ? $this->check_admin() : true; },
        ]);
        register_rest_route('sap/v1', '/modules/(?P<slug>[a-z0-9-]+)', [
            'methods' => ['GET', 'PUT'],
            'callback' => function($r) { return $r->get_method() === 'PUT' ? $this->update_module($r) : $this->get_module($r); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/modules/(?P<slug>[a-z0-9-]+)/articles', ['methods' => 'GET', 'callback' => [$this, 'get_module_articles'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/modules/(?P<slug>[a-z0-9-]+)/content', ['methods' => 'GET', 'callback' => [$this, 'get_module_content'], 'permission_callback' => '__return_true']);
        // Courses
        register_rest_route('sap/v1', '/courses', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_course($r) : $this->get_courses($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); $s = $r->get_param('status'); if (in_array($s, ['all', 'draft'])) return $this->check_admin(); return true; },
        ]);
        register_rest_route('sap/v1', '/courses/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_course($r) : ($m === 'DELETE' ? $this->delete_course($r) : $this->get_course($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/courses/(?P<course_id>\d+)/lessons', ['methods' => 'GET', 'callback' => [$this, 'get_course_lessons'], 'permission_callback' => '__return_true']);
        // Lessons
        register_rest_route('sap/v1', '/lessons', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_lesson($r) : $this->get_all_lessons($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); return $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/lessons/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_lesson($r) : ($m === 'DELETE' ? $this->delete_lesson($r) : $this->get_lesson($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        // Learning Paths
        register_rest_route('sap/v1', '/learning-paths', ['methods' => 'GET', 'callback' => [$this, 'get_learning_paths'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/learning-paths/(?P<id>\d+)', ['methods' => 'GET', 'callback' => [$this, 'get_learning_path'], 'permission_callback' => '__return_true']);
        // Steps
        register_rest_route('sap/v1', '/steps', ['methods' => 'GET', 'callback' => [$this, 'get_steps'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/steps/(?P<id>\d+)', ['methods' => 'GET', 'callback' => [$this, 'get_step'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/learning-paths/(?P<path_id>\d+)/steps', ['methods' => 'GET', 'callback' => [$this, 'get_path_steps'], 'permission_callback' => '__return_true']);
        // Videos
        register_rest_route('sap/v1', '/videos', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_video($r) : $this->get_videos($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); return true; },
        ]);
        register_rest_route('sap/v1', '/videos/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_video($r) : ($m === 'DELETE' ? $this->delete_video($r) : $this->get_video($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        // Knowledge
        register_rest_route('sap/v1', '/knowledge', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_knowledge($r) : $this->get_knowledge($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); $s = $r->get_param('status'); if (in_array($s, ['all', 'draft'])) return $this->check_admin(); return true; },
        ]);
        register_rest_route('sap/v1', '/knowledge/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_knowledge($r) : ($m === 'DELETE' ? $this->delete_knowledge($r) : $this->get_knowledge_detail($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        // Quizzes
        register_rest_route('sap/v1', '/quizzes/today', ['methods' => 'GET', 'callback' => [$this, 'get_today_quiz'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/quizzes', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_quiz($r) : $this->get_all_quizzes($r); },
            'permission_callback' => function() { return $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/quizzes/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_quiz($r) : ($m === 'DELETE' ? $this->delete_quiz($r) : $this->get_quiz($r)); },
            'permission_callback' => function() { return $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/quizzes/(?P<id>\d+)/answer', ['methods' => 'POST', 'callback' => [$this, 'submit_quiz_answer'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/quizzes/stats', ['methods' => 'GET', 'callback' => [$this, 'get_quiz_stats'], 'permission_callback' => '__return_true']);
        // Cases
        register_rest_route('sap/v1', '/cases', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) { return $r->get_method() === 'POST' ? $this->create_case($r) : $this->get_cases($r); },
            'permission_callback' => function($r) { if ($r->get_method() === 'POST') return $this->check_admin(); $s = $r->get_param('status'); if (in_array($s, ['all', 'draft'])) return $this->check_admin(); return true; },
        ]);
        register_rest_route('sap/v1', '/cases/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_case($r) : ($m === 'DELETE' ? $this->delete_case($r) : $this->get_case($r)); },
            'permission_callback' => function($r) { return $r->get_method() === 'GET' ? true : $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/cases/(?P<id>\d+)/apply', ['methods' => 'POST', 'callback' => [$this, 'apply_case'], 'permission_callback' => '__return_true']);
        // Users
        register_rest_route('sap/v1', '/users', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) {
                if ($r->get_method() === 'POST') return $this->create_user($r);
                return $this->get_all_users($r);
            },
            'permission_callback' => function() { return $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/users/(?P<id>\d+)', [
            'methods' => ['GET', 'PUT', 'DELETE'],
            'callback' => function($r) { $m = $r->get_method(); return $m === 'PUT' ? $this->update_user($r) : ($m === 'DELETE' ? $this->delete_user($r) : $this->get_user($r)); },
            'permission_callback' => function() { return $this->check_admin(); },
        ]);
        register_rest_route('sap/v1', '/users/(?P<id>\d+)/reset-password', [
            'methods' => 'POST',
            'callback' => [$this, 'reset_user_password'],
            'permission_callback' => function() { return $this->check_admin(); },
        ]);
        // Site pages
        register_rest_route('sap/v1', '/pages', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) {
                if ($r->get_method() === 'POST') return $this->update_site_page($r);
                return $this->get_site_pages($r);
            },
            'permission_callback' => function($r) {
                if ($r->get_method() === 'POST') return $this->check_admin();
                return true;
            },
        ]);
        register_rest_route('sap/v1', '/users/me', ['methods' => ['GET', 'PUT'], 'callback' => [$this, 'user_me'], 'permission_callback' => [$this, 'check_auth']]);
        register_rest_route('sap/v1', '/users/me/bookmarks', ['methods' => ['GET', 'POST', 'DELETE'], 'callback' => [$this, 'user_bookmarks'], 'permission_callback' => [$this, 'check_auth']]);
        // Points
        register_rest_route('sap/v1', '/points', ['methods' => 'GET', 'callback' => [$this, 'get_points'], 'permission_callback' => [$this, 'check_auth']]);
        register_rest_route('sap/v1', '/points/daily', ['methods' => 'POST', 'callback' => [$this, 'claim_daily_points'], 'permission_callback' => [$this, 'check_auth']]);
        // Membership
        register_rest_route('sap/v1', '/membership/plans', ['methods' => 'GET', 'callback' => [$this, 'get_membership_plans'], 'permission_callback' => '__return_true']);
        register_rest_route('sap/v1', '/membership/subscribe', ['methods' => 'POST', 'callback' => [$this, 'subscribe_membership'], 'permission_callback' => [$this, 'check_auth']]);
        register_rest_route('sap/v1', '/membership/current', ['methods' => 'GET', 'callback' => [$this, 'get_current_membership'], 'permission_callback' => [$this, 'check_auth']]);
        register_rest_route('sap/v1', '/membership/webhook', ['methods' => 'POST', 'callback' => [$this, 'stripe_webhook'], 'permission_callback' => '__return_true']);
        // Applications
        register_rest_route('sap/v1', '/applications', [
            'methods' => ['GET', 'POST'],
            'callback' => function($r) {
                if ($r->get_method() === 'POST') return $this->update_application_status($r);
                return $this->get_applications($r);
            },
            'permission_callback' => [$this, 'check_admin'],
        ]);
        // Media upload
        register_rest_route('sap/v1', '/media/upload', ['methods' => 'POST', 'callback' => [$this, 'upload_media'], 'permission_callback' => [$this, 'check_admin']]);
        // Sitemap
        register_rest_route('sap/v1', '/sitemap', ['methods' => 'GET', 'callback' => [$this, 'generate_sitemap'], 'permission_callback' => '__return_true']);
        // Admin Dashboard Stats
        register_rest_route('sap/v1', '/admin/stats', ['methods' => 'GET', 'callback' => [$this, 'get_admin_stats'], 'permission_callback' => [$this, 'check_admin']]);
        // Contact inquiries
        register_rest_route('sap/v1', '/contact', ['methods' => 'POST', 'callback' => [$this, 'submit_contact'], 'permission_callback' => '__return_true']);
        // Plugin Management
        register_rest_route('sap/v1', '/admin/plugins', ['methods' => 'GET', 'callback' => [$this, 'get_plugins_list'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/plugins/activate', ['methods' => 'POST', 'callback' => [$this, 'activate_plugin'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/plugins/deactivate', ['methods' => 'POST', 'callback' => [$this, 'deactivate_plugin'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/contact/inquiries', ['methods' => 'GET', 'callback' => [$this, 'get_contact_inquiries'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/contact/inquiries/(?P<id>\d+)', ['methods' => ['GET', 'PUT'], 'callback' => [$this, 'handle_contact_inquiry'], 'permission_callback' => [$this, 'check_admin']]);
        // Admin SEO / GEO settings
        register_rest_route('sap/v1', '/admin/seo-settings', ['methods' => ['GET', 'PUT'], 'callback' => [$this, 'handle_seo_settings'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/seo-keywords', ['methods' => ['GET', 'POST', 'DELETE'], 'callback' => [$this, 'handle_seo_keywords'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/faq-schemas', ['methods' => ['GET', 'POST'], 'callback' => [$this, 'handle_faq_schemas'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/faq-schemas/(?P<id>\d+)', ['methods' => ['PUT', 'DELETE'], 'callback' => [$this, 'handle_faq_schema_item'], 'permission_callback' => [$this, 'check_admin']]);
        register_rest_route('sap/v1', '/admin/seed-videos', ['methods' => 'POST', 'callback' => [$this, 'seed_videos_api'], 'permission_callback' => [$this, 'check_admin']]);
    }

    public function check_auth() { $auth = new SAP_Panda_Auth(); return (bool) $auth->get_user_id_from_request(); }
    public function check_admin() { $auth = new SAP_Panda_Auth(); $uid = $auth->get_user_id_from_request(); return $uid && user_can($uid, 'edit_others_posts'); }
    private function get_current_user_id() { $auth = new SAP_Panda_Auth(); return $auth->get_user_id_from_request(); }

    // ====== ARTICLES ======
    public function get_articles($request) {
        $status = $request->get_param('status') ?: 'publish';
        $args = ['post_type' => 'post', 'posts_per_page' => $request->get_param('per_page') ?: 10, 'paged' => $request->get_param('page') ?: 1, 'post_status' => $status === 'all' ? ['publish', 'draft', 'trash'] : $status];
        if ($m = $request->get_param('module')) $args['tax_query'][] = ['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $m];
        if ($d = $request->get_param('difficulty')) $args['tax_query'][] = ['taxonomy' => 'difficulty', 'field' => 'slug', 'terms' => $d];
        if ($t = $request->get_param('topic')) $args['tax_query'][] = ['taxonomy' => 'topic', 'field' => 'slug', 'terms' => $t];
        $q = new WP_Query($args);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_article'], $q->posts), 'total' => $q->found_posts]);
    }

    public function get_article($request) {
        $post = get_post($request['id']);
        if (!$post || $post->post_status !== 'publish') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $views = (int) get_post_meta($post->ID, 'article_views', true);
        update_post_meta($post->ID, 'article_views', $views + 1);
        $article = $this->format_article($post, true);
        $mods = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'slugs']);
        if (!empty($mods)) { $rq = new WP_Query(['post_type' => 'post', 'posts_per_page' => 4, 'post__not_in' => [$post->ID], 'tax_query' => [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $mods]]]); $article['related_articles'] = array_map([$this, 'format_article'], $rq->posts); }
        return new WP_REST_Response(['success' => true, 'data' => $article]);
    }

    public function get_popular_articles($request) {
        $q = new WP_Query(['post_type' => 'post', 'posts_per_page' => $request->get_param('per_page') ?: 10, 'post_status' => 'publish', 'meta_key' => 'article_views', 'orderby' => 'meta_value_num', 'order' => 'DESC']);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_article'], $q->posts)]);
    }

    public function search_articles($request) {
        $q = $request->get_param('q');
        if (empty($q)) return new WP_REST_Response(['success' => true, 'data' => []]);
        $query = new WP_Query(['post_type' => 'post', 'posts_per_page' => $request->get_param('per_page') ?: 10, 'paged' => $request->get_param('page') ?: 1, 'post_status' => 'publish', 's' => $q]);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_article'], $query->posts)]);
    }

    public function create_article($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $id = wp_insert_post(['post_type' => 'post', 'post_title' => $title, 'post_content' => isset($body['content']) ? wp_kses_post($body['content']) : '', 'post_excerpt' => isset($body['excerpt']) ? sanitize_textarea_field($body['excerpt']) : '', 'post_status' => 'publish', 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['reading_time'])) update_post_meta($id, 'article_reading_time', (int) $body['reading_time']);
        if (isset($body['module'])) wp_set_object_terms($id, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($id, sanitize_text_field($body['difficulty']), 'difficulty');
        if (isset($body['topic'])) wp_set_object_terms($id, sanitize_text_field($body['topic']), 'topic');
        return new WP_REST_Response(['success' => true, 'data' => $this->format_article(get_post($id), true)]);
    }

    public function update_article($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'post') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['content'])) $upd['post_content'] = wp_kses_post($body['content']);
        if (isset($body['excerpt'])) $upd['post_excerpt'] = sanitize_textarea_field($body['excerpt']);
        wp_update_post($upd);
        if (isset($body['reading_time'])) update_post_meta($post->ID, 'article_reading_time', (int) $body['reading_time']);
        if (isset($body['module'])) wp_set_object_terms($post->ID, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($post->ID, sanitize_text_field($body['difficulty']), 'difficulty');
        if (isset($body['topic'])) wp_set_object_terms($post->ID, sanitize_text_field($body['topic']), 'topic');
        return new WP_REST_Response(['success' => true, 'data' => $this->format_article(get_post($post->ID), true)]);
    }

    public function delete_article($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'post') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    // ====== MODULES (ACF Options Page 管理) ======
    private $module_slugs = array( 'fi', 'co', 'mm', 'sd', 'pp', 'hr', 'abap', 'basis', 's4' );

    /**
     * 全モジュール一覧を取得。
     * ACF Options > モジュール設定 で管理されたデータを返す。
     */
    public function get_modules() {
        $debug    = array();
        $is_debug = isset( $_GET['debug'] ) && '1' === $_GET['debug'];

        if ( $is_debug ) {
            $debug['step'][] = 'get_modules() called';
        }

        // データがない場合、自動シードを試行
        $all_opt = get_option( 'sap_panda_module_data', null );
        if ( $is_debug ) {
            $debug['step'][] = 'sap_panda_module_data option: ' . ( $all_opt ? 'EXISTS' : 'NOT FOUND' );
            $debug['option_before_seed'] = $all_opt;
        }

        if ( empty( $all_opt ) && function_exists( 'sap_panda_seed_modules' ) ) {
            sap_panda_seed_modules();
            if ( $is_debug ) {
                $debug['step'][] = 'auto seed executed';
                $debug['option_after_seed'] = get_option( 'sap_panda_module_data', array() );
            }
        }

        $modules = array();

        // ACF 状態診断
        if ( $is_debug ) {
            $debug['acf_available']  = function_exists( 'get_field' );
            $debug['acf_class_exists'] = class_exists( 'ACF' );
            $debug['step'][] = 'ACF available: ' . ( $debug['acf_available'] ? 'YES' : 'NO' );
            // 各モジュールの get_field 結果を個別確認
            foreach ( $this->module_slugs as $s ) {
                $gf = function_exists( 'get_field' ) ? get_field( 'mod_' . $s, 'option' ) : 'N/A';
                $debug[ 'get_field_mod_' . $s ] = $gf;
            }
        }

        foreach ( $this->module_slugs as $slug ) {
            $mod       = $this->read_module( $slug );
            $mod_empty = empty( $mod );

            if ( $is_debug ) {
                $debug[ 'slug_' . $slug ] = $mod_empty ? 'EMPTY (read_module returned null/empty)' : 'OK: ' . ( isset( $mod['name_ja'] ) ? $mod['name_ja'] : '?' );
            }

            if ( $mod_empty ) {
                continue;
            }

            // タクソノミーを使って article / course カウントを取得
            $term = get_term_by( 'slug', $slug, 'sap_module' );
            if ( $term && ! is_wp_error( $term ) ) {
                $ac = new WP_Query( array(
                    'post_type'      => 'post',
                    'post_status'    => 'publish',
                    'tax_query'      => array( array( 'taxonomy' => 'sap_module', 'field' => 'term_id', 'terms' => $term->term_id ) ),
                    'fields'         => 'ids',
                    'posts_per_page' => -1,
                ) );
                $cc = new WP_Query( array(
                    'post_type'      => 'course',
                    'post_status'    => 'publish',
                    'tax_query'      => array( array( 'taxonomy' => 'sap_module', 'field' => 'term_id', 'terms' => $term->term_id ) ),
                    'fields'         => 'ids',
                    'posts_per_page' => -1,
                ) );
                $mod['article_count'] = (int) $ac->found_posts;
                $mod['course_count']  = (int) $cc->found_posts;
            } else {
                $mod['article_count'] = 0;
                $mod['course_count']  = 0;
            }

            $modules[] = $mod;
        }

        // 絶対ガード
        if ( empty( $modules ) ) {
            if ( $is_debug ) {
                $debug['step'][] = 'FALLBACK: modules still empty -> using hardcoded defaults';
            }
            $modules = array();
            foreach ( $this->get_default_modules_by_slug() as $slug => $m ) {
                $m['slug'] = $slug;
                $m['article_count'] = 0;
                $m['course_count']  = 0;
                $modules[] = $m;
            }
        }

        $response = array( 'success' => true, 'data' => $modules );

        if ( $is_debug ) {
            $response['_debug'] = $debug;
        }

        return new WP_REST_Response( $response );
    }

    /**
     * 単一モジュール取得。
     */
    public function get_module( $request ) {
        $slug = $request['slug'];
        $mod  = $this->read_module( $slug );

        if ( empty( $mod ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Not found' ), 404 );
        }

        return new WP_REST_Response( array( 'success' => true, 'data' => $mod ) );
    }

    /**
     * 単一モジュールを読み込む。
     *
     * 保存先の優先順位:
     *   1. sap_panda_module_data option（管理画面から ACF Options で保存）
     *   2. get_field()（ACF Pro / Polyfill）
     *   3. デフォルトハードコードデータ
     *
     * ACF Pro がインストールされている場合、Polyfill がスキップされるため
     * 直接 option を読みに行く（ACF は options_mod_fi を探すが、
     * 当プラグインは独自形式で保存しているため）。
     */
    private function read_module( $slug ) {
        $defaults = $this->get_default_modules_by_slug();

        if ( ! isset( $defaults[ $slug ] ) ) {
            return null;
        }

        // 手順1: sap_panda_module_data option から直接読み出し
        $all   = get_option( 'sap_panda_module_data', array() );
        $saved = is_array( $all ) && isset( $all[ 'mod_' . $slug ] ) ? $all[ 'mod_' . $slug ] : null;

        // 手順2: 空なら get_field() を試す（ACF Pro 保存形式互換）
        $acf_available = function_exists( 'get_field' );
        if ( empty( $saved ) ) {
            if ( $acf_available ) {
                $saved = get_field( 'mod_' . $slug, 'option' );
            }
        }

        // 手順3: 保存データがあればデフォルトとマージ
        $d = $defaults[ $slug ];

        if ( ! empty( $saved ) && is_array( $saved ) ) {
            return array(
                'slug'        => $slug,
                'code'        => ! empty( $saved['code'] )        ? $saved['code']        : $d['code'],
                'name_ja'     => ! empty( $saved['name_ja'] )     ? $saved['name_ja']     : $d['name_ja'],
                'name_en'     => ! empty( $saved['name_en'] )     ? $saved['name_en']     : $d['name_en'],
                'description' => ! empty( $saved['description'] ) ? $saved['description'] : $d['description'],
                'color'       => ! empty( $saved['color'] )       ? $saved['color']       : $d['color'],
                'bg_color'    => ! empty( $saved['bg_color'] )    ? $saved['bg_color']    : $d['bg_color'],
                'levels'      => is_array( $saved['levels'] ?? null ) ? $saved['levels'] : $d['levels'],
                'order'       => (int) ( $saved['order'] ?? $d['order'] ),
                'article_count' => 0,
                'course_count'  => 0,
            );
        }

        // フォールバック: デフォルト値
        $d = $defaults[ $slug ];
        return array(
            'slug'        => $slug,
            'code'        => $d['code'],
            'name_ja'     => $d['name_ja'],
            'name_en'     => $d['name_en'],
            'description' => $d['description'],
            'color'       => $d['color'],
            'bg_color'    => $d['bg_color'],
            'levels'      => $d['levels'],
            'order'       => $d['order'],
            'article_count' => 0,
            'course_count'  => 0,
        );
    }

    /**
     * create / update は ACF admin UI で行うため、
     * REST API 経由の更新は許可しない。
     */
    public function create_module( $request ) {
        return new WP_REST_Response(
            array( 'success' => false, 'message' => 'モジュールの作成は管理画面 設定>モジュール設定 から行ってください。' ),
            400
        );
    }

    public function update_module( $request ) {
        return $this->create_module( $request );
    }

    /**
     * デフォルトのモジュール定義データ。
     * ACF Options が未設定の場合のフォールバック。
     */
    private function get_default_modules_by_slug() {
        return array(
            'fi'    => array( 'code' => 'FI',   'name_ja' => 'FI · 財務会計',   'name_en' => 'Financial Accounting', 'description' => '会計帳簿、決算、勘定科目。経理担当が触る一番大事な土台。',                     'color' => '#2f6d44', 'bg_color' => '#d8ead9', 'levels' => array('初級','中級','上級'), 'order' => 1 ),
            'co'    => array( 'code' => 'CO',   'name_ja' => 'CO · 管理会計',   'name_en' => 'Controlling',          'description' => '原価計算、利益分析、予算管理。社内意思決定に効く。',                           'color' => '#2641a1', 'bg_color' => '#dde4fc', 'levels' => array('初級','中級'),       'order' => 2 ),
            'mm'    => array( 'code' => 'MM',   'name_ja' => 'MM · 購買・在庫', 'name_en' => 'Material Management',  'description' => '購買依頼から入庫まで。サプライチェーンの心臓部。',                          'color' => '#a25411', 'bg_color' => '#fde0c2', 'levels' => array('初級','中級','上級'), 'order' => 3 ),
            'sd'    => array( 'code' => 'SD',   'name_ja' => 'SD · 販売管理',   'name_en' => 'Sales & Distribution', 'description' => '受注、出荷、請求。お客様への流れをぜんぶ管理。',                             'color' => '#b62a4a', 'bg_color' => '#ffdfe6', 'levels' => array('初級','中級','上級'), 'order' => 4 ),
            'pp'    => array( 'code' => 'PP',   'name_ja' => 'PP · 生産計画',   'name_en' => 'Production Planning',  'description' => 'MRP、BOM、製造指示。工場の動きをコントロール。',                             'color' => '#4828a8', 'bg_color' => '#e4dffb', 'levels' => array('中級','上級'),         'order' => 5 ),
            'hr'    => array( 'code' => 'HR',   'name_ja' => 'HR · 人事管理',   'name_en' => 'Human Resources',      'description' => '人事マスタ、給与、勤怠。SuccessFactorsとの連携も。',                           'color' => '#8a6212', 'bg_color' => '#fee9b3', 'levels' => array('初級','中級'),       'order' => 6 ),
            'abap'  => array( 'code' => 'ABAP', 'name_ja' => 'ABAP · 開発言語', 'name_en' => 'ABAP',                  'description' => 'SAP独自の開発言語。アドオン、レポート、機能拡張に。',                          'color' => '#1f6f6f', 'bg_color' => '#cfecec', 'levels' => array('初級','中級','上級'), 'order' => 7 ),
            'basis' => array( 'code' => 'BS',   'name_ja' => 'Basis · 基盤管理','name_en' => 'Basis',                 'description' => 'システム運用、権限、パッチ。SAPの裏方。',                                    'color' => '#4a432d', 'bg_color' => '#e3e1d8', 'levels' => array('中級','上級'),         'order' => 8 ),
            's4'    => array( 'code' => 'S4',   'name_ja' => 'S/4 · S/4HANA',  'name_en' => 'S/4HANA',              'description' => '次世代ERP。Fiori UI、HANA DB、シンプリフィケーション。',                      'color' => '#1864a3', 'bg_color' => '#d1ecf9', 'levels' => array('初級','中級','上級'), 'order' => 9 ),
        );
    }

    public function get_module_content($request) {
        $slug = $request['slug']; $term = get_term_by('slug', $slug, 'sap_module');
        if (!$term) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $tq = [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $slug]];
        $articles = array_map([$this, 'format_article'], get_posts(['post_type' => 'post', 'post_status' => 'publish', 'tax_query' => $tq, 'posts_per_page' => 20]));
        $courses = array_map(function($p) { $m = wp_get_object_terms($p->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($p->ID, 'difficulty', ['fields' => 'all']); return ['id' => $p->ID, 'title' => $p->post_title, 'excerpt' => get_the_excerpt($p), 'price' => (int) get_field('course_price', $p->ID), 'duration' => (string) get_field('course_duration', $p->ID), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'created_at' => $p->post_date]; }, get_posts(['post_type' => 'course', 'post_status' => 'publish', 'tax_query' => $tq, 'posts_per_page' => 20]));
        $knowledge = array_map(function($p) { $m = wp_get_object_terms($p->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($p->ID, 'difficulty', ['fields' => 'all']); return ['id' => $p->ID, 'title' => $p->post_title, 'excerpt' => get_the_excerpt($p), 'type' => get_post_meta($p->ID, 'knowledge_type', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'created_at' => $p->post_date]; }, get_posts(['post_type' => 'knowledge', 'post_status' => 'publish', 'tax_query' => $tq, 'posts_per_page' => 20]));
        return new WP_REST_Response(['success' => true, 'data' => ['module' => ['slug' => $slug, 'name_ja' => $term->name, 'counts' => ['articles' => count($articles), 'courses' => count($courses), 'knowledge' => count($knowledge)]], 'articles' => $articles, 'courses' => $courses, 'knowledge' => $knowledge]]);
    }

    // ====== COURSES ======
    public function get_courses($request) {
        $args = ['post_type' => 'course', 'posts_per_page' => $request->get_param('per_page') ?: 10, 'paged' => $request->get_param('page') ?: 1, 'post_status' => 'publish'];
        if ($m = $request->get_param('module')) $args['tax_query'] = [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $m]];
        if ($s = $request->get_param('q')) $args['s'] = $s;
        $q = new WP_Query($args);
        $data = array_map(function($p) { $m = wp_get_object_terms($p->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($p->ID, 'difficulty', ['fields' => 'all']); return ['id' => $p->ID, 'title' => $p->post_title, 'excerpt' => get_the_excerpt($p), 'price' => (int) get_field('course_price', $p->ID), 'instructor' => (string) get_field('course_instructor', $p->ID), 'duration' => (string) get_field('course_duration', $p->ID), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'created_at' => $p->post_date, 'updated_at' => $p->post_modified]; }, $q->posts);
        return new WP_REST_Response(['success' => true, 'data' => $data, 'total' => $q->found_posts]);
    }

    public function get_course($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'course') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $m = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($post->ID, 'difficulty', ['fields' => 'all']);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $post->ID, 'title' => $post->post_title, 'content' => apply_filters('the_content', $post->post_content), 'excerpt' => get_the_excerpt($post), 'price' => (int) get_field('course_price', $post->ID), 'instructor' => (string) get_field('course_instructor', $post->ID), 'duration' => (string) get_field('course_duration', $post->ID), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'created_at' => $post->post_date, 'updated_at' => $post->post_modified]]);
    }

    public function create_course($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $id = wp_insert_post(['post_type' => 'course', 'post_title' => $title, 'post_content' => isset($body['content']) ? wp_kses_post($body['content']) : '', 'post_excerpt' => isset($body['excerpt']) ? sanitize_textarea_field($body['excerpt']) : '', 'post_status' => 'publish', 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['price'])) update_post_meta($id, 'course_price', (int) $body['price']);
        if (isset($body['duration'])) update_post_meta($id, 'course_duration', sanitize_text_field($body['duration']));
        if (isset($body['module'])) wp_set_object_terms($id, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($id, sanitize_text_field($body['difficulty']), 'difficulty');
        $request['id'] = $id; return $this->get_course($request);
    }

    public function update_course($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'course') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['content'])) $upd['post_content'] = wp_kses_post($body['content']);
        if (isset($body['excerpt'])) $upd['post_excerpt'] = sanitize_textarea_field($body['excerpt']);
        wp_update_post($upd);
        foreach (['price' => 'course_price', 'duration' => 'course_duration'] as $k => $mk) if (isset($body[$k])) update_post_meta($post->ID, $mk, $k === 'price' ? (int) $body[$k] : sanitize_text_field($body[$k]));
        if (isset($body['module'])) wp_set_object_terms($post->ID, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($post->ID, sanitize_text_field($body['difficulty']), 'difficulty');
        return $this->get_course($request);
    }

    public function delete_course($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'course') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    // ====== LESSONS ======
    public function get_course_lessons($request) {
        $cid = $request['course_id'];
        $lessons = get_posts(['post_type' => 'lesson', 'post_status' => 'publish', 'posts_per_page' => -1, 'meta_key' => 'lesson_order', 'orderby' => 'meta_value_num', 'order' => 'ASC', 'meta_query' => [['key' => 'lesson_course_id', 'value' => $cid]]]);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_lesson'], $lessons)]);
    }

    public function get_all_lessons($request) {
        $lessons = get_posts(['post_type' => 'lesson', 'post_status' => 'publish', 'posts_per_page' => $request->get_param('per_page') ?: 100, 'meta_key' => 'lesson_order', 'orderby' => 'meta_value_num', 'order' => 'ASC']);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_lesson'], $lessons)]);
    }

    public function get_lesson($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'lesson') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); return new WP_REST_Response(['success' => true, 'data' => $this->format_lesson($post, true)]); }

    public function create_lesson($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $id = wp_insert_post(['post_type' => 'lesson', 'post_title' => $title, 'post_content' => isset($body['content']) ? wp_kses_post($body['content']) : '', 'post_excerpt' => isset($body['excerpt']) ? sanitize_textarea_field($body['excerpt']) : '', 'post_status' => 'publish', 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['course_id'])) update_post_meta($id, 'lesson_course_id', (int) $body['course_id']);
        if (isset($body['order'])) update_post_meta($id, 'lesson_order', (int) $body['order']);
        if (isset($body['time'])) update_post_meta($id, 'lesson_time', sanitize_text_field($body['time']));
        return new WP_REST_Response(['success' => true, 'data' => $this->format_lesson(get_post($id), true)]);
    }

    public function update_lesson($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'lesson') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['content'])) $upd['post_content'] = wp_kses_post($body['content']);
        if (isset($body['excerpt'])) $upd['post_excerpt'] = sanitize_textarea_field($body['excerpt']);
        wp_update_post($upd);
        if (isset($body['course_id'])) update_post_meta($post->ID, 'lesson_course_id', (int) $body['course_id']);
        if (isset($body['order'])) update_post_meta($post->ID, 'lesson_order', (int) $body['order']);
        if (isset($body['time'])) update_post_meta($post->ID, 'lesson_time', sanitize_text_field($body['time']));
        return new WP_REST_Response(['success' => true, 'data' => $this->format_lesson(get_post($post->ID), true)]);
    }

    public function delete_lesson($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'lesson') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    private function format_lesson($post, $with_content = false) {
        $cid = (int) get_post_meta($post->ID, 'lesson_course_id', true); $course = $cid ? get_post($cid) : null;
        return ['id' => $post->ID, 'title' => $post->post_title, 'excerpt' => get_the_excerpt($post), 'content' => $with_content ? apply_filters('the_content', $post->post_content) : '', 'order' => (int) get_post_meta($post->ID, 'lesson_order', true), 'time' => (string) get_post_meta($post->ID, 'lesson_time', true), 'course_id' => $cid, 'course_title' => $course ? $course->post_title : '', 'created_at' => $post->post_date];
    }

    // ====== LEARNING PATHS ======
    public function get_learning_paths($request) {
        $paths = get_posts(['post_type' => 'learning_path', 'posts_per_page' => $request->get_param('per_page') ?: 10, 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']);
        $data = array_map(function($p) {
            $raw = get_post_meta($p->ID, 'path_steps', true); if (is_string($raw) && !empty($raw)) { $decoded = json_decode($raw, true); if (is_array($decoded)) $raw = $decoded; }
            $steps = []; if (is_array($raw)) { $so = 0; foreach ($raw as $s) { $so++; $si = 0; $match = get_posts(['post_type' => 'path_step', 'posts_per_page' => 1, 'post_status' => 'publish', 'meta_query' => [['key' => 'step_path_id', 'value' => $p->ID], ['key' => 'step_order', 'value' => $so]]]); if (!empty($match)) $si = $match[0]->ID; $steps[] = ['id' => $si, 'title' => $s['step_title'] ?? $s['title'] ?? '', 'time' => $s['step_time'] ?? $s['time'] ?? '', 'content' => $s['step_content'] ?? $s['content'] ?? '']; } }
            $rids = get_post_meta($p->ID, 'path_related_articles', true) ?: []; if (is_string($rids)) $rids = array_filter(explode(',', $rids));
            $related = []; if (is_array($rids)) foreach ($rids as $aid) { $a = get_post($aid); if ($a && $a->post_status === 'publish') $related[] = ['id' => $a->ID, 'title' => $a->post_title, 'slug' => $a->post_name]; }
            return ['id' => $p->ID, 'title' => $p->post_title, 'audience' => (string) get_post_meta($p->ID, 'path_audience', true), 'description' => (string) get_post_meta($p->ID, 'path_description', true), 'steps' => $steps, 'duration' => (string) get_post_meta($p->ID, 'path_duration', true), 'accent' => get_post_meta($p->ID, 'path_accent', true) ?: '#5a9d6e', 'article_count' => count($related), 'related_articles' => $related, 'cta_url' => (string) get_post_meta($p->ID, 'path_cta_url', true) ?: '/', 'created_at' => $p->post_date];
        }, $paths);
        return new WP_REST_Response(['success' => true, 'data' => $data]);
    }

    public function get_learning_path($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'learning_path') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $raw = get_post_meta($post->ID, 'path_steps', true) ?: []; if (is_string($raw) && !empty($raw)) { $decoded = json_decode($raw, true); if (is_array($decoded)) $raw = $decoded; }
        $steps = []; if (is_array($raw)) { $so = 0; foreach ($raw as $s) { $so++; $si = 0; $match = get_posts(['post_type' => 'path_step', 'posts_per_page' => 1, 'post_status' => 'publish', 'meta_query' => [['key' => 'step_path_id', 'value' => $post->ID], ['key' => 'step_order', 'value' => $so]]]); if (!empty($match)) $si = $match[0]->ID; $steps[] = ['id' => $si, 'title' => $s['step_title'] ?? $s['title'] ?? '', 'time' => $s['step_time'] ?? $s['time'] ?? '', 'content' => $s['step_content'] ?? $s['content'] ?? '']; } }
        $rids = get_post_meta($post->ID, 'path_related_articles', true) ?: []; $related = []; if (is_array($rids)) foreach ($rids as $aid) { $a = get_post($aid); if ($a && $a->post_status === 'publish') $related[] = ['id' => $a->ID, 'title' => $a->post_title, 'slug' => $a->post_name]; }
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $post->ID, 'title' => $post->post_title, 'audience' => (string) get_post_meta($post->ID, 'path_audience', true), 'description' => (string) get_post_meta($post->ID, 'path_description', true), 'steps' => $steps, 'duration' => (string) get_post_meta($post->ID, 'path_duration', true), 'accent' => get_post_meta($post->ID, 'path_accent', true) ?: '#5a9d6e', 'article_count' => count($related), 'related_articles' => $related, 'cta_url' => (string) get_post_meta($post->ID, 'path_cta_url', true) ?: '/', 'created_at' => $post->post_date]]);
    }

    // ====== STEPS ======
    public function get_steps($request) {
        $args = ['post_type' => 'path_step', 'posts_per_page' => $request->get_param('per_page') ?: 20, 'post_status' => 'publish', 'meta_key' => 'step_order', 'orderby' => 'meta_value_num', 'order' => 'ASC'];
        if ($pid = $request->get_param('path_id')) $args['meta_query'] = [['key' => 'step_path_id', 'value' => $pid]];
        $q = new WP_Query($args); return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_step'], $q->posts), 'total' => $q->found_posts]);
    }

    public function get_step($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'path_step') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); return new WP_REST_Response(['success' => true, 'data' => $this->format_step($post, true)]); }
    public function get_path_steps($request) { $request->set_query_params(array_merge($request->get_params(), ['path_id' => $request['path_id']])); return $this->get_steps($request); }

    private function format_step($post, $with_content = false) {
        $pid = (int) get_post_meta($post->ID, 'step_path_id', true); $path = $pid ? get_post($pid) : null;
        return ['id' => $post->ID, 'title' => $post->post_title, 'excerpt' => get_the_excerpt($post), 'content' => $with_content ? apply_filters('the_content', $post->post_content) : '', 'step_order' => (int) get_post_meta($post->ID, 'step_order', true), 'step_time' => (string) get_post_meta($post->ID, 'step_time', true), 'path_id' => $pid, 'path_title' => $path ? $path->post_title : '', 'created_at' => $post->post_date];
    }

    // ====== VIDEOS ======
    public function get_videos($request) { $status = $request->get_param('status') ?: 'publish';
        $args = ['post_type' => 'video', 'posts_per_page' => $request->get_param('per_page') ?: 20, 'paged' => $request->get_param('page') ?: 1, 'post_status' => $status === 'all' ? ['publish', 'draft', 'trash'] : $status, 'orderby' => 'date', 'order' => 'DESC'];
        if ($m = $request->get_param('module')) $args['tax_query'] = [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $m]];
        $q = new WP_Query($args); return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_video'], $q->posts), 'total' => $q->found_posts]);
    }
    public function get_video($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'video') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); return new WP_REST_Response(['success' => true, 'data' => $this->format_video($post, true)]); }
    private function format_video($post, $with_content = false) { $m = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'all']); return ['id' => $post->ID, 'title' => $post->post_title, 'excerpt' => get_the_excerpt($post), 'content' => $with_content ? apply_filters('the_content', $post->post_content) : '', 'youtube_id' => (string) get_post_meta($post->ID, 'video_youtube_id', true), 'duration' => (string) get_post_meta($post->ID, 'video_duration', true), 'views' => (int) get_post_meta($post->ID, 'video_views', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'thumbnail' => (string) get_post_meta($post->ID, 'video_thumbnail', true), 'status' => $post->post_status, 'created_at' => $post->post_date]; }

    // ====== KNOWLEDGE ======
    public function get_knowledge($request) {
        $args = ['post_type' => 'knowledge', 'posts_per_page' => $request->get_param('per_page') ?: 20, 'paged' => $request->get_param('page') ?: 1, 'post_status' => 'publish'];
        if ($m = $request->get_param('module')) $args['tax_query'] = [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => $m]];
        if ($t = $request->get_param('type')) $args['meta_query'] = [['key' => 'knowledge_type', 'value' => $t]];
        if ($q = $request->get_param('q')) $args['s'] = $q;
        $query = new WP_Query($args);
        $data = array_map(function($p) { $m = wp_get_object_terms($p->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($p->ID, 'difficulty', ['fields' => 'all']); return ['id' => $p->ID, 'title' => $p->post_title, 'excerpt' => get_the_excerpt($p), 'type' => get_post_meta($p->ID, 'knowledge_type', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'created_at' => $p->post_date, 'updated_at' => $p->post_modified]; }, $query->posts);
        return new WP_REST_Response(['success' => true, 'data' => $data, 'total' => $query->found_posts]);
    }

    public function get_knowledge_detail($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'knowledge') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $m = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($post->ID, 'difficulty', ['fields' => 'all']);
        $refs = get_post_meta($post->ID, 'knowledge_references', true) ?: []; if (is_string($refs)) $refs = [];
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $post->ID, 'title' => $post->post_title, 'content' => apply_filters('the_content', $post->post_content), 'excerpt' => get_the_excerpt($post), 'type' => get_post_meta($post->ID, 'knowledge_type', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'references' => is_array($refs) ? $refs : [], 'created_at' => $post->post_date, 'updated_at' => $post->post_modified]]);
    }

    public function create_knowledge($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $id = wp_insert_post(['post_type' => 'knowledge', 'post_title' => $title, 'post_content' => isset($body['content']) ? wp_kses_post($body['content']) : '', 'post_excerpt' => isset($body['excerpt']) ? sanitize_textarea_field($body['excerpt']) : '', 'post_status' => 'publish', 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['type'])) update_post_meta($id, 'knowledge_type', sanitize_text_field($body['type']));
        if (isset($body['module'])) wp_set_object_terms($id, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($id, sanitize_text_field($body['difficulty']), 'difficulty');
        $request['id'] = $id; return $this->get_knowledge_detail($request);
    }

    public function update_knowledge($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'knowledge') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['content'])) $upd['post_content'] = wp_kses_post($body['content']);
        if (isset($body['excerpt'])) $upd['post_excerpt'] = sanitize_textarea_field($body['excerpt']);
        wp_update_post($upd);
        if (isset($body['type'])) update_post_meta($post->ID, 'knowledge_type', sanitize_text_field($body['type']));
        if (isset($body['module'])) wp_set_object_terms($post->ID, sanitize_text_field($body['module']), 'sap_module');
        if (isset($body['difficulty'])) wp_set_object_terms($post->ID, sanitize_text_field($body['difficulty']), 'difficulty');
        return $this->get_knowledge_detail($request);
    }

    public function delete_knowledge($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'knowledge') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]); }

    // ====== QUIZZES ======
    private function _get_quiz_data($post_id) {
        $raw = get_post_meta($post_id, 'quiz_options', true); $options = [];
        if (is_string($raw) && !empty($raw)) { $d = json_decode($raw, true); if (is_array($d)) $options = $d; } elseif (is_array($raw)) $options = $raw;
        if (empty($options)) $options = array_fill(0, 4, ['text' => '', 'correct' => false]);
        return [$options, get_post_meta($post_id, 'quiz_explanation', true), get_post_meta($post_id, 'quiz_difficulty', true)];
    }

    public function get_all_quizzes($request) {
        $q = new WP_Query(['post_type' => 'daily_quiz', 'posts_per_page' => $request->get_param('per_page') ?: 50, 'paged' => $request->get_param('page') ?: 1, 'post_status' => 'any']);
        $data = array_map(function($p) { [$op, $ex] = $this->_get_quiz_data($p->ID); $m = wp_get_object_terms($p->ID, 'sap_module', ['fields' => 'all']); return ['id' => $p->ID, 'title' => $p->post_title, 'options' => $op, 'explanation' => $ex, 'difficulty' => get_post_meta($p->ID, 'quiz_difficulty', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'date' => get_post_meta($p->ID, 'quiz_date', true), 'status' => $p->post_status, 'created_at' => $p->post_date]; }, $q->posts);
        return new WP_REST_Response(['success' => true, 'data' => $data, 'total' => $q->found_posts]);
    }

    public function get_quiz($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'daily_quiz') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        [$op, $ex] = $this->_get_quiz_data($post->ID); $m = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'all']);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $post->ID, 'title' => $post->post_title, 'options' => $op, 'explanation' => $ex, 'difficulty' => get_post_meta($post->ID, 'quiz_difficulty', true), 'module' => !empty($m) ? ['slug' => $m[0]->slug, 'name' => $m[0]->name] : null, 'date' => get_post_meta($post->ID, 'quiz_date', true), 'status' => $post->post_status, 'created_at' => $post->post_date]]);
    }

    public function create_quiz($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $status = isset($body['status']) ? sanitize_text_field($body['status']) : 'publish';
        $id = wp_insert_post(['post_type' => 'daily_quiz', 'post_title' => $title, 'post_status' => $status, 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['options'])) update_post_meta($id, 'quiz_options', $body['options']);
        if (isset($body['explanation'])) update_post_meta($id, 'quiz_explanation', sanitize_textarea_field($body['explanation']));
        if (isset($body['date'])) update_post_meta($id, 'quiz_date', sanitize_text_field($body['date']));
        if (isset($body['difficulty'])) update_post_meta($id, 'quiz_difficulty', sanitize_text_field($body['difficulty']));
        if (isset($body['module'])) wp_set_object_terms($id, sanitize_text_field($body['module']), 'sap_module');
        $request['id'] = $id; return $this->get_quiz($request);
    }

    public function update_quiz($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'daily_quiz') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['status'])) $upd['post_status'] = sanitize_text_field($body['status']);
        wp_update_post($upd);
        if (isset($body['options'])) update_post_meta($post->ID, 'quiz_options', $body['options']);
        if (isset($body['explanation'])) update_post_meta($post->ID, 'quiz_explanation', sanitize_textarea_field($body['explanation']));
        if (isset($body['date'])) update_post_meta($post->ID, 'quiz_date', sanitize_text_field($body['date']));
        if (isset($body['difficulty'])) update_post_meta($post->ID, 'quiz_difficulty', sanitize_text_field($body['difficulty']));
        if (isset($body['module'])) wp_set_object_terms($post->ID, sanitize_text_field($body['module']), 'sap_module');
        return $this->get_quiz($request);
    }

    public function delete_quiz($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'daily_quiz') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]); }

    public function get_today_quiz() {
        $today = current_time('Y-m-d');
        $quizzes = get_posts(['post_type' => 'daily_quiz', 'posts_per_page' => 1, 'post_status' => 'publish', 'meta_key' => 'quiz_date', 'meta_value' => $today, 'meta_compare' => '=']);
        if (empty($quizzes)) {
            $quizzes = get_posts(['post_type' => 'daily_quiz', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'ASC']);
            if (empty($quizzes)) return new WP_REST_Response(['success' => false, 'message' => 'No quiz today'], 404);
            usort($quizzes, function($a, $b) { $da = get_post_meta($a->ID, 'quiz_date', true) ?: '2099-12-31'; $db = get_post_meta($b->ID, 'quiz_date', true) ?: '2099-12-31'; return strcmp($da, $db); });
        }
        $quiz = $quizzes[0]; [$op, $ex] = $this->_get_quiz_data($quiz->ID);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $quiz->ID, 'question' => $quiz->post_title, 'options' => array_map(function($o) { return $o['text'] ?? ''; }, $op ?: []), 'explanation' => $ex ?: '', 'date' => current_time('Y-m-d')]]);
    }

    public function submit_quiz_answer($request) {
        $qid = $request['id']; $answer = (int) $request->get_param('answer'); $quiz = get_post($qid);
        if (!$quiz || $quiz->post_type !== 'daily_quiz') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        [$op] = $this->_get_quiz_data($quiz->ID); $correct = -1;
        if (is_array($op)) foreach ($op as $i => $o) { if (!empty($o['correct'])) { $correct = $i; break; } }
        $is_correct = ($answer === $correct); $uid = $this->get_current_user_id();
        if ($uid) { global $wpdb; $wpdb->insert($wpdb->prefix . 'quiz_attempts', ['user_id' => $uid, 'quiz_id' => $qid, 'selected_answer' => $answer, 'is_correct' => $is_correct ? 1 : 0, 'attempted_at' => current_time('mysql')]); }
        [, $ex] = $this->_get_quiz_data($qid);
        return new WP_REST_Response(['success' => true, 'data' => ['correct' => $is_correct, 'correct_answer' => $correct, 'explanation' => $ex]]);
    }

    public function get_quiz_stats() {
        $uid = $this->get_current_user_id(); if (!$uid) return new WP_REST_Response(['success' => false, 'message' => 'Login required'], 401);
        global $wpdb; $t = $wpdb->prefix . 'quiz_attempts';
        $total = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t WHERE user_id = %d", $uid));
        $correct = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t WHERE user_id = %d AND is_correct = 1", $uid));
        return new WP_REST_Response(['success' => true, 'data' => ['total_answers' => $total, 'correct_count' => $correct, 'accuracy' => $total > 0 ? round($correct / $total * 100, 1) : 0]]);
    }

    // ====== CASES ======
    public function get_cases($request) {
        $status = $request->get_param('status') ?: 'publish';
        $args = ['post_type' => 'sap_case', 'posts_per_page' => $request->get_param('per_page') ?: 20, 'paged' => $request->get_param('page') ?: 1, 'post_status' => $status === 'all' ? ['publish', 'draft', 'trash'] : $status];
        $ob = $request->get_param('orderby'); $args['orderby'] = $ob === 'rate' ? 'meta_value_num' : ($ob === 'title' ? 'title' : 'date');
        $args['order'] = strtoupper($request->get_param('order') ?: 'DESC');
        if ($ob === 'rate') $args['meta_key'] = 'case_rate_max';
        if ($mods = $request->get_param('modules')) $args['tax_query'] = [['taxonomy' => 'sap_module', 'field' => 'slug', 'terms' => explode(',', $mods)]];
        if ($request->get_param('urgent')) $args['meta_query'] = [['key' => 'case_urgent', 'value' => '1']];
        if ($q = $request->get_param('q')) $args['s'] = $q;
        $query = new WP_Query($args);
        return new WP_REST_Response(['success' => true, 'data' => array_map([$this, 'format_case'], $query->posts), 'total' => $query->found_posts]);
    }

    public function get_case($request) { $post = get_post($request['id']); if (!$post || $post->post_type !== 'sap_case') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404); return new WP_REST_Response(['success' => true, 'data' => $this->format_case($post)]); }

    public function apply_case($request) {
        $case_id = $request['id']; if ($case_id > 0) { $case = get_post($case_id); if (!$case || $case->post_type !== 'sap_case') return new WP_REST_Response(['success' => false, 'message' => 'Case not found'], 404); }
        $uid = $this->get_current_user_id(); $body = $request->get_json_params() ?: [];
        $name = sanitize_text_field($request->get_param('name') ?: ($body['name'] ?? ''));
        $email = sanitize_email($request->get_param('email') ?: ($body['email'] ?? ''));
        $phone = sanitize_text_field($request->get_param('phone') ?: ($body['phone'] ?? ''));
        $rate = sanitize_text_field($request->get_param('expected_rate') ?: ($body['expected_rate'] ?? ''));
        $exp = sanitize_text_field($request->get_param('experience_years') ?: ($body['experience_years'] ?? ''));
        $skills = $request->get_param('skill_modules') ?: ($body['skill_modules'] ?? []);
        $self_pr = sanitize_textarea_field($request->get_param('self_pr') ?: ($body['self_pr'] ?? ''));
        if (empty($name) || empty($email)) return new WP_REST_Response(['success' => false, 'message' => 'Name and email required'], 400);
        $resume_url = ''; $files = $request->get_file_params();
        if (!empty($files['resume']) && is_array($files['resume']) && empty($files['resume']['error'])) {
            require_once ABSPATH . 'wp-admin/includes/file.php'; $f = $files['resume'];
            $allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (in_array($f['type'], $allowed)) { $upload = wp_handle_upload($f, ['test_form' => false]); if (!empty($upload['url'])) $resume_url = $upload['url']; }
        }
        global $wpdb; $wpdb->insert($wpdb->prefix . 'case_applications', ['case_id' => $case_id, 'user_id' => $uid ?: 0, 'applicant_name' => $name, 'applicant_email' => $email, 'applicant_phone' => $phone, 'expected_rate' => $rate, 'experience_years' => $exp, 'skill_modules' => maybe_serialize($skills), 'self_pr' => $self_pr, 'resume_file' => $resume_url, 'created_at' => current_time('mysql')]);
        return new WP_REST_Response(['success' => true, 'data' => ['application_id' => $wpdb->insert_id, 'message' => '応募ありがとうございます！']]);
    }

    public function create_case($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $post_status = isset($body['status']) ? sanitize_text_field($body['status']) : 'publish';
        $id = wp_insert_post(['post_type' => 'sap_case', 'post_title' => $title, 'post_content' => isset($body['blurb']) ? sanitize_textarea_field($body['blurb']) : '', 'post_status' => $post_status, 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        foreach (['rate_min','rate_max','period','location','remote','experience','company'] as $k) if (isset($body[$k])) update_post_meta($id, "case_{$k}", sanitize_text_field($body[$k]));
        update_post_meta($id, 'case_utilization', isset($body['utilization']) ? sanitize_text_field($body['utilization']) : '週5');
        update_post_meta($id, 'case_seats', isset($body['seats']) ? (int)$body['seats'] : 1);
        update_post_meta($id, 'case_urgent', !empty($body['urgent']) ? '1' : '0');
        update_post_meta($id, 'case_scarce', !empty($body['scarce']) ? '1' : '0');
        if (!empty($body['mods']) && is_array($body['mods'])) {
            foreach ($body['mods'] as $m) wp_set_object_terms($id, strtolower(sanitize_text_field($m)), 'sap_module', true);
        }
        if (!empty($body['skills_must'])) {
            $flat = is_array($body['skills_must']) ? $body['skills_must'] : [$body['skills_must']];
            $flat = array_map('sanitize_text_field', $flat);
            update_post_meta($id, 'case_skills_must', array_map(function($s) { return ['skill' => $s]; }, $flat));
            update_post_meta($id, 'case_skills_must_flat', $flat);
        }
        if (!empty($body['skills_want'])) {
            $flat = is_array($body['skills_want']) ? $body['skills_want'] : [$body['skills_want']];
            $flat = array_map('sanitize_text_field', $flat);
            update_post_meta($id, 'case_skills_want', array_map(function($s) { return ['skill' => $s]; }, $flat));
            update_post_meta($id, 'case_skills_want_flat', $flat);
        }
        $request['id'] = $id; return $this->get_case($request);
    }

    public function update_case($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'sap_case') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['blurb'])) $upd['post_content'] = sanitize_textarea_field($body['blurb']);
        if (isset($body['status'])) $upd['post_status'] = sanitize_text_field($body['status']);
        wp_update_post($upd);
        foreach (['rate_min','rate_max','period','location','remote','experience','company'] as $k) if (isset($body[$k])) update_post_meta($post->ID, "case_{$k}", sanitize_text_field($body[$k]));
        if (isset($body['utilization'])) update_post_meta($post->ID, 'case_utilization', sanitize_text_field($body['utilization']));
        if (isset($body['seats'])) update_post_meta($post->ID, 'case_seats', (int)$body['seats']);
        update_post_meta($post->ID, 'case_urgent', !empty($body['urgent']) ? '1' : '0');
        update_post_meta($post->ID, 'case_scarce', !empty($body['scarce']) ? '1' : '0');
        if (isset($body['mods'])) {
            wp_set_object_terms($post->ID, [], 'sap_module');
            if (is_array($body['mods'])) foreach ($body['mods'] as $m) wp_set_object_terms($post->ID, strtolower(sanitize_text_field($m)), 'sap_module', true);
        }
        if (isset($body['skills_must'])) {
            $flat = array_map('sanitize_text_field', is_array($body['skills_must']) ? $body['skills_must'] : [$body['skills_must']]);
            update_post_meta($post->ID, 'case_skills_must', array_map(function($s) { return ['skill' => $s]; }, $flat));
            update_post_meta($post->ID, 'case_skills_must_flat', $flat);
        }
        if (isset($body['skills_want'])) {
            $flat = array_map('sanitize_text_field', is_array($body['skills_want']) ? $body['skills_want'] : [$body['skills_want']]);
            update_post_meta($post->ID, 'case_skills_want', array_map(function($s) { return ['skill' => $s]; }, $flat));
            update_post_meta($post->ID, 'case_skills_want_flat', $flat);
        }
        return $this->get_case($request);
    }

    public function delete_case($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'sap_case') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    public function create_video($request) {
        $body = $request->get_json_params() ?: []; $title = isset($body['title']) ? sanitize_text_field($body['title']) : '';
        if (empty($title)) return new WP_REST_Response(['success' => false, 'message' => 'Title required'], 400);
        $post_status = isset($body['status']) ? sanitize_text_field($body['status']) : 'publish';
        $id = wp_insert_post(['post_type' => 'video', 'post_title' => $title, 'post_content' => isset($body['content']) ? wp_kses_post($body['content']) : '', 'post_excerpt' => isset($body['excerpt']) ? sanitize_textarea_field($body['excerpt']) : '', 'post_status' => $post_status, 'post_author' => $this->get_current_user_id()]);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['youtube_id'])) update_post_meta($id, 'video_youtube_id', sanitize_text_field($body['youtube_id']));
        if (isset($body['duration'])) update_post_meta($id, 'video_duration', sanitize_text_field($body['duration']));
        if (isset($body['thumbnail'])) update_post_meta($id, 'video_thumbnail', sanitize_text_field($body['thumbnail']));
        if (isset($body['module'])) wp_set_object_terms($id, sanitize_text_field($body['module']), 'sap_module');
        $request['id'] = $id; return $this->get_video($request);
    }

    public function update_video($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'video') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $post->ID];
        if (isset($body['title'])) $upd['post_title'] = sanitize_text_field($body['title']);
        if (isset($body['content'])) $upd['post_content'] = wp_kses_post($body['content']);
        if (isset($body['excerpt'])) $upd['post_excerpt'] = sanitize_textarea_field($body['excerpt']);
        if (isset($body['status'])) $upd['post_status'] = sanitize_text_field($body['status']);
        wp_update_post($upd);
        if (isset($body['youtube_id'])) update_post_meta($post->ID, 'video_youtube_id', sanitize_text_field($body['youtube_id']));
        if (isset($body['duration'])) update_post_meta($post->ID, 'video_duration', sanitize_text_field($body['duration']));
        if (isset($body['thumbnail'])) update_post_meta($post->ID, 'video_thumbnail', sanitize_text_field($body['thumbnail']));
        if (isset($body['module'])) {
            wp_set_object_terms($post->ID, '', 'sap_module');
            wp_set_object_terms($post->ID, sanitize_text_field($body['module']), 'sap_module');
        }
        return $this->get_video($request);
    }

    public function delete_video($request) {
        $post = get_post($request['id']); if (!$post || $post->post_type !== 'video') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        wp_trash_post($post->ID); return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    // ====== APPLICATIONS ======
    public function get_applications($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'case_applications';
        $status = $request->get_param('status') ?: '';
        $search = $request->get_param('s') ?: '';
        $page = max(1, (int) $request->get_param('page') ?: 1);
        $per_page = min(100, max(1, (int) $request->get_param('per_page') ?: 20));
        $offset = ($page - 1) * $per_page;

        $where = '1=1'; $params = [];
        if ($status) { $where .= ' AND a.status = %s'; $params[] = $status; }
        if ($search) {
            $where .= ' AND (a.applicant_name LIKE %s OR a.applicant_email LIKE %s)';
            $params[] = '%' . $wpdb->esc_like($search) . '%';
            $params[] = '%' . $wpdb->esc_like($search) . '%';
        }
        
        $total = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} a WHERE {$where}", $params));
        $sql = "SELECT a.*, p.post_title as case_title FROM {$table} a LEFT JOIN {$wpdb->posts} p ON a.case_id = p.ID WHERE {$where} ORDER BY a.created_at DESC LIMIT %d OFFSET %d";
        $params[] = $per_page; $params[] = $offset;
        $items = $wpdb->get_results($wpdb->prepare($sql, $params));
        
        return new WP_REST_Response(['success' => true, 'data' => $items, 'total' => $total, 'page' => $page, 'per_page' => $per_page]);
    }

    public function update_application_status($request) {
        global $wpdb;
        $table = $wpdb->prefix . 'case_applications';
        $id = (int) $request->get_param('id');
        $status = sanitize_text_field($request->get_param('status'));
        if (!$id || !$status) return new WP_REST_Response(['success' => false, 'message' => 'Invalid params'], 400);
        $allowed = ['pending', 'contacted', 'approved', 'rejected'];
        if (!in_array($status, $allowed)) return new WP_REST_Response(['success' => false, 'message' => 'Invalid status'], 400);
        $wpdb->update($table, ['status' => $status], ['id' => $id]);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $id, 'status' => $status]]);
    }


    // ====== SITE PAGES ======
    public function get_site_pages($request) {
        $slug = $request->get_param('slug') ?: '';
        // pagename の方が name より確実に slug 検索できる（get_page_by_path 利用）
        $args = ['post_type' => 'page', 'posts_per_page' => $slug ? 1 : 50, 'post_status' => 'publish'];
        if ($slug) {
            // 既存WPプライバシーページ（draft）も検索できるよう post_status を any に
            $args['post_status'] = 'any';
            $args['name'] = $slug;
        }
        $pages = get_posts($args);
        $data = array_map(function($p) {
            return ['id' => $p->ID, 'title' => $p->post_title, 'slug' => $p->post_name,
                'content' => apply_filters('the_content', $p->post_content),
                'excerpt' => get_the_excerpt($p), 'updated_at' => $p->post_modified,
                'subtitle' => get_post_meta($p->ID, 'page_subtitle', true) ?: '',
                'meta' => get_post_meta($p->ID, 'page_meta', true) ?: ''];
        }, $pages);
        if ($slug && !empty($data)) return new WP_REST_Response(['success' => true, 'data' => $data[0]]);
        return new WP_REST_Response(['success' => true, 'data' => $data]);
    }

    public function update_site_page($request) {
        $body = $request->get_json_params() ?: [];
        $slug = isset($body['slug']) ? sanitize_text_field($body['slug']) : '';
        if (empty($slug)) return new WP_REST_Response(['success' => false, 'message' => 'Slug required'], 400);
        $title = isset($body['title']) ? sanitize_text_field($body['title']) : $slug;
        $content = isset($body['content']) ? wp_kses_post($body['content']) : '';

        // 全ステータスから既存ページを検索（draft の Privacy Policy ページも含む）
        $existing = get_posts(['post_type' => 'page', 'name' => $slug, 'post_status' => 'any', 'posts_per_page' => 1]);
        if (!empty($existing)) {
            $id = $existing[0]->ID;
            // update 時も post_status を publish に明示設定
            wp_update_post(['ID' => $id, 'post_title' => $title, 'post_content' => $content, 'post_status' => 'publish']);
        } else {
            $id = wp_insert_post(['post_type' => 'page', 'post_title' => $title, 'post_content' => $content, 'post_name' => $slug, 'post_status' => 'publish']);
            if (!is_wp_error($id)) {
                // wp_insert_post が slug を変更した場合、強制的に元の slug を設定
                $actual = get_post_field('post_name', $id);
                if ($actual !== $slug) {
                    wp_update_post(['ID' => $id, 'post_name' => $slug]);
                }
            }
        }
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Failed'], 500);
        if (isset($body['subtitle'])) update_post_meta($id, 'page_subtitle', sanitize_text_field($body['subtitle']));
        if (isset($body['meta'])) update_post_meta($id, 'page_meta', sanitize_textarea_field($body['meta']));
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $id, 'slug' => $slug]]);
    }

    // ====== USERS ======
    public function user_me($request) {
        $uid = $this->get_current_user_id(); $user = get_userdata($uid);
        if (!$user) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        if ($request->get_method() === 'PUT') {
            $body = $request->get_json_params() ?: [];
            if (!empty($body['display_name'])) wp_update_user(['ID' => $uid, 'display_name' => sanitize_text_field($body['display_name'])]);
            if (!empty($body['description'])) update_user_meta($uid, 'description', sanitize_textarea_field($body['description']));
            if (!empty($body['url'])) wp_update_user(['ID' => $uid, 'user_url' => esc_url_raw($body['url'])]);
            $user = get_userdata($uid);
        }
        global $wpdb; $pts = (int) $wpdb->get_var($wpdb->prepare("SELECT SUM(points) FROM {$wpdb->prefix}user_points WHERE user_id = %d", $uid));
        $qt = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}quiz_attempts WHERE user_id = %d", $uid));
        $qc = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}quiz_attempts WHERE user_id = %d AND is_correct = 1", $uid));
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $user->ID, 'email' => $user->user_email, 'display_name' => $user->display_name, 'description' => get_user_meta($uid, 'description', true), 'url' => $user->user_url, 'avatar_url' => get_avatar_url($user->ID, ['size' => 120]), 'roles' => array_values($user->roles), 'registered_at' => $user->user_registered, 'member_since' => date('Y-m', strtotime($user->user_registered)), 'stats' => ['articles_read' => count_user_posts($uid, 'post'), 'quizzes_answered' => $qt, 'quiz_accuracy' => $qt > 0 ? round($qc / $qt * 100, 1) : 0, 'points' => $pts]]]);
    }

    public function user_bookmarks($request) {
        $uid = $this->get_current_user_id(); $key = 'sap_bookmarks';
        switch ($request->get_method()) {
            case 'GET': $ids = get_user_meta($uid, $key, true) ?: []; $articles = []; if (!empty($ids)) { $q = new WP_Query(['post_type' => 'post', 'post__in' => $ids, 'posts_per_page' => -1]); $articles = array_map([$this, 'format_article'], $q->posts); } return new WP_REST_Response(['success' => true, 'data' => $articles]);
            case 'POST': $aid = (int) $request->get_param('article_id'); $ids = get_user_meta($uid, $key, true) ?: []; if (!in_array($aid, $ids)) { $ids[] = $aid; update_user_meta($uid, $key, $ids); } return new WP_REST_Response(['success' => true, 'data' => ['bookmarked' => true]]);
            case 'DELETE': $aid = (int) $request->get_param('article_id'); $ids = get_user_meta($uid, $key, true) ?: []; update_user_meta($uid, $key, array_diff($ids, [$aid])); return new WP_REST_Response(['success' => true, 'data' => ['bookmarked' => false]]);
        }
        return new WP_REST_Response(['success' => false, 'message' => 'Invalid method'], 405);
    }

    public function get_all_users($request) {
        $search = $request->get_param('s') ?: ''; $role = $request->get_param('role') ?: '';
        $page = max(1, (int) $request->get_param('page') ?: 1); $per_page = min(100, max(1, (int) $request->get_param('per_page') ?: 20));
        $args = ['number' => $per_page, 'paged' => $page];
        if ($search) $args['search'] = '*' . $search . '*';
        if ($role) $args['role__in'] = [$role];
        $uq = new WP_User_Query($args);
        $users = [];
        foreach ($uq->get_results() as $u) {
            $users[] = ['id' => $u->ID, 'email' => $u->user_email, 'display_name' => $u->display_name, 'roles' => array_values($u->roles), 'registered_at' => $u->user_registered, 'avatar_url' => get_avatar_url($u->ID, ['size' => 60])];
        }
        return new WP_REST_Response(['success' => true, 'data' => $users, 'total' => (int) $uq->get_total()]);
    }

    public function get_user($request) {
        $user = get_userdata((int) $request['id']); if (!$user) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $user->ID, 'email' => $user->user_email, 'display_name' => $user->display_name, 'roles' => array_values($user->roles), 'registered_at' => $user->user_registered]]);
    }

    public function create_user($request) {
        $body = $request->get_json_params() ?: []; $email = isset($body['email']) ? sanitize_email($body['email']) : '';
        $name = isset($body['display_name']) ? sanitize_text_field($body['display_name']) : '';
        $password = isset($body['password']) ? $body['password'] : wp_generate_password();
        if (empty($email)) return new WP_REST_Response(['success' => false, 'message' => 'Email required'], 400);
        if (email_exists($email)) return new WP_REST_Response(['success' => false, 'message' => 'Email exists'], 409);
        $role = isset($body['role']) && in_array($body['role'], ['administrator', 'editor', 'author', 'subscriber']) ? $body['role'] : 'subscriber';
        $id = wp_create_user($email, $password, $email);
        if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Creation failed'], 500);
        if ($name) wp_update_user(['ID' => $id, 'display_name' => $name]);
        $user = new WP_User($id); $user->set_role($role);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $id, 'email' => $email, 'display_name' => $name ?: $email, 'roles' => [$role]]]);
    }

    public function update_user($request) {
        $uid = (int) $request['id']; $user = get_userdata($uid);
        if (!$user) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $body = $request->get_json_params() ?: []; $upd = ['ID' => $uid];
        if (isset($body['display_name'])) $upd['display_name'] = sanitize_text_field($body['display_name']);
        if (!empty($body['email'])) $upd['user_email'] = sanitize_email($body['email']);
        wp_update_user($upd);
        if (isset($body['role'])) { $u = new WP_User($uid); $u->set_role(sanitize_text_field($body['role'])); }
        $user = get_userdata($uid);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $user->ID, 'email' => $user->user_email, 'display_name' => $user->display_name, 'roles' => array_values($user->roles)]]);
    }

    public function delete_user($request) {
        $uid = (int) $request['id'];
        if ($uid === $this->get_current_user_id()) return new WP_REST_Response(['success' => false, 'message' => 'Cannot delete yourself'], 400);
        $user = get_userdata($uid);
        if (!$user) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        if (in_array('administrator', $user->roles)) return new WP_REST_Response(['success' => false, 'message' => '管理者は削除できません'], 400);
        require_once ABSPATH . 'wp-admin/includes/user.php';
        wp_delete_user($uid);
        return new WP_REST_Response(['success' => true, 'data' => ['deleted' => true]]);
    }

    public function reset_user_password($request) {
        $uid = (int) $request['id'];
        $user = get_userdata($uid);
        if (!$user) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        $new_password = wp_generate_password(12, true);
        wp_set_password($new_password, $uid);
        $msg = "{$user->display_name} 様\n\nパスワードがリセットされました。\n新しいパスワード: {$new_password}\n\nログイン後、プロフィール画面から変更することをおすすめします。";
        wp_mail($user->user_email, 'パスワードリセット通知', $msg);
        return new WP_REST_Response(['success' => true, 'data' => ['message' => 'パスワードをリセットしました。新しいパスワードをメールで送信しました。']]);
    }

    // ====== POINTS ======
    public function get_points() {
        $uid = $this->get_current_user_id(); global $wpdb; $t = $wpdb->prefix . 'user_points';
        return new WP_REST_Response(['success' => true, 'data' => ['total' => (int) $wpdb->get_var($wpdb->prepare("SELECT SUM(points) FROM $t WHERE user_id = %d", $uid)), 'history' => $wpdb->get_results($wpdb->prepare("SELECT points, points_type, description, created_at FROM $t WHERE user_id = %d ORDER BY created_at DESC LIMIT 20", $uid))]]);
    }

    public function claim_daily_points() {
        $uid = $this->get_current_user_id(); $today = current_time('Y-m-d'); global $wpdb; $t = $wpdb->prefix . 'user_points';
        if ($wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $t WHERE user_id = %d AND points_type = 'daily' AND DATE(created_at) = %s", $uid, $today))) return new WP_REST_Response(['success' => false, 'message' => 'Already claimed'], 409);
        $wpdb->insert($t, ['user_id' => $uid, 'points' => 10, 'points_type' => 'daily', 'description' => 'デイリーボーナス', 'created_at' => current_time('mysql')]);
        return new WP_REST_Response(['success' => true, 'data' => ['points' => 10]]);
    }

    // ====== MEMBERSHIP ======
    public function get_membership_plans() {
        $plans = get_posts(['post_type' => 'member_plan', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']);
        return new WP_REST_Response(['success' => true, 'data' => array_map(function($p) { return ['id' => $p->ID, 'name' => $p->post_title, 'description' => $p->post_excerpt, 'price' => (int) get_field('plan_price', $p->ID), 'interval' => get_field('plan_interval', $p->ID) ?: 'month', 'features' => array_map(function($f) { return $f['feature']; }, get_field('plan_features', $p->ID) ?: []), 'popular' => (bool) get_field('plan_popular', $p->ID), 'stripe_id' => get_field('plan_stripe_price_id', $p->ID)]; }, $plans)]);
    }

    public function get_current_membership($request) { $uid = $this->get_current_user_id(); $pid = get_user_meta($uid, 'sap_membership_plan', true); if (!$pid) return new WP_REST_Response(['success' => true, 'data' => null]); return new WP_REST_Response(['success' => true, 'data' => ['plan_id' => (int) $pid, 'plan_name' => ($plan = get_post($pid)) ? $plan->post_title : '', 'status' => get_user_meta($uid, 'sap_membership_status', true) ?: 'inactive']]); }

    public function subscribe_membership($request) {
        $uid = $this->get_current_user_id(); $pid = (int) $request->get_param('plan_id'); if (!$pid) return new WP_REST_Response(['success' => false, 'message' => 'Plan required'], 400);
        $plan = get_post($pid); if (!$plan || $plan->post_type !== 'member_plan') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        update_user_meta($uid, 'sap_membership_plan', $pid); update_user_meta($uid, 'sap_membership_status', 'active'); update_user_meta($uid, 'sap_membership_started', current_time('mysql'));
        global $wpdb; $wpdb->insert($wpdb->prefix . 'user_points', ['user_id' => $uid, 'points' => 100, 'points_type' => 'membership', 'description' => '会員登録ボーナス', 'created_at' => current_time('mysql')]);
        return new WP_REST_Response(['success' => true, 'data' => ['plan_id' => $pid, 'status' => 'active']]);
    }

    public function stripe_webhook($request) { return new WP_REST_Response(['success' => true, 'data' => ['received' => true]]); }

    // ====== MEDIA ======
    public function upload_media($request) {
        $files = $request->get_file_params(); if (empty($files['image'])) return new WP_REST_Response(['success' => false, 'message' => 'No file'], 400);
        require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/image.php'; require_once ABSPATH . 'wp-admin/includes/media.php';
        $id = media_handle_upload('image', 0); if (is_wp_error($id)) return new WP_REST_Response(['success' => false, 'message' => 'Upload failed'], 500);
        return new WP_REST_Response(['success' => true, 'data' => ['id' => $id, 'url' => wp_get_attachment_url($id)]]);
    }

    // ====== FORMATTERS ======
    private function format_article($post, $with_content = false) {
        $m = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'all']); $d = wp_get_object_terms($post->ID, 'difficulty', ['fields' => 'all']); $t = wp_get_object_terms($post->ID, 'topic', ['fields' => 'all']); $a = get_userdata($post->post_author);
        $modules = !empty($m) ? array_map(function($tm) { return ['slug' => $tm->slug, 'name' => $tm->name]; }, $m) : [];
        $r = ['id' => $post->ID, 'title' => $post->post_title, 'slug' => $post->post_name, 'excerpt' => get_the_excerpt($post), 'modules' => $modules, 'difficulty' => !empty($d) ? ['slug' => $d[0]->slug, 'name' => $d[0]->name] : null, 'topic' => !empty($t) ? ['slug' => $t[0]->slug, 'name' => $t[0]->name] : null, 'author' => ['id' => $a ? $a->ID : 0, 'display_name' => $a ? $a->display_name : 'パンダ先生', 'avatar' => $a ? get_avatar_url($a->ID) : ''], 'reading_time' => (int) get_post_meta($post->ID, 'article_reading_time', true) ?: 5, 'views' => (int) get_post_meta($post->ID, 'article_views', true), 'created_at' => $post->post_date];
        if ($with_content) $r['content'] = apply_filters('the_content', $post->post_content); return $r;
    }

    private function format_case($post) {
        $mods = wp_get_object_terms($post->ID, 'sap_module', ['fields' => 'slugs']); $s = function($k) use ($post) { $v = get_post_meta($post->ID, $k, true); return is_array($v) ? ($v[0] ?? '') : $v; };
        $rm = (int) $s('case_rate_min'); $rx = (int) $s('case_rate_max');
        $must = get_post_meta($post->ID, 'case_skills_must_flat', true); if (!$must || !is_array($must)) { $acf = get_field('case_skills_must', $post->ID) ?: []; $must = array_map(function($x) { return is_array($x) ? ($x['skill'] ?? '') : $x; }, $acf); }
        $want = get_post_meta($post->ID, 'case_skills_want_flat', true); if (!$want || !is_array($want)) { $acf = get_field('case_skills_want', $post->ID) ?: []; $want = array_map(function($x) { return is_array($x) ? ($x['skill'] ?? '') : $x; }, $acf); }
        return ['id' => $post->ID, 'title' => $post->post_title, 'mods' => $mods, 'rate_min' => $rm, 'rate_max' => $rx, 'rate_label' => "月{$rm}〜{$rx}万", 'hi' => $rx >= 85, 'period' => (string) $s('case_period'), 'utilization' => (string) ($s('case_utilization') ?: '週5'), 'location' => (string) $s('case_location'), 'remote' => (string) $s('case_remote'), 'experience' => (string) $s('case_experience'), 'seats' => (int) $s('case_seats') ?: 1, 'urgent' => (bool) $s('case_urgent'), 'scarce' => (bool) $s('case_scarce'), 'skills_must' => $must, 'skills_want' => $want, 'blurb' => (string) $s('case_blurb'), 'company' => (string) $s('case_company'), 'created_at' => $post->post_date];
    }

    // ===========================================================
    // Contact — お問い合わせ（CPT + ACF）
    // ===========================================================
    public function submit_contact($request) {
        $body = $request->get_json_params() ?: [];
        $name = isset($body['name']) ? sanitize_text_field($body['name']) : '';
        $email = isset($body['email']) ? sanitize_email($body['email']) : '';
        $message = isset($body['message']) ? sanitize_textarea_field($body['message']) : '';
        if (!empty($body['website'])) return new WP_REST_Response(['success' => true, 'message' => '送信されました'], 200);
        if (empty($name) || empty($email) || empty($message)) return new WP_REST_Response(['success' => false, 'message' => '必須項目を入力してください。'], 400);
        if (!is_email($email)) return new WP_REST_Response(['success' => false, 'message' => '正しいメールアドレスを入力してください。'], 400);
        if (empty($body['agreed_privacy'])) return new WP_REST_Response(['success' => false, 'message' => 'プライバシーポリシーに同意してください。'], 400);
        $inquiry_type = isset($body['inquiry_type']) ? sanitize_text_field($body['inquiry_type']) : 'general';
        $author_id = $this->get_current_user_id();
        if (!$author_id) {
            $admins = get_users(['role' => 'administrator', 'number' => 1, 'fields' => 'ID']);
            $author_id = !empty($admins) ? $admins[0] : 1;
        }
        $pid = wp_insert_post(['post_type' => 'contact_inquiry', 'post_title' => sprintf('[%s] %s', $name, mb_substr($message, 0, 40)), 'post_content' => $message, 'post_status' => 'publish', 'post_author' => $author_id]);
        if (is_wp_error($pid)) {
            $err_msg = $pid->get_error_message();
            return new WP_REST_Response(['success' => false, 'message' => '送信に失敗しました: ' . $err_msg], 500);
        }
        update_post_meta($pid, 'contact_name_kana', sanitize_text_field($body['name_kana'] ?? ''));
        update_post_meta($pid, 'contact_phone', sanitize_text_field($body['phone'] ?? ''));
        update_post_meta($pid, 'contact_inquiry_type', $inquiry_type);
        update_post_meta($pid, 'contact_agreed_privacy', '1');
        update_post_meta($pid, 'contact_ip_address', $request->get_header('X-Forwarded-For') ?: ($_SERVER['REMOTE_ADDR'] ?? ''));
        update_post_meta($pid, 'contact_status', 'unread');
        update_post_meta($pid, '_contact_email', $email);
        $admin_email = get_option('admin_email');
        wp_mail($admin_email, '[SAP Panda] お問い合わせ — ' . $name, "お問い合わせを受付\nお名前:{$name}\nメール:{$email}\n種別:{$inquiry_type}\n本文:\n{$message}", ['From: SAP パンダ先生 NAVI <' . $admin_email . '>']);
        wp_mail($email, '【SAP パンダ先生 NAVI】お問い合わせを受け付けました', "{$name} 様\n\nお問い合わせありがとうございます。\n内容を確認の上、1〜3営業日以内にご連絡いたします。", ['From: SAP パンダ先生 NAVI <' . $admin_email . '>']);
        return new WP_REST_Response(['success' => true, 'message' => 'お問い合わせを受け付けました。確認メールをお送りいたします。'], 200);
    }
    public function get_contact_inquiries($request) {
        $per_page = (int) ($request->get_param('per_page') ?: 50);
        $page = (int) ($request->get_param('page') ?: 1);
        $status = $request->get_param('status');
        $args = ['post_type' => 'contact_inquiry', 'posts_per_page' => $per_page, 'paged' => $page, 'post_status' => 'any'];
        if ($status) $args['meta_query'] = [['key' => 'contact_status', 'value' => $status]];
        $q = new WP_Query($args);
        $items = array_map(function ($p) { return ['id' => $p->ID, 'name' => $p->post_title, 'email' => get_post_meta($p->ID, '_contact_email', true) ?: '', 'inquiry_type' => get_post_meta($p->ID, 'contact_inquiry_type', true) ?: 'general', 'message' => $p->post_content, 'status' => get_post_meta($p->ID, 'contact_status', true) ?: 'unread', 'created_at' => $p->post_date]; }, $q->posts);
        $uq = new WP_Query(['post_type' => 'contact_inquiry', 'post_status' => 'any', 'posts_per_page' => -1, 'meta_query' => [['key' => 'contact_status', 'value' => 'unread']], 'fields' => 'ids']);
        return new WP_REST_Response(['success' => true, 'data' => $items, 'total' => $q->found_posts, 'unread_count' => $uq->found_posts, 'page' => $page, 'per_page' => $per_page]);
    }
    public function handle_contact_inquiry($request) {
        $id = (int) $request['id']; $post = get_post($id);
        if (!$post || $post->post_type !== 'contact_inquiry') return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        if ($request->get_method() === 'GET') {
            if (get_post_meta($id, 'contact_status', true) === 'unread') update_post_meta($id, 'contact_status', 'read');
            return new WP_REST_Response(['success' => true, 'data' => ['id' => $post->ID, 'name' => $post->post_title, 'name_kana' => get_post_meta($id, 'contact_name_kana', true), 'email' => get_post_meta($id, '_contact_email', true) ?: '', 'phone' => get_post_meta($id, 'contact_phone', true), 'inquiry_type' => get_post_meta($id, 'contact_inquiry_type', true), 'message' => $post->post_content, 'status' => get_post_meta($id, 'contact_status', true) ?: 'unread', 'memo' => get_post_meta($id, 'contact_memo', true), 'created_at' => $post->post_date]]);
        }
        $body = $request->get_json_params() ?: [];
        if (isset($body['status'])) update_post_meta($id, 'contact_status', sanitize_text_field($body['status']));
        if (isset($body['memo'])) update_post_meta($id, 'contact_memo', sanitize_textarea_field($body['memo']));
        return new WP_REST_Response(['success' => true]);
    }

    // ===========================================================
    // Admin Dashboard — 管理画面統計データ
    // ===========================================================
    public function get_admin_stats() {
        global $wpdb;
        $articles = (int) wp_count_posts('post')->publish;
        $courses = (int) wp_count_posts('course')->publish;
        $knowledge = (int) wp_count_posts('knowledge')->publish;
        $lessons = (int) wp_count_posts('lesson')->publish;
        $uc = count_users(); $users_total = $uc['total_users'];
        $cases = (int) wp_count_posts('sap_case')->publish;
        $quizzes = (int) wp_count_posts('daily_quiz')->publish;
        $videos = (int) wp_count_posts('video')->publish;
        $paths = (int) wp_count_posts('learning_path')->publish;
        $contact_total = (int) wp_count_posts('contact_inquiry')->publish;
        $uq = new WP_Query(['post_type'=>'contact_inquiry','post_status'=>'any','posts_per_page'=>-1,'meta_query'=>[['key'=>'contact_status','value'=>'unread']],'fields'=>'ids']);
        $contact_unread = $uq->found_posts;
        $quiz_total = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}quiz_attempts");
        $quiz_correct = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}quiz_attempts WHERE is_correct=1");
        $total_points = (int)$wpdb->get_var("SELECT SUM(points) FROM {$wpdb->prefix}user_points");

        $recent = function($post_type, $n=5) {
            $items = []; foreach (get_posts(['post_type'=>$post_type,'posts_per_page'=>$n,'post_status'=>'publish']) as $p) {
                $items[] = ['id'=>$p->ID,'title'=>$p->post_title,'created_at'=>$p->post_date,
                    'views'=>(int)get_post_meta($p->ID,'article_views',true),
                    'module'=>($mods=wp_get_object_terms($p->ID,'sap_module',['fields'=>'names']))?$mods[0]:'']; }
            return $items;
        };
        $recent_users = array_map(function($u){ return ['id'=>$u->ID,'name'=>$u->display_name,'email'=>$u->user_email,'avatar'=>get_avatar_url($u->ID,['size'=>40]),'registered_at'=>$u->user_registered]; }, get_users(['orderby'=>'user_registered','order'=>'DESC','number'=>5]));
        $recent_inquiries = []; foreach (get_posts(['post_type'=>'contact_inquiry','posts_per_page'=>5,'post_status'=>'any']) as $p) {
            $recent_inquiries[] = ['id'=>$p->ID,'name'=>$p->post_title,'status'=>get_post_meta($p->ID,'contact_status',true)?:'unread','created_at'=>$p->post_date]; }
        $popular = []; foreach (get_posts(['post_type'=>'post','posts_per_page'=>5,'post_status'=>'publish','meta_key'=>'article_views','orderby'=>'meta_value_num','order'=>'DESC']) as $p) {
            $popular[] = ['id'=>$p->ID,'title'=>$p->post_title,'views'=>(int)get_post_meta($p->ID,'article_views',true)]; }
        return new WP_REST_Response(['success'=>true,'data'=>[
            'counts'=>['articles'=>$articles,'courses'=>$courses,'knowledge'=>$knowledge,'lessons'=>$lessons,'users'=>$users_total,'cases'=>$cases,'quizzes'=>$quizzes,'videos'=>$videos,'paths'=>$paths,'contact_total'=>$contact_total,'contact_unread'=>$contact_unread,'quiz_total'=>$quiz_total,'quiz_correct'=>$quiz_correct,'total_points'=>$total_points],
            'recent_articles'=>$recent('post'),'recent_users'=>$recent_users,'recent_inquiries'=>$recent_inquiries,'popular_articles'=>$popular
        ]]);
    }

    // ===========================================================
    // Plugin Management — プラグイン管理
    // ===========================================================
    public function get_plugins_list() {
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $all_plugins = get_plugins();
        $active_plugins = get_option('active_plugins', []);
        $result = [];
        foreach ($all_plugins as $plugin_file => $plugin_data) {
            $result[] = [
                'file' => $plugin_file,
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version'],
                'description' => wp_trim_words($plugin_data['Description'], 20),
                'author' => $plugin_data['Author'],
                'active' => in_array($plugin_file, $active_plugins),
            ];
        }
        usort($result, function($a, $b) {
            if (strpos($a['file'], 'sap-panda-api') !== false) return -1;
            if (strpos($b['file'], 'sap-panda-api') !== false) return 1;
            return $a['active'] === $b['active'] ? 0 : ($a['active'] ? -1 : 1);
        });
        return new WP_REST_Response(['success' => true, 'data' => $result, 'total' => count($result)]);
    }

    public function activate_plugin($request) {
        $body = $request->get_json_params() ?: [];
        $file = isset($body['file']) ? sanitize_text_field($body['file']) : '';
        if (empty($file)) return new WP_REST_Response(['success' => false, 'message' => 'プラグインファイルが指定されていません。'], 400);
        $plugin_path = WP_PLUGIN_DIR . '/' . $file;
        if (!file_exists($plugin_path)) {
            return new WP_REST_Response(['success' => false, 'message' => 'プラグインファイルが見つかりません: ' . $file], 404);
        }
        $active = get_option('active_plugins', []);
        if (in_array($file, $active)) {
            return new WP_REST_Response(['success' => true, 'message' => '既に有効化されています。']);
        }
        $active[] = $file;
        update_option('active_plugins', $active);
        wp_clean_plugins_cache();
        return new WP_REST_Response(['success' => true, 'message' => 'プラグインを有効化しました。']);
    }

    public function deactivate_plugin($request) {
        $body = $request->get_json_params() ?: [];
        $file = isset($body['file']) ? sanitize_text_field($body['file']) : '';
        if (empty($file)) return new WP_REST_Response(['success' => false, 'message' => 'プラグインファイルが指定されていません。'], 400);
        $active = get_option('active_plugins', []);
        if (!in_array($file, $active)) {
            return new WP_REST_Response(['success' => true, 'message' => '既に無効化されています。']);
        }
        $active = array_values(array_filter($active, function($p) use ($file) { return $p !== $file; }));
        update_option('active_plugins', $active);
        wp_clean_plugins_cache();
        return new WP_REST_Response(['success' => true, 'message' => 'プラグインを無効化しました。']);
    }

    public function seed_videos_api() {
        if ( function_exists( 'sap_panda_seed_videos' ) ) {
            $result = sap_panda_seed_videos();
            return new WP_REST_Response( [ 'success' => true, 'message' => $result . ' videos created.' ] );
        }
        return new WP_REST_Response( [ 'success' => false, 'message' => 'Seed function not found.' ], 500 );
    }


    // ===========================================================
    // SEO Settings — サイト全体SEO設定の取得/保存
    // ===========================================================
    public function handle_seo_settings($request) {
        $option_key = 'sap_panda_seo_settings';
        if ($request->get_method() === 'GET') {
            $defaults = [
                'site_name' => 'SAP パンダ先生 NAVI',
                'site_description' => 'SAP のしくみを、パンダ先生がやさしく解説。財務・購買・販売・生産・人事 — むずかしい SAP を「わからない…！」から「なるほど！」へ。',
                'default_keywords' => 'SAP,S/4HANA,ERP,会計,ABAP,FI,CO,MM,SD,学習,パンダ先生,ナレッジ,SAP資格,SAPコンサル',
                'og_image' => '/panda-sensei.png',
                'twitter_handle' => '@sap_panda',
                'google_analytics_id' => '',
                'robots_txt' => "User-agent: *\nAllow: /\nSitemap: https://sap-panda.com/sitemap.xml\nDisallow: /admin\nDisallow: /login\nDisallow: /register\nDisallow: /profile\nDisallow: /wp-admin\nDisallow: /wp-json/sap/v1/auth/\n",
                'geo_enabled' => true,
                'organization_name' => 'SAP パンダ先生 NAVI',
                'organization_logo' => '/panda-sensei.png',
                'organization_url' => 'https://sap-panda.com',
                'social_links' => [],
                'ai_optimization' => true,
                'faq_page_url' => '/faq',
            ];
            $settings = get_option($option_key, []);
            foreach ($defaults as $k => $v) {
                if (!isset($settings[$k])) $settings[$k] = $v;
            }
            return new WP_REST_Response(['success' => true, 'data' => $settings]);
        }
        // PUT
        $body = $request->get_json_params() ?: [];
        // 許可するキーのみ保存
        $allowed_keys = ['site_name','site_description','default_keywords','og_image','twitter_handle','google_analytics_id','robots_txt','geo_enabled','organization_name','organization_logo','organization_url','social_links','ai_optimization','faq_page_url'];
        $settings = get_option($option_key, []);
        foreach ($allowed_keys as $key) {
            if (isset($body[$key])) {
                $val = is_string($body[$key]) ? sanitize_text_field($body[$key]) : $body[$key];
                if ($key === 'robots_txt') $val = sanitize_textarea_field($body[$key]);
                if ($key === 'social_links' && is_array($body[$key])) $val = array_map('sanitize_text_field', $body[$key]);
                $settings[$key] = $val;
            }
        }
        update_option($option_key, $settings);
        // robots.txt をファイルに書き出し
        if (isset($body['robots_txt'])) {
            $robots_file = ABSPATH . 'robots.txt';
            @file_put_contents($robots_file, $body['robots_txt']);
        }
        // Google Analytics スクリプトの有効/無効
        if (isset($body['google_analytics_id'])) {
            if (!empty($body['google_analytics_id'])) {
                update_option('sap_panda_ga_id', sanitize_text_field($body['google_analytics_id']));
            } else {
                delete_option('sap_panda_ga_id');
            }
        }
        return new WP_REST_Response(['success' => true, 'message' => 'SEO設定を保存しました。']);
    }

    public function handle_seo_keywords($request) {
        $option_key = 'sap_panda_seo_keywords';
        if ($request->get_method() === 'GET') {
            return new WP_REST_Response(['success' => true, 'data' => get_option($option_key, [])]);
        }
        $body = $request->get_json_params() ?: [];
        $keyword = isset($body['keyword']) ? sanitize_text_field($body['keyword']) : '';
        if (empty($keyword)) return new WP_REST_Response(['success' => false, 'message' => 'キーワードを入力してください。'], 400);
        $keywords = get_option($option_key, []);
        if ($request->get_method() === 'POST') {
            if (!in_array($keyword, $keywords)) {
                $keywords[] = $keyword;
                update_option($option_key, $keywords);
            }
            return new WP_REST_Response(['success' => true, 'data' => $keywords]);
        }
        // DELETE
        $keywords = array_values(array_filter($keywords, function($k) use ($keyword) { return $k !== $keyword; }));
        update_option($option_key, $keywords);
        return new WP_REST_Response(['success' => true, 'data' => $keywords]);
    }

    public function handle_faq_schemas($request) {
        $option_key = 'sap_panda_faq_schemas';
        if ($request->get_method() === 'GET') {
            return new WP_REST_Response(['success' => true, 'data' => get_option($option_key, [])]);
        }
        $body = $request->get_json_params() ?: [];
        $question = isset($body['question']) ? sanitize_text_field($body['question']) : '';
        $answer = isset($body['answer']) ? wp_kses_post($body['answer']) : '';
        if (empty($question) || empty($answer)) return new WP_REST_Response(['success' => false, 'message' => '質問と回答を入力してください。'], 400);
        $items = get_option($option_key, []);
        $max_id = 0;
        foreach ($items as $item) { if ($item['id'] > $max_id) $max_id = $item['id']; }
        $items[] = ['id' => $max_id + 1, 'question' => $question, 'answer' => $answer, 'created_at' => current_time('mysql')];
        update_option($option_key, $items);
        return new WP_REST_Response(['success' => true, 'data' => $items]);
    }

    public function handle_faq_schema_item($request) {
        $option_key = 'sap_panda_faq_schemas';
        $id = (int) $request['id'];
        $items = get_option($option_key, []);
        $found = false;
        foreach ($items as $item) { if ($item['id'] === $id) { $found = true; break; } }
        if (!$found) return new WP_REST_Response(['success' => false, 'message' => 'Not found'], 404);
        if ($request->get_method() === 'DELETE') {
            $items = array_values(array_filter($items, function($item) use ($id) { return $item['id'] !== $id; }));
            update_option($option_key, $items);
            return new WP_REST_Response(['success' => true, 'message' => '削除しました。']);
        }
        // PUT
        $body = $request->get_json_params() ?: [];
        $items = array_map(function($item) use ($id, $body) {
            if ($item['id'] !== $id) return $item;
            if (isset($body['question'])) $item['question'] = sanitize_text_field($body['question']);
            if (isset($body['answer'])) $item['answer'] = wp_kses_post($body['answer']);
            return $item;
        }, $items);
        update_option($option_key, $items);
        return new WP_REST_Response(['success' => true, 'message' => '更新しました。']);
    }

    // ===========================================================
    // Sitemap — サイトマップXML生成
    // ===========================================================
    public function generate_sitemap($request) {
        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $base = 'https://sap-panda.com';
        $today = current_time('Y-m-d');

        // Static pages
        $static = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/modules', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/paths', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/quiz-page', 'priority' => '0.7', 'changefreq' => 'daily'],
            ['loc' => '/cases', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['loc' => '/video', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => '/about', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['loc' => '/team', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['loc' => '/contact', 'priority' => '0.4', 'changefreq' => 'monthly'],
        ];
        foreach ($static as $s) {
            $sitemap .= '<url><loc>' . $base . $s['loc'] . '</loc><priority>' . $s['priority'] . '</priority><changefreq>' . $s['changefreq'] . '</changefreq></url>';
        }

        // Module categories
        $modules = ['fi','co','mm','sd','pp','hr','abap','basis','s4'];
        foreach ($modules as $m) {
            $sitemap .= '<url><loc>' . $base . '/category/' . $m . '</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>';
        }

        // Articles (posts)
        $articles = get_posts(['post_type' => 'post', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($articles as $a) {
            $modified = substr($a->post_modified, 0, 10);
            $sitemap .= '<url><loc>' . $base . '/article/' . urlencode($a->post_name) . '</loc><priority>0.7</priority><changefreq>monthly</changefreq><lastmod>' . $modified . '</lastmod></url>';
        }

        // Courses
        $courses = get_posts(['post_type' => 'course', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($courses as $c) {
            $modified = substr($c->post_modified, 0, 10);
            $sitemap .= '<url><loc>' . $base . '/course/' . $c->ID . '</loc><priority>0.7</priority><changefreq>monthly</changefreq><lastmod>' . $modified . '</lastmod></url>';
        }

        // Knowledge
        $knowledge = get_posts(['post_type' => 'knowledge', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($knowledge as $k) {
            $modified = substr($k->post_modified, 0, 10);
            $sitemap .= '<url><loc>' . $base . '/knowledge/' . $k->ID . '</loc><priority>0.6</priority><changefreq>monthly</changefreq><lastmod>' . $modified . '</lastmod></url>';
        }

        // Lessons
        $lessons = get_posts(['post_type' => 'lesson', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($lessons as $l) {
            $sitemap .= '<url><loc>' . $base . '/lesson/' . $l->ID . '</loc><priority>0.6</priority><changefreq>monthly</changefreq></url>';
        }

        // Learning paths
        $paths = get_posts(['post_type' => 'learning_path', 'posts_per_page' => 50, 'post_status' => 'publish']);
        foreach ($paths as $p) {
            $sitemap .= '<url><loc>' . $base . '/learning/' . $p->ID . '</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>';
        }

        // Steps
        $steps = get_posts(['post_type' => 'path_step', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($steps as $s) {
            $sitemap .= '<url><loc>' . $base . '/step/' . $s->ID . '</loc><priority>0.6</priority><changefreq>monthly</changefreq></url>';
        }

        // Videos
        $videos = get_posts(['post_type' => 'video', 'posts_per_page' => 200, 'post_status' => 'publish']);
        foreach ($videos as $v) {
            $sitemap .= '<url><loc>' . $base . '/video' . '</loc><priority>0.5</priority><changefreq>weekly</changefreq></url>';
        }

        $sitemap .= '</urlset>';

        return new WP_REST_Response($sitemap, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
