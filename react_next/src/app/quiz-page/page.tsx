'use client'
// ===========================================================
// QuizPage — SAP 每日一問 /quiz-page
// ===========================================================
import { useState, useEffect } from 'react'
import Link from 'next/link'
import QuizClient from '@/components/quiz/QuizClient'

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadQuiz = async () => {
    setLoading(true); setError(''); setQuiz(null)
    try {
      const res = await fetch('/wp-json/sap/v1/quizzes/today')
      const json = await res.json()
      if (json.success) setQuiz(json.data)
      else setError(json.message || '問題の読み込みに失敗しました。')
    } catch {
      setQuiz({
        id: 0,
        question: '次のうち、SAP FI モジュールの主要な仕訳タイプとして「ない」ものはどれ？',
        options: ['SA：一般仕訳', 'KR：仕入先請求書', 'DR：得意先請求書', 'XX：在庫移動仕訳'],
        explanation: '「XX」というドキュメントタイプは標準にはありません。在庫移動は MM 領域です。',
        correctIndex: 3,
      })
    } finally { setLoading(false) }
  }

  useEffect(() => { loadQuiz() }, [])

  return (
    <>
      <div className="page-bg" />

      <section className="section">
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>読み込み中...</div>
        ) : error && !quiz ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-3)' }}>
            {error}
            <div style={{ marginTop: 12 }}><button className="btn btn-sm" onClick={loadQuiz}>再読み込み</button></div>
          </div>
        ) : quiz ? (
          <QuizClient quiz={quiz} />
        ) : null}
      </section>
    </>
  )
}
