// ===========================================================
// QuizCard — 每日一题组件 (T4.1.2.1)
// 调用 API 获取今日题目, 交互答题, 实时反馈
// ===========================================================

import { useState, useEffect } from 'react'
import api from '../../services/api'

interface QuizData {
  id: number
  question: string
  options: string[]
  explanation: string
  date?: string
}

export default function QuizCard() {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [picked, setPicked] = useState<number | null>(null)
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: number; explanation: string } | null>(null)
  const [error, setError] = useState('')
  const [animKey, setAnimKey] = useState(0)

  const loadQuiz = async () => {
    setLoading(true)
    setPicked(null)
    setResult(null)
    setError('')
    setAnimKey(k => k + 1)
    try {
      const res = await api.getTodayQuiz()
      if (res.success) {
        setQuiz(res.data)
      } else {
        setError(res.message || '問題の読み込みに失敗しました。')
      }
    } catch {
      setQuiz({
        id: 0,
        question: '次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？',
        options: ['SA：一般仕訳', 'KR：仕入先請求書', 'DR：得意先請求書', 'XX：在庫移動仕訳'],
        explanation: '「XX」というドキュメントタイプは標準にはありません。在庫移動は MM 領域です。',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadQuiz() }, [])

  const pickAnswer = async (i: number) => {
    if (picked !== null) return
    setPicked(i)

    if (quiz && quiz.id > 0) {
      try {
        const res = await api.submitQuizAnswer(quiz.id, i)
        if (res.success) {
          setResult(res.data)
          return
        }
      } catch { /* fallback below */ }
    }

    // Fallback: use hardcoded data
    const correct = i === 3 ? 3 : (i === 1 ? 1 : 3)
    setResult({
      correct: i === correct,
      correctAnswer: correct,
      explanation: quiz?.explanation || '解説は準備中です。',
    })
  }

  const next = loadQuiz

  if (loading) {
    return (
      <section className="section" id="quiz">
        <div className="section-head"><div><div className="label">Daily Quiz</div><h2>パンダ先生の<span className="accent-mark">今日の一問</span></h2></div></div>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div>
      </section>
    )
  }

  if (error && !quiz) {
    return (
      <section className="section" id="quiz">
        <div className="section-head"><div><div className="label">Daily Quiz</div><h2>パンダ先生の<span className="accent-mark">今日の一問</span></h2></div></div>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>{error}</div>
      </section>
    )
  }

  return (
    <section className="section" id="quiz">
      <div className="section-head">
        <div>
          <div className="label">Daily Quiz</div>
          <h2>パンダ先生の<span className="accent-mark">今日の一問</span></h2>
        </div>
        <div className="desc">
          5秒でわかる、SAP のあるあるクイズ。<br />
          連続正解で「パンダバッジ」がもらえるよ。
        </div>
      </div>

      <div className="quiz-card" key={animKey}>
        <div className="quiz-left">
          <div className="quiz-eyebrow">☀ 今日の問題</div>
          <h3>{quiz?.question || ''}</h3>

          <div className="quiz-options">
            {quiz?.options.map((opt, i) => {
              const reveal = result !== null
              const isCorrect = result?.correctAnswer === i
              let cls = 'quiz-opt'
              if (reveal) {
                if (i === picked && isCorrect) cls += ' selected correct'
                else if (i === picked && !isCorrect) cls += ' selected wrong'
                else if (isCorrect) cls += ' show-correct'
              }
              return (
                <button key={i} className={cls} onClick={() => pickAnswer(i)} type="button">
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                  {reveal && isCorrect && <span className="check">✓</span>}
                  {reveal && i === picked && !isCorrect && <span className="check">✕</span>}
                </button>
              )
            })}
          </div>

          {result && (
            <div className="quiz-explain">
              <div style={{ width: 32, height: 32, flexShrink: 0 }}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="52" r="46" fill="#d8ead9" />
                  <circle cx="50" cy="52" r="42" fill="#fff" />
                  <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" />
                  <g>
                    <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
                    <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
                  </g>
                  <circle cx="30" cy="44" r="3.4" fill="#fff" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" />
                  <circle cx="70" cy="44" r="3.4" fill="#fff" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" />
                  <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" />
                  {result.correct ? (
                    <path d="M 42 68 Q 50 78 58 68" fill="#1a1612" />
                  ) : (
                    <line x1="44" y1="71" x2="56" y2="71" stroke="#1a1612" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </div>
              <div>
                <strong>{result.correct ? '正解！🎋 ' : 'おしい！'}</strong>
                {result.explanation}
              </div>
            </div>
          )}

          <div className="quiz-bot">
            <span>正解率：<strong style={{ color: 'var(--ink-0)' }}>62%</strong></span>
            <span>·</span>
            <span>連続正解 <span className="streak">0問</span></span>
            <span style={{ marginLeft: 'auto' }}>
              {result && (
                <button className="btn sm primary" onClick={next} type="button">次の問題 →</button>
              )}
            </span>
          </div>
        </div>

        <div className="quiz-right">
          <div className="thought">パンダ先生と一緒に考えよう！</div>
          <svg viewBox="-4 -8 108 108" style={{ width: 140, height: 140 }}>
            <circle cx="50" cy="52" r="46" fill="#e8f0fb" opacity="0.2" />
            <ellipse cx="22" cy="18" rx="13" ry="12" fill="#1a1612" opacity="0.7" />
            <ellipse cx="78" cy="18" rx="13" ry="12" fill="#1a1612" opacity="0.7" />
            <path d="M 50 12 C 22 12 8 32 8 54 C 8 76 24 90 50 90 C 76 90 92 76 92 54 C 92 32 78 12 50 12 Z" fill="#fdfaf2" opacity="0.35" />
            <g opacity="0.5">
              <path d="M 18 36 Q 22 28 32 30 Q 42 32 42 44 Q 42 56 32 58 Q 20 58 16 50 Q 14 42 18 36 Z" fill="#1a1612" />
              <path d="M 82 36 Q 78 28 68 30 Q 58 32 58 44 Q 58 56 68 58 Q 80 58 84 50 Q 86 42 82 36 Z" fill="#1a1612" />
            </g>
            <circle cx="30" cy="44" r="3.4" fill="#fff" opacity="0.6" /><circle cx="30" cy="44" r="2.4" fill="#0e0a05" opacity="0.6" />
            <circle cx="70" cy="44" r="3.4" fill="#fff" opacity="0.6" /><circle cx="70" cy="44" r="2.4" fill="#0e0a05" opacity="0.6" />
            <ellipse cx="18" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.4" />
            <ellipse cx="82" cy="64" rx="5.5" ry="3" fill="#f4b8c4" opacity="0.4" />
            <ellipse cx="50" cy="62" rx="3.4" ry="2.5" fill="#1a1612" opacity="0.6" />
            <path d="M 50 64 L 50 67" stroke="#1a1612" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            <path d="M 43 70 Q 50 74 57 70" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      </div>
    </section>
  )
}
