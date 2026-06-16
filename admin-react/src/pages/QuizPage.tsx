// ===========================================================
// Quiz専用ページ /quiz-page
// ===========================================================

import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import QuizCard from '../components/quiz/QuizCard'
import { useTheme } from '../hooks/useTheme'

export default function QuizPage() {
  const { settings } = useTheme()
  return (
    <>
      <div className="page-bg" />
      <Seo
        title="SAP 每日一問"
        description="SAP 学習者のための每日一問クイズ。FI/CO/MM/SD/ABAP/S/4HANA など各モジュールから出題。パンダ先生の解説付きで、空き時間に SAP 力をアップ。"
        path="/quiz-page"
      />

      <SiteHeader active="quiz" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ paddingTop: 20 }}>
          <QuizCard />
        </div>
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}
    </>
  )
}
