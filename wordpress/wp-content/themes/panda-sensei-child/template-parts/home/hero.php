<?php
/**
 * Hero section — パンダ先生のヒーロー
 *
 * @package Panda_Sensei_Child
 */
?>
<section class="hero">
    <div class="hero-text">
        <div class="hero-eyebrow">
            <span class="ico">P</span>
            パンダ先生 × たろうくんと、SAPを学ぼう
        </div>
        <h1>
            SAPの世界を、<br>
            <span class="wave-under">もっと身近に</span>。
        </h1>
        <p class="lead">
            財務・購買・販売・生産・人事 — むずかしい SAP のしくみを、
            パンダ先生がやさしく解説。たろうくん（24歳・SAP学習中）と一緒に、
            「わからない…！」から「なるほど！」へ。
        </p>
        <div class="hero-ctas">
            <a href="<?php echo esc_url( home_url( '/modules' ) ); ?>" class="btn primary">モジュールを見る</a>
            <a href="<?php echo esc_url( home_url( '/search' ) ); ?>" class="btn outline">記事を検索</a>
        </div>
        <div class="hero-stats">
            <div class="hero-stat">
                <div class="v"><?php echo number_format( count( $articles ) >= 3 ? 48 : count( $articles ) * 16 ); ?><small>本</small></div>
                <div class="l">公開記事</div>
            </div>
            <div class="hero-stat">
                <div class="v"><?php echo count( $modules ); ?><small>モジュール</small></div>
                <div class="l">主要モジュール網羅</div>
            </div>
            <div class="hero-stat">
                <div class="v">24,800<small>+</small></div>
                <div class="l">月間読者</div>
            </div>
        </div>
    </div>

    <div class="hero-scene">
        <div class="floor"></div>
        <div class="blackboard">
            <div class="hero-callouts">
                <div class="callout c1">
                    <span class="em" style="background:#5a9d6e">FI</span>
                    会計の基礎<br><small>パンダ先生解説</small>
                </div>
                <div class="callout c2">
                    <span class="em" style="background:#b62a4a">SD</span>
                    販売フロー<br><small>初心者向け</small>
                </div>
                <div class="callout c3">
                    <span class="em" style="background:#1f6f6f">ABAP</span>
                    開発入門<br><small>ハンズオン</small>
                </div>
            </div>
        </div>
        <div class="hero-panda-wrap">
            <svg viewBox="0 0 120 140" width="100%" style="display:block">
                <ellipse cx="60" cy="132" rx="24" ry="6" fill="rgba(60,45,20,0.12)"/>
                <ellipse cx="46" cy="50" rx="18" ry="22" fill="#1a1612"/>
                <ellipse cx="74" cy="50" rx="18" ry="22" fill="#1a1612"/>
                <ellipse cx="60" cy="42" rx="28" ry="30" fill="#fdfaf2"/>
                <ellipse cx="46" cy="46" rx="10" ry="8" fill="#1a1612"/>
                <ellipse cx="74" cy="46" rx="10" ry="8" fill="#1a1612"/>
                <circle cx="52" cy="44" r="3" fill="#fff"/>
                <circle cx="68" cy="44" r="3" fill="#fff"/>
                <circle cx="52" cy="44" r="2" fill="#0e0a05"/>
                <circle cx="68" cy="44" r="2" fill="#0e0a05"/>
                <ellipse cx="60" cy="56" rx="2.5" ry="2" fill="#1a1612"/>
                <path d="M55 60 Q60 63 65 60" fill="none" stroke="#1a1612" stroke-width="1.5" stroke-linecap="round"/>
                <ellipse cx="38" cy="78" rx="14" ry="22" fill="#1a1612"/>
                <ellipse cx="82" cy="78" rx="14" ry="22" fill="#1a1612"/>
                <ellipse cx="60" cy="90" rx="28" ry="24" fill="#fdfaf2"/>
            </svg>
        </div>
        <div class="hero-student-wrap">
            <svg viewBox="0 0 90 130" width="100%" style="display:block;transform:scaleX(-1)">
                <ellipse cx="45" cy="124" rx="18" ry="5" fill="rgba(60,45,20,0.1)"/>
                <circle cx="45" cy="28" r="20" fill="#fdfaf2"/>
                <circle cx="38" cy="24" r="3" fill="#1a1612"/>
                <circle cx="52" cy="24" r="3" fill="#1a1612"/>
                <circle cx="38" cy="24" r="1.5" fill="#fff"/>
                <circle cx="52" cy="24" r="1.5" fill="#fff"/>
                <path d="M40 32 Q45 36 50 32" fill="none" stroke="#1a1612" stroke-width="1.5" stroke-linecap="round"/>
                <ellipse cx="45" cy="14" rx="14" ry="10" fill="#d9a05b"/>
                <rect x="30" y="44" width="30" height="16" rx="4" fill="#4a90d9"/>
                <rect x="26" y="56" width="38" height="50" rx="6" fill="#4a90d9"/>
                <rect x="20" y="82" width="10" height="30" rx="4" fill="#4a90d9"/>
                <rect x="54" y="82" width="10" height="30" rx="4" fill="#4a90d9"/>
                <rect x="34" y="106" width="16" height="10" rx="3" fill="#4a90d9"/>
            </svg>
        </div>
    </div>
</section>
