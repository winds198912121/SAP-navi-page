<?php
/**
 * 新規登録ページ
 *
 * @package Aladdin_SAP_Panda
 */
if ( is_user_logged_in() ) {
    wp_redirect( '/profile' ); exit;
}
get_header();
?>
<div class="auth-page">
    <div class="auth-card">
        <h1>新規登録</h1>
        <form id="register-form" method="post">
            <div class="form-error-message form-error" style="display:none;"></div>
            <div class="form-group">
                <label for="display_name">表示名</label>
                <input type="text" id="display_name" name="display_name" class="form-input" required>
            </div>
            <div class="form-group">
                <label for="email">メールアドレス</label>
                <input type="email" id="email" name="email" class="form-input" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" id="password" name="password" class="form-input" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">登録する</button>
            <div class="form-footer">
                すでにアカウントをお持ちの方は <a href="/login">ログイン</a>
            </div>
        </form>
    </div>
</div>
<?php get_footer(); ?>
