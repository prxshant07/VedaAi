'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ArrowUpDown, Trash2, ArrowRight, Plus, FileText, Clock3 } from 'lucide-react'
import { useAssessmentStore } from '@/store/assessmentStore'
import { fetchAssignments, deleteAssignment } from '@/lib/api'
import { formatDate, STATUS_COLORS, QUESTION_TYPE_LABELS } from '@/lib/utils'
import { Assignment } from '@/types'

const FIGMA_STATUS: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  completed:  { dot: '●', bg: 'bg-[#EBF7F0]', text: 'text-[#1A7A47]', label: 'Active' },
  draft:      { dot: '○', bg: 'bg-[#FEF9E7]', text: 'text-[#A07800]', label: 'Draft' },
  queued:     { dot: '◌', bg: 'bg-[#EFF6FF]', text: 'text-[#1E5FAD]', label: 'Queued' },
  processing: { dot: '◌', bg: 'bg-[#F3F0FF]', text: 'text-[#5B2DA6]', label: 'Processing' },
  failed:     { dot: '✕', bg: 'bg-[#FEF0ED]', text: 'text-[#B83F20]', label: 'Failed' },
}

function AssignmentCard({ assignment, onDelete }: { assignment: Assignment; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const st = FIGMA_STATUS[assignment.status] ?? FIGMA_STATUS.draft

  return (
    <div className="group relative bg-white border border-[#E5E5E2] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/assessments/${assignment._id}`}
          className="text-[14.5px] font-semibold text-[hsl(222,47%,11%)] leading-snug line-clamp-2 flex-1 hover:text-[hsl(222,47%,25%)] transition-colors"
        >
          {assignment.title}
        </Link>
        <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${st.bg} ${st.text}`}>
          {st.dot} {st.label}
        </span>
      </div>

      {assignment.subject && (
        <p className="text-[12.5px] text-[hsl(215,16%,47%)] mb-3">{assignment.subject}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="rounded-xl bg-[hsl(48,20%,97%)] border border-[#E5E5E2] p-2.5">
          <div className="flex items-center gap-1.5 text-[hsl(215,16%,47%)] mb-1">
            <FileText size={12} />
            <span className="text-[11px] font-medium">Questions</span>
          </div>
          <p className="text-[15px] font-bold text-[hsl(222,47%,11%)]">{assignment.totalQuestions}</p>
        </div>
        <div className="rounded-xl bg-[hsl(48,20%,97%)] border border-[#E5E5E2] p-2.5">
          <div className="flex items-center gap-1.5 text-[hsl(215,16%,47%)] mb-1">
            <Clock3 size={12} />
            <span className="text-[11px] font-medium">Marks</span>
          </div>
          <p className="text-[15px] font-bold text-[hsl(222,47%,11%)]">{assignment.totalMarks}</p>
        </div>
      </div>

      {/* Question types */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {assignment.questionTypes.map((type) => (
          <span key={type} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[hsl(48,20%,96%)] text-[hsl(215,16%,40%)] border border-[#E5E5E2]">
            {QUESTION_TYPE_LABELS[type]}
          </span>
        ))}
      </div>

      {/* Difficulty bar */}
      <div className="flex gap-1 rounded-full overflow-hidden h-1.5 mb-4">
        {(['easy','medium','hard'] as const).map((level) => {
          const pct = assignment.difficultyDistribution?.[level] ?? 0
          return pct > 0 ? (
            <div key={level} className="h-full rounded-full transition-all"
              style={{ flex: pct, background: level==='easy'?'#4ade80':level==='medium'?'#facc15':'#f87171', minWidth: 6 }}
              title={`${level}: ${pct}%`}
            />
          ) : null
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0EFE8]">
        <p className="text-[11.5px] text-[hsl(215,16%,55%)]">Created {formatDate(assignment.createdAt)}</p>

        {!confirmDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E2] text-[hsl(215,16%,55%)] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
            <Link
              href={`/assessments/${assignment._id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[hsl(222,47%,11%)] px-3.5 py-2 text-[12.5px] font-semibold text-white transition-all hover:opacity-90"
            >
              Open <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-[#E5E5E2] px-3 py-1.5 text-[12px] font-medium text-[hsl(222,47%,11%)]">
              Cancel
            </button>
            <button onClick={() => onDelete(assignment._id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-red-600 transition-colors">
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type SortKey = 'createdAt' | 'title' | 'totalQuestions'
type FilterStatus = 'all' | 'completed' | 'processing' | 'queued' | 'failed'

export default function AssignmentsPage() {
  const { assignments, assignmentsLoading, setAssignments, setAssignmentsLoading } = useAssessmentStore()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('createdAt')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  useEffect(() => {
    setAssignmentsLoading(true)
    fetchAssignments()
      .then((d) => setAssignments(d.assignments))
      .catch(console.error)
      .finally(() => setAssignmentsLoading(false))
  }, [setAssignments, setAssignmentsLoading])

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id)
      setAssignments(assignments.filter((a) => a._id !== id))
    } catch (err) { console.error('Delete failed:', err) }
  }

  const filtered = assignments
    .filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || (a.subject||'').toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'totalQuestions') return b.totalQuestions - a.totalQuestions
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const statusCounts = {
    all: assignments.length,
    completed: assignments.filter((a) => a.status === 'completed').length,
    processing: assignments.filter((a) => a.status === 'processing').length,
    queued: assignments.filter((a) => a.status === 'queued').length,
    failed: assignments.filter((a) => a.status === 'failed').length,
  }

  const TAB_LABELS: Record<FilterStatus, string> = { all: 'All', completed: 'Active', processing: 'Processing', queued: 'Queued', failed: 'Failed' }

  return (
    <div className="space-y-5">

      {/* Header */}
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

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E5E2]">
        {(Object.keys(TAB_LABELS) as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2.5 text-[13.5px] font-medium border-b-2 transition-all -mb-px ${
              filterStatus === status
                ? 'border-[hsl(222,47%,11%)] text-[hsl(222,47%,11%)]'
                : 'border-transparent text-[hsl(215,16%,47%)] hover:text-[hsl(222,47%,11%)]'
            }`}
          >
            {TAB_LABELS[status]}
            {status === 'all' && <span className="ml-1.5 text-[11px] font-semibold bg-[hsl(222,47%,11%)] text-white px-1.5 py-0.5 rounded-full">{statusCounts.all}</span>}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215,16%,55%)]" />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#E5E5E2] bg-white pl-8 pr-3 text-[13px] outline-none transition-all focus:border-[hsl(222,47%,11%)]/40 focus:ring-2 focus:ring-[hsl(222,47%,11%)]/8"
          />
        </div>
        <div className="relative">
          <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215,16%,55%)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-xl border border-[#E5E5E2] bg-white pl-8 pr-8 text-[13px] outline-none transition-all focus:border-[hsl(222,47%,11%)]/40 appearance-none cursor-pointer"
          >
            <option value="createdAt">Newest</option>
            <option value="title">Title</option>
            <option value="totalQuestions">Questions</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {assignmentsLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-shimmer h-[280px] rounded-[14px]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[hsl(48,20%,96%)] border border-[#E5E5E2]">
            <FileText size={28} className="text-[hsl(215,16%,55%)]" />
          </div>
          <h3 className="text-[17px] font-bold text-[hsl(222,47%,11%)] mb-2">
            {search || filterStatus !== 'all' ? 'No Matching Assignments' : 'No Assignments Yet'}
          </h3>
          <p className="text-[13px] text-[hsl(215,16%,47%)] max-w-xs mx-auto mb-5">
            {search || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Start creating intelligent AI-powered assessments.'}
          </p>
          {!search && filterStatus === 'all' && (
            <Link href="/assignments/create" className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-5 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity">
              <Plus size={14} /> Create Assignment
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
