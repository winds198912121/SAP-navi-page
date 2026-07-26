'use client';
import { useState } from 'react';

export default function QuizClient({ quiz }: { quiz: any }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!quiz) return null;

  const handleSelect = async (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setSubmitting(true);
    let correctAnswer = quiz.correctIndex || 0;
    try {
      const res = await fetch('/wp-json/sap/v1/quizzes/' + quiz.id + '/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: idx }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        setSubmitting(false);
        return;
      }
    } catch {}
    correctAnswer = quiz.correctIndex ?? (quiz.correct ?? 0);
    setResult({ correct: idx === correctAnswer, correctAnswer });
    setSubmitting(false);
  };

  const options = quiz.options || [];
  const correctIndex = result?.correctAnswer ?? quiz.correctIndex ?? quiz.correct ?? 0;

  return (
    <div className="quiz-card">
      <div className="quiz-left">
        <div className="quiz-eyebrow">☀ 今日の問題</div>
        <h3>{quiz.question || quiz.title || ''}</h3>
        <div className="quiz-options">
          {options.map((opt: string, i: number) => {
            const reveal = result !== null;
            const isCorrect = correctIndex === i;
            let cls = 'quiz-opt';
            if (reveal) {
              if (i === selected && isCorrect) cls += ' selected correct';
              else if (i === selected && !isCorrect) cls += ' selected wrong';
              else if (isCorrect) cls += ' show-correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered} type="button">
                <span className="letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
                {reveal && isCorrect && <span className="check">✓</span>}
                {reveal && i === selected && !isCorrect && <span className="check">✕</span>}
              </button>
            );
          })}
        </div>
        {result && (
          <div className="quiz-explain">
            <div style={{ width: 32, height: 32, flexShrink: 0 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>🐼</div>
            </div>
            <div>
              <strong>{result.correct ? '正解！🎋 ' : 'おしい！'}</strong>
              {quiz.explanation || ''}
            </div>
          </div>
        )}
        <div className="quiz-bot">
          <span>正解率：<strong style={{ color: 'var(--ink-0)' }}>—</strong></span>
          <span>·</span>
          <span>連続正解 <span className="streak">0問</span></span>
        </div>
      </div>
      <div className="quiz-right">
        <div className="thought">パンダ先生と一緒に考えよう！</div>
        <div style={{ fontSize: 140, lineHeight: 1, opacity: 0.35 }}>🐼</div>
      </div>
    </div>
  );
}
