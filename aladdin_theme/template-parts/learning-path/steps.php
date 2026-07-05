<?php
/**
 * 学習パス ステップ一覧
 *
 * @param array $steps   ステップ配列
 * @param string $color  アクセントカラー
 */
$steps  = $args['steps'] ?? [];
$color  = $args['color'] ?? '#4CAF50';
$is_logged_in = is_user_logged_in();
?>
<?php if ( ! empty( $steps ) ) : ?>
<div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
    <?php foreach ( $steps as $i => $step ) : ?>
    <div style="display:flex;gap:var(--spacing-md);align-items:flex-start;">
        <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="width:36px;height:36px;border-radius:50%;background:<?php echo esc_attr( $color ); ?>;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-sm);flex-shrink:0;">
                <?php echo $i + 1; ?>
            </div>
            <?php if ( $i < count( $steps ) - 1 ) : ?>
                <div style="width:2px;flex:1;background:<?php echo esc_attr( $color ); ?>40;min-height:20px;"></div>
            <?php endif; ?>
        </div>
        <div style="flex:1;background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--spacing-md);">
            <h4 style="margin-bottom:4px;"><?php echo esc_html( $step['title'] ?? '' ); ?></h4>
            <p style="font-size:var(--text-sm);color:var(--color-text-light);margin-bottom:var(--spacing-sm);"><?php echo esc_html( $step['description'] ?? '' ); ?></p>
            <?php if ( $is_logged_in ) : ?>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
                <?php foreach ( ( $step['articles'] ?? [] ) as $a ) : ?>
                    <a href="/article/<?php echo esc_attr( ( $a['id'] ?? 0 ) . '/' . ( $a['slug'] ?? '' ) ); ?>" class="badge badge-primary" style="font-size:11px;">📄 <?php echo esc_html( $a['title'] ?? '' ); ?></a>
                <?php endforeach; ?>
                <?php foreach ( ( $step['courses'] ?? [] ) as $c ) : ?>
                    <a href="/course/<?php echo esc_attr( $c['id'] ?? 0 ); ?>" class="badge badge-accent" style="font-size:11px;">📚 <?php echo esc_html( $c['title'] ?? '' ); ?></a>
                <?php endforeach; ?>
                <?php foreach ( ( $step['knowledge'] ?? [] ) as $k ) : ?>
                    <a href="/knowledge/<?php echo esc_attr( ( $k['id'] ?? 0 ) . '/' . ( $k['slug'] ?? '' ) ); ?>" class="badge" style="background:#E8EAF6;color:#283593;font-size:11px;">💡 <?php echo esc_html( $k['title'] ?? '' ); ?></a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>
<?php endif; ?>
