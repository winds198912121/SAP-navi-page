import { api } from '@/lib/api'; import Link from 'next/link';
export const revalidate = 3600;
async function VideoPage() {
  const videos = await api.getVideos({ per_page: 20 });
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>動画一覧</span></nav>
      <h1>動画一覧</h1>
      {videos && videos.length > 0 ? (
        <div className="grid-3">
          {videos.map((v: any) => (
            <div key={v.id} className="card">
              {v.thumbnail_url && <img src={v.thumbnail_url} alt="" style={{width:'100%',aspectRatio:'16/9',objectFit:'cover'}} />}
              <div className="card-body">
                <h3 className="card-title">{v.title}</h3>
                <p className="card-text">{v.description}</p>
                {v.video_url && <a href={v.video_url} target="_blank" rel="noopener" className="btn btn-sm btn-primary">▶ 再生</a>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="empty-state">動画がまだありません。</div>}
    </div>
  );
}
export default VideoPage;
