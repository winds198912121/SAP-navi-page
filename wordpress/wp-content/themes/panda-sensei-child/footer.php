<?php
/**
 * Footer — SAP Panda Kadence child theme
 *
 * Next.js版のフッターを再現。ブランド情報、モジュールリンク、コンテンツリンク、ソーシャルリンク。
 *
 * @package Panda_Sensei_Child
 */

$panda_svg = '
<svg width="38" height="38" viewBox="-4 -8 108 108">
  <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.4"/>
  <g>
    <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612"/>
    <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612"/>
    <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2"/>
    <g>
      <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612"/>
      <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612"/>
    </g>
    <circle cx="30" cy="44" r="3.4" fill="#fff"/>
    <circle cx="30" cy="44" r="2.4" fill="#0e0a05"/>
    <circle cx="70" cy="44" r="3.4" fill="#fff"/>
    <circle cx="70" cy="44" r="2.4" fill="#0e0a05"/>
    <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612"/>
    <path d="M 50 64 L 50 67" stroke="#1a1612" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" stroke-width="1.8" stroke-linecap="round"/>
  </g>
</svg>';

$footer_modules = [
    [ 'slug' => 'fi', 'label' => 'FI · 財務会計' ],
    [ 'slug' => 'co', 'label' => 'CO · 管理会計' ],
    [ 'slug' => 'mm', 'label' => 'MM · 購買・在庫' ],
    [ 'slug' => 'sd', 'label' => 'SD · 販売管理' ],
    [ 'slug' => 'pp', 'label' => 'PP · 生産計画' ],
    [ 'slug' => 'abap', 'label' => 'ABAP · 開発言語' ],
];

$footer_content = [
    [ 'href' => '/paths', 'label' => '学習パス' ],
    [ 'href' => '/quiz-page', 'label' => '今日の一問' ],
    [ 'href' => '/video', 'label' => '動画講座' ],
    [ 'href' => '/search', 'label' => '記事検索' ],
];

$footer_about = [
    [ 'href' => '/about', 'label' => 'サイトについて' ],
    [ 'href' => '/team', 'label' => '執筆メンバー' ],
    [ 'href' => '/contact', 'label' => 'お問い合わせ' ],
    [ 'href' => '/privacy', 'label' => 'プライバシー' ],
    [ 'href' => '/terms', 'label' => '利用規約' ],
];
?>
    </div><!-- #content -->

    <footer class="site-footer">
        <div class="foot-wrap">

            <!-- Brand column -->
            <div>
                <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" style="display:flex;align-items:center;gap:10px;margin-bottom:6px;text-decoration:none">
                    <div class="logo-panda" style="filter:brightness(1.05);flex-shrink:0"><?php echo $panda_svg; // phpcs:ignore ?></div>
                    <div class="brand-text">
                        <div class="brand-name">パンダ<span class="sensei" style="color:#7dd49c">先生</span></div>
                        <div class="brand-sub">SAP NAVI</div>
                    </div>
                </a>
                <p class="foot-about">
                    SAPコンサル、開発者、ユーザー部門 — すべての SAPer のために、
                    パンダ先生がやさしく解説する SAP ナレッジサイト。
                </p>
                <div class="foot-socials">
                    <a href="#" class="foot-soc" aria-label="X (Twitter)">X</a>
                    <a href="#" class="foot-soc" aria-label="YouTube">YT</a>
                    <a href="#" class="foot-soc" aria-label="GitHub">GH</a>
                    <a href="<?php echo esc_url( home_url( '/feed' ) ); ?>" class="foot-soc" aria-label="RSS">RSS</a>
                </div>
            </div>

            <!-- Modules column -->
            <div class="foot-col">
                <h5>モジュール</h5>
                <ul>
                    <?php foreach ( $footer_modules as $m ) : ?>
                        <li><a href="<?php echo esc_url( home_url( '/category/' . $m['slug'] ) ); ?>"><?php echo esc_html( $m['label'] ); ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Content column -->
            <div class="foot-col">
                <h5>コンテンツ</h5>
                <ul>
                    <?php foreach ( $footer_content as $c ) : ?>
                        <li><a href="<?php echo esc_url( home_url( $c['href'] ) ); ?>"><?php echo esc_html( $c['label'] ); ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- About column -->
            <div class="foot-col">
                <h5>パンダ先生</h5>
                <ul>
                    <?php foreach ( $footer_about as $a ) : ?>
                        <li><a href="<?php echo esc_url( home_url( $a['href'] ) ); ?>"><?php echo esc_html( $a['label'] ); ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>

        </div>

        <div class="foot-bot">
            <span class="copy">&copy; <?php echo date( 'Y' ); ?> パンダ先生 SAP NAVI. 大好きな SAP を、もっと身近に。</span>
            <span>Made with 🎋 in Tokyo</span>
        </div>
    </footer>

</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
