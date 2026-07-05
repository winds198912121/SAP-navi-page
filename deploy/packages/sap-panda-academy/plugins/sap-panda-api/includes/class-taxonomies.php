<?php
/**
 * Custom Taxonomies for SAP Panda
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_Taxonomies {

    public function register() {
        $this->register_sap_module();
        $this->register_difficulty();
        $this->register_topic();
        $this->seed_default_terms();
    }

    private function register_sap_module() {
        register_taxonomy('sap_module', ['post', 'course', 'exam', 'knowledge', 'sap_case', 'video', 'path_step'], [
            'labels' => [
                'name'          => 'SAP モジュール',
                'singular_name' => 'SAP モジュール',
                'add_new_item'  => '新規モジュール追加',
                'edit_item'     => 'モジュール編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => ['slug' => 'module'],
            'hierarchical'      => false,
        ]);
    }

    private function register_difficulty() {
        register_taxonomy('difficulty', ['post', 'course', 'exam'], [
            'labels' => [
                'name'          => '難易度',
                'singular_name' => '難易度',
                'add_new_item'  => '新規難易度追加',
                'edit_item'     => '難易度編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => ['slug' => 'difficulty'],
            'hierarchical'      => false,
        ]);
    }

    private function register_topic() {
        register_taxonomy('topic', ['post'], [
            'labels' => [
                'name'          => 'トピック',
                'singular_name' => 'トピック',
                'add_new_item'  => '新規トピック追加',
                'edit_item'     => 'トピック編集',
            ],
            'public'            => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => ['slug' => 'topic'],
            'hierarchical'      => false,
        ]);
    }

    public function seed_default_terms() {
        $seeded_version = get_option('sap_panda_terms_version', '');
        if ('2.0' === $seeded_version) {
            return;
        }

        // SAP Modules
        $modules = [
            ['slug' => 'fi',  'name' => 'FI · 財務会計'],
            ['slug' => 'co',  'name' => 'CO · 管理会計'],
            ['slug' => 'mm',  'name' => 'MM · 購買・在庫'],
            ['slug' => 'sd',  'name' => 'SD · 販売管理'],
            ['slug' => 'pp',  'name' => 'PP · 生産計画'],
            ['slug' => 'hr',  'name' => 'HR · 人事管理'],
            ['slug' => 'abap','name' => 'ABAP · 開発言語'],
            ['slug' => 'basis','name' => 'Basis · 基盤管理'],
            ['slug' => 's4',  'name' => 'S/4 · S/4HANA'],
        ];
        foreach ($modules as $m) {
            if (!term_exists($m['slug'], 'sap_module')) {
                wp_insert_term($m['name'], 'sap_module', ['slug' => $m['slug']]);
            }
        }

        // Difficulty
        $difficulties = [
            ['slug' => 'beginner',     'name' => '初級'],
            ['slug' => 'intermediate', 'name' => '中級'],
            ['slug' => 'advanced',     'name' => '上級'],
        ];
        foreach ($difficulties as $d) {
            if (!term_exists($d['slug'], 'difficulty')) {
                wp_insert_term($d['name'], 'difficulty', ['slug' => $d['slug']]);
            }
        }

        // Topics
        $topics = [
            ['slug' => 'basic',        'name' => '基本概念'],
            ['slug' => 'master',       'name' => 'マスタ設計'],
            ['slug' => 'transaction',  'name' => 'トランザクション'],
            ['slug' => 'process',      'name' => '業務プロセス'],
            ['slug' => 'glossary',     'name' => '用語集'],
            ['slug' => 'trends',       'name' => 'SAPトレンド'],
            ['slug' => 'career-guide', 'name' => '転職ガイド'],
        ];
        foreach ($topics as $t) {
            if (!term_exists($t['slug'], 'topic')) {
                wp_insert_term($t['name'], 'topic', ['slug' => $t['slug']]);
            }
        }

        update_option('sap_panda_terms_version', '2.0');
    }
}
