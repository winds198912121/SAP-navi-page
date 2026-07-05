<?php
/**
 * ログインページ
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
        <h1>ログイン</h1>
        <form id="login-form" method="post">
            <div class="form-error-message form-error" style="display:none;"></div>
            <div class="form-group">
                <label for="email">メールアドレス</label>
                <input type="email" id="email" name="email" class="form-input" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" id="password" name="password" class="form-input" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg">ログイン</button>
            <div class="form-footer">
                アカウントをお持ちでない方は <a href="/register">新規登録</a>
            </div>
        </form>
    </div>
</div>
<?php get_footer(); ?>
