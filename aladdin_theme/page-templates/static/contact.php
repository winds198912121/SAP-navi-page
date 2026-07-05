<?php
/**
 * Contact Page
 *
 * @package Aladdin_SAP_Panda
 */
$sent = false;
if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['contact_name'], $_POST['contact_email'], $_POST['contact_message'] ) ) {
    $result = aladdin_api_post( 'contact', [
        'name'    => sanitize_text_field( $_POST['contact_name'] ),
        'email'   => sanitize_email( $_POST['contact_email'] ),
        'message' => sanitize_textarea_field( $_POST['contact_message'] ),
    ] );
    $sent = $result !== null;
}
get_header();
?>
<div class="container-narrow" style="padding-top:var(--spacing-xl);padding-bottom:var(--spacing-2xl);">
    <div class="breadcrumb"><a href="/">ホーム</a><span class="separator">›</span><span>お問い合わせ</span></div>
    <h1>お問い合わせ</h1>
    <?php if ( $sent ) : ?>
        <div class="success-message">お問い合わせを受け付けました。担当者よりご連絡いたします。</div>
    <?php endif; ?>
    <form method="post" action="/contact" class="admin-form" style="max-width:600px;">
        <div class="form-group">
            <label for="contact_name">お名前</label>
            <input type="text" id="contact_name" name="contact_name" class="form-input" required>
        </div>
        <div class="form-group">
            <label for="contact_email">メールアドレス</label>
            <input type="email" id="contact_email" name="contact_email" class="form-input" required>
        </div>
        <div class="form-group">
            <label for="contact_message">メッセージ</label>
            <textarea id="contact_message" name="contact_message" class="form-input" required rows="5"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">送信する</button>
    </form>
</div>
<?php get_footer(); ?>
