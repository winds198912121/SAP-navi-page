'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/wp-json/sap/v1/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success && json.data?.token) {
        document.cookie = `aladdin_token=${json.data.token}; path=/; max-age=${30*24*60*60}`;
        router.push('/profile');
      } else throw new Error(json.message || 'ログインに失敗しました');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>ログイン</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>メールアドレス</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading ? '...' : 'ログイン'}</button>
          <div className="form-footer">アカウントをお持ちでない方は <Link href="/register">新規登録</Link></div>
        </form>
      </div>
    </div>
  );
}
