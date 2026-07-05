'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ display_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/wp-json/sap/v1/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success && json.data?.token) {
        document.cookie = `aladdin_token=${json.data.token}; path=/; max-age=${30*24*60*60}`;
        router.push('/profile');
      } else throw new Error(json.message || '登録に失敗しました');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>新規登録</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>表示名</label>
            <input type="text" className="form-input" value={form.display_name} onChange={e => setForm(p=>({...p,display_name:e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>メールアドレス</label>
            <input type="email" className="form-input" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input type="password" className="form-input" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading ? '...' : '登録する'}</button>
          <div className="form-footer">すでにアカウントをお持ちの方は <Link href="/login">ログイン</Link></div>
        </form>
      </div>
    </div>
  );
}
