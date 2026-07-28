<?php
/**
 * Register page
 */
get_header();
?>
<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <div class="page-bg"></div>
        <div class="auth-page">
            <div class="auth-card">
                <h1>新規登録</h1>
                <?php if ( is_user_logged_in() ) : ?>
                    <p style="text-align:center;color:var(--ink-2)">すでにログインしています。</p>
                    <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
                        <a href="<?php echo esc_url( home_url( '/profile' ) ); ?>" class="btn primary">プロフィール</a>
                    </div>
                <?php else : ?>
                    <form id="panda-register-form" method="post" action="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
                        <input type="hidden" name="action" value="panda_ajax_register">
                        <?php wp_nonce_field( 'panda_register_nonce', 'nonce' ); ?>
                        <div class="form-group">
                            <label for="reg-name">表示名</label>
                            <input type="text" id="reg-name" name="display_name" class="form-input" required
                                   placeholder="パンダ先生">
                        </div>
                        <div class="form-group">
                            <label for="reg-email">メールアドレス</label>
                            <input type="email" id="reg-email" name="email" class="form-input" required
                                   placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="reg-password">パスワード</label>
                            <input type="password" id="reg-password" name="password" class="form-input" required
                                   placeholder="8文字以上" minlength="8">
                        </div>
                        <div id="register-error" class="error-message" style="display:none"></div>
                        <div id="register-success" class="success-message" style="display:none"></div>
                        <button type="submit" class="btn primary btn-block">登録する</button>
                    </form>
                    <div class="form-footer">
                        すでにアカウントをお持ちの方は <a href="<?php echo esc_url( home_url( '/login' ) ); ?>">ログイン</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
</div>
<?php get_footer(); ?>
