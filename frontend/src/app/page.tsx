'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, CheckCircle2, Loader2, FileText, Plus, ArrowRight } from 'lucide-react'
import { useAssessmentStore } from '@/store/assessmentStore'
import { fetchAssignments } from '@/lib/api'
import { AssignmentCard } from '@/components/assessment/AssignmentCard'
import { StatCard } from '@/components/dashboard/stat-card'

export default function DashboardPage() {
  const { assignments, assignmentsLoading, setAssignments, setAssignmentsLoading, setAssignmentsError } = useAssessmentStore()

  useEffect(() => {
    setAssignmentsLoading(true)
    fetchAssignments()
      .then((data) => setAssignments(data.assignments))
      .catch((err) => setAssignmentsError(err.message))
      .finally(() => setAssignmentsLoading(false))
  }, [setAssignments, setAssignmentsLoading, setAssignmentsError])

  const stats = {
    total: assignments.length,
    completed: assignments.filter((a) => a.status === 'completed').length,
    processing: assignments.filter((a) => a.status === 'processing').length,
    questions: assignments.reduce((s, a) => s + (a.totalQuestions || 0), 0),
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[hsl(222,47%,11%)] tracking-tight">Assignments</h1>
          <p className="text-[13px] text-[hsl(215,16%,47%)] mt-0.5">Create and manage assignments for your classes</p>
        </div>
        <Link
          href="/assignments/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Assignment
        </Link>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard value={stats.total} title="Total Assessments" icon={<Sparkles size={20} />} />
        <StatCard value={stats.completed} title="Completed" icon={<CheckCircle2 size={20} />} />
        <StatCard value={stats.processing} title="Processing" icon={<Loader2 size={20} />} />
        <StatCard value={stats.questions} title="Questions Generated" icon={<FileText size={20} />} />
      </section>

      {/* Recent assignments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-[hsl(222,47%,11%)]">Recent Assignments</h2>
            <p className="text-[12.5px] text-[hsl(215,16%,47%)] mt-0.5">Recently generated AI-powered assessments</p>
          </div>
          <Link href="/assignments" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[hsl(222,47%,11%)] hover:opacity-70 transition-opacity">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {assignmentsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-shimmer h-[220px] rounded-[14px]" />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            {/* Empty illustration */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[hsl(48,20%,96%)] border border-[#E5E5E2]">
              <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
                <rect x="4" y="4" width="26" height="30" rx="3" fill="#F0EFE8" stroke="#D0D0CB" strokeWidth="1.2"/>
                <rect x="8" y="1" width="26" height="30" rx="3" fill="#F7F7F5" stroke="#D0D0CB" strokeWidth="1.2"/>
                <rect x="12" y="0" width="26" height="30" rx="3" fill="white" stroke="#D0D0CB" strokeWidth="1.2"/>
                <circle cx="25" cy="19" r="9" fill="#FEF0ED" stroke="#F09575" strokeWidth="1.2"/>
                <line x1="21" y1="15" x2="29" y2="23" stroke="#E8441A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="29" y1="15" x2="21" y2="23" stroke="#E8441A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-[hsl(222,47%,11%)] mb-2">No assignments yet</h3>
            <p className="text-[13px] text-[hsl(215,16%,47%)] max-w-xs mx-auto mb-5 leading-relaxed">
              Create your first assignment to start collecting professionally generated question papers.
            </p>
            <Link
              href="/assignments/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={14} strokeWidth={2.5} />
              Create Your First Assignment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.slice(0, 6).map((a) => (
              <AssignmentCard key={a._id} assignment={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
