import { api } from '@/lib/api';
import QuizClient from '@/components/quiz/QuizClient';
import Link from 'next/link';
export const revalidate = 0;
async function QuizPage() {
  const quiz = await api.getTodayQuiz();
  return (
    <div className="container" style={{paddingTop:'var(--spacing-xl)',paddingBottom:'var(--spacing-2xl)'}}>
      <nav className="breadcrumb"><Link href="/">ホーム</Link><span className="separator">›</span><span>今日のクイズ</span></nav>
      <h1>今日のクイズ</h1>
      {quiz ? <QuizClient quiz={quiz} /> : <div className="empty-state">今日のクイズは準備中です。</div>}
    </div>
  );
}
export default QuizPage;
