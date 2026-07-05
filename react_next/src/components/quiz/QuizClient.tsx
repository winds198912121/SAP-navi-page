'use client';
import { useState } from 'react';

export default function QuizClient({ quiz }: { quiz: any }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!quiz) return null;

  const handleSelect = async (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setSubmitting(true);
    try {
      await fetch('/wp-json/sap/v1/quizzes/' + quiz.id + '/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: idx }),
      });
    } catch {}
    setSubmitting(false);
  };

  const isCorrect = selected === quiz.correctIndex;
  const options = quiz.options || [];

  return (
    <div className="quiz-card">
      <div className="quiz-question">{quiz.question}</div>
      <div className="quiz-options">
        {options.map((opt: string, i: number) => (
          <button key={i} className={`quiz-option ${answered && i === quiz.correctIndex ? 'correct' : ''} ${answered && i === selected && !isCorrect ? 'wrong' : ''}`}
            onClick={() => handleSelect(i)} disabled={answered}>
            {opt}
          </button>
        ))}
      </div>
      {answered && (
        <div className="quiz-result">
          <div className="quiz-result-icon">{isCorrect ? '🎉' : '😅'}</div>
          <div className="quiz-result-text">{isCorrect ? '正解！' : '不正解'}</div>
          {quiz.explanation && <div style={{color:'var(--color-text-light)',marginTop:'var(--spacing-sm)'}}>{quiz.explanation}</div>}
        </div>
      )}
    </div>
  );
}
