<?php
/**
 * サイトフッター
 *
 * @package Aladdin_SAP_Panda
 */
?>
    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="footer-widgets container">
            <div class="footer-column footer-col-brand">
                <h3 class="footer-title">🐼 SAP パンダ先生 NAVI</h3>
                <p class="footer-desc">SAP学習者のための総合プラットフォーム</p>
            </div>
            <div class="footer-column">
                <h4 class="footer-title-sm">コンテンツ</h4>
                <ul class="footer-links">
                    <li><a href="/modules">SAPモジュール</a></li>
                    <li><a href="/paths">学習パス</a></li>
                    <li><a href="/courses">コース</a></li>
                    <li><a href="/video">動画</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4 class="footer-title-sm">キャリア</h4>
                <ul class="footer-links">
                    <li><a href="/cases">案件一覧</a></li>
                    <li><a href="/glossary">用語集</a></li>
                    <li><a href="/trends">トレンド</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4 class="footer-title-sm">サイト情報</h4>
                <ul class="footer-links">
                    <li><a href="/about">このサイトについて</a></li>
                    <li><a href="/team">チーム</a></li>
                    <li><a href="/contact">お問い合わせ</a></li>
                    <li><a href="/privacy">プライバシーポリシー</a></li>
                    <li><a href="/terms">利用規約</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom container">
            <div class="footer-copyright">
                &copy; <?php echo esc_html( date( 'Y' ) ); ?> SAP パンダ先生 NAVI. All rights reserved.
            </div>
            <div class="footer-social">
                <a href="#" aria-label="X (Twitter)">𝕏</a>
                <a href="#" aria-label="YouTube">▶</a>
                <a href="#" aria-label="GitHub">⌘</a>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
