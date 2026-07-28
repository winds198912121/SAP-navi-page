<?php
/**
 * Login page
 */
get_header();
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <div class="auth-page">
            <div class="auth-card">
                <h1>ログイン</h1>

                <?php if ( is_user_logged_in() ) : ?>
                    <p style="text-align:center;color:var(--ink-2)">すでにログインしています。</p>
                    <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
                        <a href="<?php echo esc_url( home_url( '/profile' ) ); ?>" class="btn primary">プロフィール</a>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn outline">ホーム</a>
                    </div>
                <?php else : ?>
                    <form id="panda-login-form" method="post" action="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
                        <input type="hidden" name="action" value="panda_ajax_login">
                        <?php wp_nonce_field( 'panda_login_nonce', 'nonce' ); ?>
                        <div class="form-group">
                            <label for="login-email">メールアドレス</label>
                            <input type="email" id="login-email" name="email" class="form-input" required
                                   placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="login-password">パスワード</label>
                            <input type="password" id="login-password" name="password" class="form-input" required
                                   placeholder="••••••••">
                        </div>
                        <div id="login-error" class="error-message" style="display:none"></div>
                        <button type="submit" class="btn primary btn-block">ログイン</button>
                    </form>
                    <div class="form-footer">
                        アカウントをお持ちでない方は <a href="<?php echo esc_url( home_url( '/register' ) ); ?>">新規登録</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
</div>
<?php get_footer(); ?>
