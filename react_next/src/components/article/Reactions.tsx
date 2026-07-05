'use client';
import { useState } from 'react';

const EMOJIS = [
  { type: 'like', emoji: '👍', label: 'いいね' },
  { type: 'love', emoji: '❤️', label: '大好き' },
  { type: 'smile', emoji: '😊', label: '笑顔' },
  { type: 'fire', emoji: '🔥', label: '参考になった' },
];

export default function Reactions({ articleId, reactions: initial }: { articleId: number; reactions?: Record<string, number> }) {
  const [counts, setCounts] = useState<Record<string, number>>(initial || {});

  const handleReaction = async (type: string) => {
    try {
      const res = await fetch('/wp-json/sap/v1/articles/' + articleId + '/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success && data.data?.count !== undefined) {
        setCounts(prev => ({ ...prev, [type]: data.data.count }));
      }
    } catch {
      setCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    }
  };

  return (
    <div style={{textAlign:'center',padding:'var(--spacing-2xl) 0',borderTop:'1px solid var(--color-border)',marginTop:'var(--spacing-2xl)'}}>
      <h3 style={{marginBottom:'var(--spacing-md)'}}>この記事の反応</h3>
      <div style={{display:'flex',justifyContent:'center',gap:'var(--spacing-lg)'}}>
        {EMOJIS.map(({ type, emoji }) => (
          <button key={type} onClick={() => handleReaction(type)}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'var(--spacing-sm) var(--spacing-md)',
              background:'var(--color-bg)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-lg)',cursor:'pointer',
              fontSize:'var(--text-sm)',transition:'all 0.15s'}}>
            <span style={{fontSize:'1.5rem'}}>{emoji}</span>
            <span style={{fontWeight:600,color:'var(--color-text-light)'}}>{counts[type] || 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
