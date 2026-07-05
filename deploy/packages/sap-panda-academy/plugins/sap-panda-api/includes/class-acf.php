<?php
/**
 * ACF Field Groups and Blocks for SAP Panda
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_ACF {

	public function register_fields() {
		$this->register_module_options();
		$this->register_article_fields();
		$this->register_quiz_fields();
		$this->register_path_fields();
		$this->register_case_fields();
		$this->register_membership_fields();
		$this->register_contact_fields();
	}

	// ============================================================
	//  Options Page: モジュール設定
	//  管理画面 → 設定 → モジュール設定
	// ============================================================
	private function register_module_options() {
		if ( function_exists( 'acf_add_options_sub_page' ) ) {
			acf_add_options_sub_page( array(
				'page_title'  => 'モジュール設定',
				'menu_title'  => 'モジュール設定',
				'parent_slug' => 'options-general.php',
				'menu_slug'   => 'sap-panda-modules',
				'capability'  => 'manage_options',
			) );
		}

		acf_add_local_field_group( array(
			'key'    => 'group_sap_modules',
			'title'  => 'SAP モジュール定義（9モジュール）',
			'fields' => $this->get_module_fields(),
			'location' => array( array(
				array(
					'param'    => 'options_page',
					'operator' => '==',
					'value'    => 'sap-panda-modules',
				),
			) ),
			'position' => 'normal',
		) );
	}

	/**
	 * 9モジュールのACFグループフィールド定義を返す。
	 */
	private function get_module_fields() {
		$modules = array(
			'fi'    => array( 'label' => 'FI · 財務会計',    'code' => 'FI',   'color' => '#2f6d44', 'bg' => '#d8ead9' ),
			'co'    => array( 'label' => 'CO · 管理会計',    'code' => 'CO',   'color' => '#2641a1', 'bg' => '#dde4fc' ),
			'mm'    => array( 'label' => 'MM · 購買・在庫',  'code' => 'MM',   'color' => '#a25411', 'bg' => '#fde0c2' ),
			'sd'    => array( 'label' => 'SD · 販売管理',    'code' => 'SD',   'color' => '#b62a4a', 'bg' => '#ffdfe6' ),
			'pp'    => array( 'label' => 'PP · 生産計画',    'code' => 'PP',   'color' => '#4828a8', 'bg' => '#e4dffb' ),
			'hr'    => array( 'label' => 'HR · 人事管理',    'code' => 'HR',   'color' => '#8a6212', 'bg' => '#fee9b3' ),
			'abap'  => array( 'label' => 'ABAP · 開発言語',  'code' => 'ABAP', 'color' => '#1f6f6f', 'bg' => '#cfecec' ),
			'basis' => array( 'label' => 'Basis · 基盤管理', 'code' => 'BS',   'color' => '#4a432d', 'bg' => '#e3e1d8' ),
			's4'    => array( 'label' => 'S/4 · S/4HANA',   'code' => 'S4',   'color' => '#1864a3', 'bg' => '#d1ecf9' ),
		);

		$fields = array();
		$i      = 0;

		foreach ( $modules as $slug => $m ) {
			$i++;
			$prefix = 'field_mod_' . $slug;

			$fields[] = array(
				'key'        => $prefix . '_group',
				'label'      => $m['label'],
				'name'       => 'mod_' . $slug,
				'type'       => 'group',
				'layout'     => 'block',
				'wrapper'    => array( 'width' => '50%' ),
				'sub_fields' => array(
					array(
						'key'   => $prefix . '_slug',
						'label' => 'スラッグ',
						'name'  => 'slug',
						'type'  => 'text',
						'default_value' => $slug,
						'wrapper' => array( 'width' => '30' ),
					),
					array(
						'key'   => $prefix . '_code',
						'label' => 'コード',
						'name'  => 'code',
						'type'  => 'text',
						'default_value' => $m['code'],
						'wrapper' => array( 'width' => '30' ),
					),
					array(
						'key'   => $prefix . '_order',
						'label' => '表示順',
						'name'  => 'order',
						'type'  => 'number',
						'min'   => 1,
						'max'   => 99,
						'default_value' => $i,
						'wrapper' => array( 'width' => '20' ),
					),
					array(
						'key'   => $prefix . '_name_ja',
						'label' => '日本語名',
						'name'  => 'name_ja',
						'type'  => 'text',
						'default_value' => explode('·', $m['label'])[1] ?? $slug,
					),
					array(
						'key'   => $prefix . '_name_en',
						'label' => '英語名',
						'name'  => 'name_en',
						'type'  => 'text',
					),
					array(
						'key'   => $prefix . '_color',
						'label' => 'カラー',
						'name'  => 'color',
						'type'  => 'color_picker',
						'default_value' => $m['color'],
						'wrapper' => array( 'width' => '50' ),
					),
					array(
						'key'   => $prefix . '_bg_color',
						'label' => '背景カラー',
						'name'  => 'bg_color',
						'type'  => 'color_picker',
						'default_value' => $m['bg'],
						'wrapper' => array( 'width' => '50' ),
					),
					array(
						'key'   => $prefix . '_levels',
						'label' => 'レベル',
						'name'  => 'levels',
						'type'  => 'checkbox',
						'choices' => array(
							'初級' => '初級',
							'中級' => '中級',
							'上級' => '上級',
						),
						'layout' => 'horizontal',
						'default_value' => array( '初級', '中級', '上級' ),
					),
					array(
						'key'   => $prefix . '_description',
						'label' => '説明',
						'name'  => 'description',
						'type'  => 'textarea',
						'rows'  => 3,
					),
				),
			);
		}

		// 区切り + 使い方説明
		$fields[] = array(
			'key'   => 'field_mods_help',
			'label' => '💡 使い方',
			'name'  => '',
			'type'  => 'message',
			'message' => '
各モジュールの設定を編集できます。
ACF Options に保存されるため、タクソノミーのタームとは独立しています。

- モジュール設定は REST API `/wp-json/sap/v1/modules` で取得されます
- スラッグは記事の `sap_module` タクソノミーと紐づくキーです
- 変更後は忘れず「保存」ボタンをクリックしてください',
		);

		return $fields;
	}

	// ============================================================
	//  既存のフィールドグループ（変更なし）
	// ============================================================
	private function register_article_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_article',
			'title'  => '記事メタ情報',
			'fields' => array(
				array(
					'key'   => 'field_article_reading_time',
					'label' => '読了時間（分）',
					'name'  => 'article_reading_time',
					'type'  => 'number',
					'min'   => 1,
					'max'   => 120,
					'default_value' => 5,
				),
				array(
					'key'   => 'field_article_cover_type',
					'label' => 'カバー画像タイプ',
					'name'  => 'article_cover_type',
					'type'  => 'select',
					'choices' => array(
						'class'      => '教室',
						'blackboard' => '黒板',
						'learning'   => '学習',
						'highfive'   => 'ハイタッチ',
					),
					'default_value' => 'class',
				),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'post' ) ) ),
		) );
	}

	private function register_quiz_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_quiz',
			'title'  => 'クイズ設定',
			'fields' => array(
				array(
					'key'      => 'field_quiz_options',
					'label'    => '選択肢',
					'name'     => 'quiz_options',
					'type'     => 'repeater',
					'min'      => 4,
					'max'      => 4,
					'sub_fields' => array(
						array( 'key' => 'field_quiz_option_text', 'label' => '選択肢テキスト', 'name' => 'option_text', 'type' => 'text' ),
						array( 'key' => 'field_quiz_option_correct', 'label' => '正解', 'name' => 'is_correct', 'type' => 'true_false' ),
					),
				),
				array( 'key' => 'field_quiz_explanation', 'label' => '解説', 'name' => 'quiz_explanation', 'type' => 'textarea' ),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'daily_quiz' ) ) ),
		) );
	}

	private function register_path_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_path',
			'title'  => '学習パス設定',
			'fields' => array(
				array( 'key' => 'field_path_audience', 'label' => '対象', 'name' => 'path_audience', 'type' => 'text' ),
				array( 'key' => 'field_path_description', 'label' => '説明', 'name' => 'path_description', 'type' => 'textarea' ),
				array(
					'key'      => 'field_path_steps',
					'label'    => 'ステップ',
					'name'     => 'path_steps',
					'type'     => 'repeater',
					'min'      => 1,
					'sub_fields' => array(
						array( 'key' => 'field_path_step_title', 'label' => 'タイトル', 'name' => 'step_title', 'type' => 'text' ),
						array( 'key' => 'field_path_step_time', 'label' => '所要時間', 'name' => 'step_time', 'type' => 'text' ),
					),
				),
				array( 'key' => 'field_path_duration', 'label' => '総時間', 'name' => 'path_duration', 'type' => 'text' ),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'learning_path' ) ) ),
		) );
	}

	private function register_case_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_case',
			'title'  => '案件詳細',
			'fields' => array(
				array( 'key' => 'field_case_rate_min', 'label' => '最低単価（万円）', 'name' => 'case_rate_min', 'type' => 'number' ),
				array( 'key' => 'field_case_rate_max', 'label' => '最高単価（万円）', 'name' => 'case_rate_max', 'type' => 'number' ),
				array( 'key' => 'field_case_period', 'label' => '契約期間', 'name' => 'case_period', 'type' => 'text' ),
				array( 'key' => 'field_case_utilization', 'label' => '稼働率', 'name' => 'case_utilization', 'type' => 'text' ),
				array( 'key' => 'field_case_location', 'label' => '勤務地', 'name' => 'case_location', 'type' => 'text' ),
				array( 'key' => 'field_case_remote', 'label' => 'リモート可否', 'name' => 'case_remote', 'type' => 'text' ),
				array( 'key' => 'field_case_experience', 'label' => '必要経験', 'name' => 'case_experience', 'type' => 'text' ),
				array( 'key' => 'field_case_seats', 'label' => '募集人数', 'name' => 'case_seats', 'type' => 'number', 'default_value' => 1 ),
				array( 'key' => 'field_case_urgent', 'label' => '急募', 'name' => 'case_urgent', 'type' => 'true_false', 'ui' => true ),
				array( 'key' => 'field_case_scarce', 'label' => '残り僅か', 'name' => 'case_scarce', 'type' => 'true_false', 'ui' => true ),
				array( 'key' => 'field_case_blurb', 'label' => '案件紹介', 'name' => 'case_blurb', 'type' => 'textarea' ),
				array( 'key' => 'field_case_company', 'label' => '会社名', 'name' => 'case_company', 'type' => 'text' ),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'sap_case' ) ) ),
		) );
	}

	private function register_membership_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_membership',
			'title'  => '会員プラン設定',
			'fields' => array(
				array( 'key' => 'field_plan_price', 'label' => '価格（円）', 'name' => 'plan_price', 'type' => 'number', 'min' => 0, 'default_value' => 980 ),
				array( 'key' => 'field_plan_interval', 'label' => '請求間隔', 'name' => 'plan_interval', 'type' => 'select', 'choices' => array( 'month' => '月額', 'year' => '年額' ), 'default_value' => 'month' ),
				array( 'key' => 'field_plan_popular', 'label' => 'おすすめ表示', 'name' => 'plan_popular', 'type' => 'true_false', 'ui' => true ),
				array( 'key' => 'field_plan_stripe_id', 'label' => 'Stripe Price ID', 'name' => 'plan_stripe_price_id', 'type' => 'text' ),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'member_plan' ) ) ),
		) );
	}

	private function register_contact_fields() {
		acf_add_local_field_group( array(
			'key'    => 'group_sap_contact',
			'title'  => 'お問い合わせ詳細',
			'fields' => array(
				array( 'key' => 'field_contact_name_kana', 'label' => 'フリガナ', 'name' => 'contact_name_kana', 'type' => 'text' ),
				array( 'key' => 'field_contact_phone', 'label' => '電話番号', 'name' => 'contact_phone', 'type' => 'text' ),
				array( 'key' => 'field_contact_inquiry_type', 'label' => 'お問い合わせ種別', 'name' => 'contact_inquiry_type', 'type' => 'select', 'choices' => array( 'general' => '一般的なお問い合わせ', 'course' => 'コースについて', 'case' => '案件掲載について', 'partnership' => '提携について', 'other' => 'その他' ), 'default_value' => 'general' ),
				array( 'key' => 'field_contact_agreed_privacy', 'label' => 'プライバシーポリシー同意', 'name' => 'contact_agreed_privacy', 'type' => 'true_false', 'ui' => true ),
				array( 'key' => 'field_contact_status', 'label' => 'ステータス', 'name' => 'contact_status', 'type' => 'select', 'choices' => array( 'unread' => '未読', 'read' => '既読', 'replied' => '返信済' ), 'default_value' => 'unread' ),
				array( 'key' => 'field_contact_memo', 'label' => 'メモ', 'name' => 'contact_memo', 'type' => 'textarea', 'instructions' => '管理者用メモ' ),
			),
			'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'contact_inquiry' ) ) ),
		) );
	}

	// ============================================================
	//  Blocks
	// ============================================================
	public function register_blocks() {
		if ( ! function_exists( 'acf_register_block_type' ) ) {
			return;
		}

		acf_register_block_type( array(
			'name'            => 'panda-dialog',
			'title'           => 'パンダ先生の吹き出し',
			'description'     => 'パンダ先生の会話バブル',
			'render_callback' => array( $this, 'render_panda_dialog' ),
			'category'        => 'sap-panda',
			'icon'            => 'format-chat',
			'keywords'        => array( 'panda', 'dialog', 'sensei' ),
		) );

		acf_register_block_type( array(
			'name'            => 'student-dialog',
			'title'           => 'たろうくんの吹き出し',
			'description'     => '生徒の会話バブル',
			'render_callback' => array( $this, 'render_student_dialog' ),
			'category'        => 'sap-panda',
			'icon'            => 'admin-users',
			'keywords'        => array( 'student', 'dialog', 'taro' ),
		) );

		acf_register_block_type( array(
			'name'            => 'callout-box',
			'title'           => 'コールアウトボックス',
			'description'     => 'ヒント/警告の強調ボックス',
			'render_callback' => array( $this, 'render_callout_box' ),
			'category'        => 'sap-panda',
			'icon'            => 'info',
			'keywords'        => array( 'callout', 'info', 'warn' ),
		) );
	}

	public function render_panda_dialog( $block, $content = '', $is_preview = false, $post_id = 0 ) {
		$mood = get_field( 'dialog_mood' ) ?: 'happy';
		$text = get_field( 'dialog_text' ) ?: '';
		?>
		<div class="dialog">
			<div class="av"><?php $this->panda_svg( $mood ); ?></div>
			<div class="bubble"><span class="who">パンダ先生：</span><?php echo wp_kses_post( $text ); ?></div>
		</div>
		<?php
	}

	public function render_student_dialog( $block, $content = '', $is_preview = false, $post_id = 0 ) {
		$text = get_field( 'dialog_text' ) ?: '';
		?>
		<div class="dialog student">
			<div class="av"><?php $this->student_svg(); ?></div>
			<div class="bubble"><span class="who">たろうくん：</span><?php echo wp_kses_post( $text ); ?></div>
		</div>
		<?php
	}

	public function render_callout_box( $block, $content = '', $is_preview = false, $post_id = 0 ) {
		$type  = get_field( 'callout_type' ) ?: 'info';
		$title = get_field( 'callout_title' ) ?: '';
		$text  = get_field( 'callout_content' ) ?: '';
		$icon  = 'warn' === $type ? '⚠' : '💡';
		?>
		<div class="callout-box <?php echo 'warn' === $type ? 'warn' : ''; ?>">
			<div class="ic"><?php echo $icon; ?></div>
			<div>
				<?php if ( $title ) : ?><div class="title"><?php echo esc_html( $title ); ?></div><?php endif; ?>
				<p class="text"><?php echo wp_kses_post( $text ); ?></p>
			</div>
		</div>
		<?php
	}

	private function panda_svg( $mood ) {
		?>
		<svg width="64" height="64" viewBox="0 0 100 100">
			<circle cx="50" cy="52" r="46" fill="#1f4ea3" opacity="0.12" />
			<circle cx="50" cy="52" r="42" fill="#fff" />
			<path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
			<g><path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" /></g>
			<g><path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" /></g>
			<circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
			<circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
			<ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
			<?php if ( 'happy' === $mood ) : ?>
				<path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
			<?php else : ?>
				<path d="M 44 71 Q 50 70 56 71" fill="none" stroke="#1a1612" stroke-width="1.8" stroke-linecap="round" />
			<?php endif; ?>
		</svg>
		<?php
	}

	private function student_svg() {
		?>
		<svg width="64" height="64" viewBox="0 0 100 100">
			<circle cx="50" cy="52" r="46" fill="#5aa0e6" opacity="0.12" />
			<circle cx="50" cy="52" r="42" fill="#fff" />
			<path d="M 50 22 C 28 22 20 38 20 56 C 20 76 32 88 50 88 C 68 88 80 76 80 56 C 80 38 72 22 50 22 Z" fill="#f4d8c0" />
			<path d="M 18 50 Q 18 16 50 14 Q 84 16 84 52 Q 80 38 70 32 Q 64 42 56 36 Q 52 44 44 36 Q 38 44 30 36 Q 24 44 18 50 Z" fill="#1e1610" />
			<ellipse cx="38" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
			<ellipse cx="62" cy="56" rx="2.6" ry="3.6" fill="#0e0a05" />
			<ellipse cx="28" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
			<ellipse cx="72" cy="68" rx="4" ry="2.5" fill="#f4a8b0" opacity="0.55" />
			<ellipse cx="50" cy="76" rx="2.5" ry="3" fill="#0e0a05" />
		</svg>
		<?php
	}
}
