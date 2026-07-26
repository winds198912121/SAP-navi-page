import { api } from '@/lib/api';
import { getPathField } from '@/lib/utils';
import Link from 'next/link';
export const revalidate = 60;
async function PathsPage() {
  const paths = await api.getLearningPaths();
  return (
    <section className="section">
      <div className="section-head">
        <div><div className="label">Learning Paths</div><h2>学習パス</h2></div>
        <div className="desc">目的別に最適な学習ルートを選びましょう</div>
      </div>
      {paths && paths.length > 0 ? (
        <div className="path-grid">
          {paths.map((p: any, i: number) => (
            <Link key={p.id} href={`/learning/${p.id}`}
              className={`path-card ${i === 1 ? 'p2' : i === 2 ? 'p3' : ''}`}>
              <div className="num">{i + 1}</div>
              <div className="audience">{getPathField(p, 'target_audience') || '全レベル'}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              {p.steps && (
                <div className="path-steps">
                  {p.steps.slice(0, 4).map((step: any, si: number) => (
                    <div key={si} className="path-step">
                      <span className="step-num">{si + 1}</span>
                      <span className="step-title">{step.title}</span>
                      {step.time && <span className="step-time">{step.time}</span>}
                    </div>
                  ))}
                </div>
              )}
              <div className="path-meta">
                <span>📚 {p.steps?.length || 0}ステップ</span>
                {p.estimated_time && <span>⏱ {p.estimated_time}</span>}
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>学習パスがまだありません。</div>}
    </section>
  );
}
export default PathsPage;
