'use client';
export default function ClaimPoints({ token }: { token: string }) {
  const handleClaim = async () => {
    try {
      const res = await fetch('/wp-json/sap/v1/points/daily', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) alert('ポイントを受け取りました！');
      else alert(json.message || 'エラー');
    } catch { alert('エラーが発生しました'); }
  };
  return <button onClick={handleClaim} className="btn btn-primary">每日ポイントを受け取る</button>;
}
