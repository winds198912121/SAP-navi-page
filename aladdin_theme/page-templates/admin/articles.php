<?php
/**
 * 記事管理
 *
 * @package Aladdin_SAP_Panda
 */
$sub_view = get_query_var( 'aladdin_sub_view' );
$item_id  = get_query_var( 'aladdin_item_id' );
$articles = aladdin_api_get( 'articles', [ 'per_page' => 50, 'status' => 'all' ] ) ?: [];
$modules  = aladdin_api_get( 'modules' ) ?: [];
get_header();
?>
<div class="admin-layout">
    <aside class="admin-sidebar"><?php include ALADDIN_THEME_DIR . '/page-templates/admin/_sidebar.php'; ?></aside>
    <main class="admin-content">
        <div class="admin-header">
            <h1>📄 記事管理</h1>
            <a href="/admin/articles/new" class="btn btn-primary btn-sm">＋ 新規作成</a>
        </div>
        <?php if ( $sub_view === 'new' || ( $sub_view === 'edit' && $item_id ) ) :
            $article = $sub_view === 'edit' ? aladdin_api_get( 'articles/' . $item_id ) : [];
        ?>
        <form method="post" action="" class="admin-form">
            <div class="form-group">
                <label>タイトル</label>
                <input type="text" name="title" class="form-input" value="<?php echo esc_attr( $article['title'] ?? '' ); ?>" required>
            </div>
            <div class="form-group">
                <label>モジュール</label>
                <select name="module" class="form-input">
                    <option value="">選択してください</option>
                    <?php foreach ( $modules as $mod ) : ?>
                        <option value="<?php echo esc_attr( $mod['slug'] ?? '' ); ?>" <?php selected( $article['module_slug'] ?? '', $mod['slug'] ?? '' ); ?>>
                            <?php echo esc_html( strtoupper( $mod['slug'] ?? '' ) ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label>難易度</label>
                <select name="difficulty" class="form-input">
                    <option value="beginner" <?php selected( $article['difficulty'] ?? '', 'beginner' ); ?>>初級</option>
                    <option value="intermediate" <?php selected( $article['difficulty'] ?? '', 'intermediate' ); ?>>中級</option>
                    <option value="advanced" <?php selected( $article['difficulty'] ?? '', 'advanced' ); ?>>上級</option>
                </select>
            </div>
            <div class="form-group">
                <label>本文</label>
                <textarea name="content" class="form-input" rows="15"><?php echo esc_textarea( $article['content'] ?? $article['post_content'] ?? '' ); ?></textarea>
            </div>
            <button type="submit" class="btn btn-primary">保存</button>
            <a href="/admin/articles" class="btn btn-ghost">キャンセル</a>
        </form>
        <?php else : ?>
        <table class="admin-table">
            <thead>
                <tr><th>ID</th><th>タイトル</th><th>モジュール</th><th>日付</th><th>操作</th></tr>
            </thead>
            <tbody>
                <?php foreach ( $articles as $art ) : ?>
                <tr>
                    <td><?php echo esc_html( $art['id'] ?? '' ); ?></td>
                    <td><a href="/article/<?php echo esc_attr( ( $art['id'] ?? 0 ) . '/' . ( $art['slug'] ?? '' ) ); ?>"><?php echo esc_html( $art['title'] ?? '' ); ?></a></td>
                    <td><span class="badge badge-primary"><?php echo esc_html( strtoupper( $art['module_slug'] ?? '' ) ); ?></span></td>
                    <td><?php echo esc_html( date_i18n( 'Y/m/d', strtotime( $art['date'] ?? '' ) ) ); ?></td>
                    <td class="actions">
                        <a href="/admin/articles/<?php echo esc_attr( $art['id'] ?? 0 ); ?>/edit" class="btn btn-sm btn-ghost">編集</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </main>
</div>
<?php get_footer(); ?>
