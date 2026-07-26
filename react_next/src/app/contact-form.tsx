'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/wp-json/sap/v1/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        setMessage('お問い合わせを受け付けました。');
      } else {
        setStatus('error');
        setMessage(json.message || '送信に失敗しました。');
      }
    } catch {
      setStatus('error');
      setMessage('エラーが発生しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 600 }}>
      {status === 'success' && <div className="success-message">{message}</div>}
      {status === 'error' && <div className="error-message">{message}</div>}
      <div className="form-group">
        <label>お名前</label>
        <input type="text" name="name" className="form-input" required />
      </div>
      <div className="form-group">
        <label>メールアドレス</label>
        <input type="email" name="email" className="form-input" required />
      </div>
      <div className="form-group">
        <label>メッセージ</label>
        <textarea name="message" className="form-input" required rows={5} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? '送信中...' : '送信する'}
      </button>
    </form>
  );
}
