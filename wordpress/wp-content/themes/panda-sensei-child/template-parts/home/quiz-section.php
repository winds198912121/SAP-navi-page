<?php
/**
 * Daily quiz section
 */
?>
<section class="section">
    <div class="section-head">
        <div>
            <div class="label">Daily Quiz</div>
            <h2>今日のクイズ<span class="accent-mark">.</span></h2>
        </div>
        <div class="desc">毎日1問、SAP知識をチェック</div>
    </div>
    <div class="quiz-card" data-quiz='<?php echo json_encode( $quiz, JSON_UNESCAPED_UNICODE ); ?>'>
        <div class="quiz-left">
            <div class="quiz-eyebrow">📝 Q.</div>
            <h3 class="quiz-question-text"><?php echo esc_html( $quiz['question'] ?? $quiz['title'] ?? '読み込み中…' ); ?></h3>
            <div class="quiz-options" id="quiz-options">
                <?php $letters = [ 'A', 'B', 'C', 'D' ]; ?>
                <?php foreach ( ( $quiz['options'] ?? [] ) as $oi => $opt ) : ?>
                    <button type="button" class="quiz-opt" data-index="<?php echo $oi; ?>"
                            onclick="window.pandaQuizSelect(this, <?php echo $oi; ?>)">
                        <span class="letter"><?php echo $letters[ $oi ] ?? ''; ?></span>
                        <span><?php echo esc_html( is_string( $opt ) ? $opt : ( $opt['text'] ?? $opt['value'] ?? '' ) ); ?></span>
                        <span class="check" style="display:none">✓</span>
                    </button>
                <?php endforeach; ?>
            </div>
            <div class="quiz-explain" id="quiz-explain" style="display:none">
                <span>💡</span>
                <span class="quiz-explain-text"><?php echo esc_html( $quiz['explanation'] ?? '' ); ?></span>
            </div>
        </div>
        <div class="quiz-right">
            <div class="thought">🤔 うーん…どれだ？</div>
            <svg viewBox="0 0 80 90" width="120" style="display:block">
                <ellipse cx="40" cy="86" rx="16" ry="4" fill="rgba(255,255,255,0.1)"/>
                <ellipse cx="32" cy="30" rx="12" ry="14" fill="#1a1612"/>
                <ellipse cx="48" cy="30" rx="12" ry="14" fill="#1a1612"/>
                <ellipse cx="40" cy="24" rx="18" ry="20" fill="#fdfaf2"/>
                <ellipse cx="32" cy="26" rx="7" ry="5" fill="#1a1612"/>
                <ellipse cx="48" cy="26" rx="7" ry="5" fill="#1a1612"/>
                <circle cx="36" cy="26" r="2.5" fill="#fff"/>
                <circle cx="44" cy="26" r="2.5" fill="#fff"/>
                <ellipse cx="40" cy="34" rx="2" ry="1.5" fill="#1a1612"/>
                <path d="M36 38 Q40 40 44 38" fill="none" stroke="#1a1612" stroke-width="1.2" stroke-linecap="round"/>
                <ellipse cx="28" cy="50" rx="10" ry="14" fill="#1a1612"/>
                <ellipse cx="52" cy="50" rx="10" ry="14" fill="#1a1612"/>
                <ellipse cx="40" cy="56" rx="18" ry="16" fill="#fdfaf2"/>
            </svg>
        </div>
    </div>
    <div class="quiz-bot">
        <span>毎日新しい問題にチャレンジ！</span>
        <a href="<?php echo esc_url( home_url( '/quiz-page' ) ); ?>" class="btn btn-sm ghost">もっとクイズ →</a>
    </div>
</section>
