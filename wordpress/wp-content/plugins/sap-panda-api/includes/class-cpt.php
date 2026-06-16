<?php
/**
 * Custom Post Types for SAP Panda
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_CPT {

    public function register() {
        $this->register_course();
        $this->register_teacher();
        $this->register_exam();
        $this->register_knowledge();
        $this->register_daily_quiz();
        $this->register_video();
        $this->register_learning_path();
        $this->register_path_step();
        $this->register_lesson();
        $this->register_sap_case();
        $this->register_member_plan();
        $this->register_contact_inquiry();
    }

    private function register_contact_inquiry() {
        register_post_type('contact_inquiry', [
            'labels' => [
                'name'          => 'お問い合わせ',
                'singular_name' => 'お問い合わせ',
                'add_new_item'  => '新規追加',
                'edit_item'     => '編集',
                'view_item'     => '表示',
                'search_items'  => '検索',
                'not_found'     => 'お問い合わせはありません',
                'not_found_in_trash' => 'ゴミ箱にお問い合わせはありません',
                'all_items'     => 'お問い合わせ一覧',
            ],
            'public'            => false,
            'show_ui'           => true,
            'show_in_menu'      => true,
            'menu_icon'         => 'dashicons-email-alt',
            'menu_position'     => 25,
            'supports'          => ['title', 'editor', 'author'],
            'show_in_rest'      => true,
            'capability_type'   => 'post',
            'map_meta_cap'      => true,
        ]);
    }

    private function register_member_plan() {
        register_post_type('member_plan', [
            'labels' => [
                'name'          => '会員プラン',
                'singular_name' => '会員プラン',
                'add_new_item'  => '新規プラン追加',
                'edit_item'     => 'プラン編集',
            ],
            'public'            => false,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-awards',
            'supports'          => ['title', 'editor'],
            'rewrite'           => ['slug' => 'sap/member-plan'],
        ]);
    }

    private function register_course() {
        register_post_type('course', [
            'labels' => [
                'name'          => 'コース',
                'singular_name' => 'コース',
                'add_new_item'  => '新規コース追加',
                'edit_item'     => 'コース編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-welcome-learn-more',
            'supports'          => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite'           => ['slug' => 'sap/course'],
            'has_archive'       => false,
        ]);
    }

    private function register_teacher() {
        register_post_type('teacher', [
            'labels' => [
                'name'          => '講師',
                'singular_name' => '講師',
                'add_new_item'  => '新規講師追加',
                'edit_item'     => '講師編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-businessman',
            'supports'          => ['title', 'editor', 'thumbnail'],
            'rewrite'           => ['slug' => 'sap/teacher'],
            'has_archive'       => false,
        ]);
    }

    private function register_exam() {
        register_post_type('exam', [
            'labels' => [
                'name'          => '試験',
                'singular_name' => '試験',
                'add_new_item'  => '新規問題追加',
                'edit_item'     => '問題編集',
            ],
            'public'            => false,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-editor-help',
            'supports'          => ['title'],
            'rewrite'           => ['slug' => 'sap/exam'],
        ]);
    }

    private function register_knowledge() {
        register_post_type('knowledge', [
            'labels' => [
                'name'          => 'ナレッジ',
                'singular_name' => 'ナレッジ',
                'add_new_item'  => '新規ナレッジ追加',
                'edit_item'     => 'ナレッジ編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-book',
            'supports'          => ['title', 'editor'],
            'rewrite'           => ['slug' => 'sap/knowledge'],
            'has_archive'       => true,
        ]);
    }

    private function register_video() {
        register_post_type('video', [
            'labels' => [
                'name'          => '動画',
                'singular_name' => '動画',
                'add_new_item'  => '新規動画追加',
                'edit_item'     => '動画編集',
                'all_items'     => '全動画',
                'not_found'     => '動画がありません。',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-video-alt3',
            'supports'          => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite'           => ['slug' => 'sap/video'],
            'has_archive'       => true,
        ]);
    }

    private function register_daily_quiz() {
        register_post_type('daily_quiz', [
            'labels' => [
                'name'          => '每日一问',
                'singular_name' => '每日一问',
                'add_new_item'  => '新規問題追加',
                'edit_item'     => '問題編集',
            ],
            'public'            => false,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-lightbulb',
            'supports'          => ['title'],
            'rewrite'           => ['slug' => 'sap/daily-quiz'],
        ]);
    }

    private function register_learning_path() {
        register_post_type('learning_path', [
            'labels' => [
                'name'          => '学習パス',
                'singular_name' => '学習パス',
                'add_new_item'  => '新規パス追加',
                'edit_item'     => 'パス編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-chart-area',
            'supports'          => ['title', 'editor'],
            'rewrite'           => ['slug' => 'sap/learning-path'],
            'has_archive'       => false,
        ]);
    }

    private function register_path_step() {
        register_post_type('path_step', [
            'labels' => [
                'name'          => '学習ステップ',
                'singular_name' => '学習ステップ',
                'add_new_item'  => '新規ステップ追加',
                'edit_item'     => 'ステップ編集',
                'all_items'     => '全ステップ',
                'not_found'     => 'ステップがありません。',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-editor-ol',
            'supports'          => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite'           => ['slug' => 'sap/step'],
            'has_archive'       => false,
            'show_in_menu'      => 'edit.php?post_type=learning_path',
            'capability_type'   => 'post',
            'map_meta_cap'      => true,
        ]);
    }

    private function register_lesson() {
        register_post_type('lesson', [
            'labels' => [
                'name'          => 'レッスン',
                'singular_name' => 'レッスン',
                'add_new_item'  => '新規レッスン追加',
                'edit_item'     => 'レッスン編集',
                'all_items'     => '全レッスン',
                'not_found'     => 'レッスンがありません。',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-editor-ol',
            'supports'          => ['title', 'editor', 'thumbnail', 'excerpt'],
            'rewrite'           => ['slug' => 'sap/lesson'],
            'has_archive'       => false,
            'show_in_menu'      => 'edit.php?post_type=course',
            'capability_type'   => 'post',
            'map_meta_cap'      => true,
        ]);
    }

    private function register_sap_case() {
        register_post_type('sap_case', [
            'labels' => [
                'name'          => '案件',
                'singular_name' => '案件',
                'add_new_item'  => '新規案件追加',
                'edit_item'     => '案件編集',
            ],
            'public'            => false,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'menu_icon'         => 'dashicons-portfolio',
            'supports'          => ['title', 'editor'],
            'rewrite'           => ['slug' => 'sap/case'],
        ]);
    }
}
