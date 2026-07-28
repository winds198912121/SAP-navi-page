<?php
/**
 * YouTube video section
 */
?>
<section class="section">
    <div class="section-head">
        <div>
            <div class="label">YouTube</div>
            <h2>パンダ先生の動画講座<span class="accent-mark">.</span></h2>
        </div>
        <div class="desc">SAP の操作画面を動画で確認。通勤・隙間時間に。</div>
    </div>
    <div class="yt-section">
        <div class="yt-videos">
            <?php foreach ( array_slice( $videos, 0, 4 ) as $v ) : ?>
                <a href="<?php echo $v['youtube_id'] ? esc_url( 'https://youtube.com/watch?v=' . $v['youtube_id'] ) : '#'; ?>"
                   class="yt-vid" target="_blank" rel="noopener noreferrer">
                    <div class="vid-thumb">
                        <?php if ( ! empty( $v['youtube_id'] ) ) : ?>
                            <img src="https://img.youtube.com/vi/<?php echo esc_attr( $v['youtube_id'] ); ?>/mqdefault.jpg"
                                 alt="<?php echo esc_attr( $v['title'] ); ?>" loading="lazy">
                        <?php else : ?>
                            <div style="width:100%;height:100%;background:var(--bg-tint);display:grid;place-items:center;color:var(--ink-3);font-size:24px">📹</div>
                        <?php endif; ?>
                    </div>
                    <div class="vid-info">
                        <h4><?php echo esc_html( $v['title'] ); ?></h4>
                        <span style="font-size:11px;color:rgba(255,255,255,0.5)"><?php echo esc_html( $v['duration'] ?? '' ); ?></span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
