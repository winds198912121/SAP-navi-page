<?php
/**
 * メインインデックス（フォールバック）
 *
 * @package Aladdin_SAP_Panda
 */
get_header();
?>
<div class="container aladdin-page">
    <div class="page-content">
        <h1><?php echo esc_html( aladdin_page_title( get_the_title() ) ); ?></h1>
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                the_content();
            endwhile;
        else :
            echo '<p>コンテンツが見つかりませんでした。</p>';
        endif;
        ?>
    </div>
</div>
<?php
get_footer();
