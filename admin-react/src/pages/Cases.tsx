// ===========================================================
// CasesPage — 案件専用ページ /cases
// 案件跑马灯 + 案件列表（分页・検索）+ 詳細モーダル + 応募
// ===========================================================

import { useState, useEffect } from 'react'
import Seo from '../components/layout/Seo'
import SiteHeader from '../components/layout/Header'
import SiteFooter from '../components/layout/Footer'
import FloatingPanda from '../components/layout/FloatingPanda'
import CaseTicker from '../components/cases/CaseTicker'
import CasesSection from '../components/cases/CasesSection'
import FreelanceWorries from '../components/cases/FreelanceWorries'
import CaseDetailModal from '../components/cases/CaseDetailModal'
import ApplyForm from '../components/cases/ApplyForm'
import { useTheme } from '../hooks/useTheme'
import api from '../services/api'
import type { SapCase } from '../types'

export default function CasesPage() {
  const { settings } = useTheme()
  const [allCases, setAllCases] = useState<SapCase[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<SapCase | null>(null)
  const [applyFor, setApplyFor] = useState<SapCase | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    api.getCases({ per_page: 200 }).then(res => {
      if (res.success) setAllCases(res.data)
    }).finally(() => setLoading(false))
  }, [refreshKey])

  useEffect(() => {
    document.body.style.overflow = (detail || applyFor) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detail, applyFor])

  return (
    <>
      <Seo
        title="SAP 案件・求人情報"
        description="SAP コンサルタント・SAP エンジニアの案件情報。FI/CO/MM/SD/ABAP などモジュール別に検索可能。SAP パンダ先生 NAVI の案件マッチングで、あなたに合った SAP 案件を見つけよう。"
        path="/cases"
      />
      <div className="page-bg" />
      <SiteHeader active="cases" />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <CaseTicker cases={allCases} onOpen={setDetail} />
        <CasesSection allCases={allCases} loading={loading}
          onOpen={setDetail} />
        <FreelanceWorries />
      </main>
      <SiteFooter />
      {settings.showFloatingPanda && <FloatingPanda />}

      {detail && (
        <CaseDetailModal c={detail} onClose={() => setDetail(null)}
          onApply={(c) => { setDetail(null); setApplyFor(c) }} />
      )}
      {applyFor && (
        <ApplyForm c={applyFor} onClose={() => setApplyFor(null)} />
      )}
    </>
  )
}
