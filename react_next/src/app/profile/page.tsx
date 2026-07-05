import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import ClaimPoints from './ClaimPoints';

async function ProfilePage() {
  const c = await cookies();
  const token = c.get('aladdin_token')?.value;
  if (!token) redirect('/login');
  const [user, points] = await Promise.all([
    api.getMe(token), api.getPoints(token),
  ]);

  return (
    <div className="container profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.display_name?.charAt(0)?.toUpperCase() || '?'}</div>
        <div className="profile-info">
          <h2>{user?.display_name || 'ユーザー'}</h2>
          <p>{user?.email || ''}</p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-card"><div className="stat-value">{points?.total || 0}</div><div className="stat-label">獲得ポイント</div></div>
        <div className="stat-card"><div className="stat-value">{points?.daily_streak || 0}</div><div className="stat-label">連続ログイン日数</div></div>
      </div>
      <div style={{textAlign:'center'}}><ClaimPoints token={token} /></div>
    </div>
  );
}
export default ProfilePage;
