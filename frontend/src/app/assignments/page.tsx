'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  Search,
  ArrowUpDown,
  Trash2,
  ArrowRight,
  Plus,
  FileText,
  Clock3,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import {
  fetchAssignments,
  deleteAssignment,
} from '@/lib/api'

import {
  formatDate,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

import { Assignment } from '@/types'

const FIGMA_STATUS: Record<
  string,
  {
    dot: string
    bg: string
    text: string
    label: string
  }
> = {
  completed: {
    dot: '●',
    bg: 'bg-[#EBF7F0]',
    text: 'text-[#1A7A47]',
    label: 'Active',
  },

  draft: {
    dot: '○',
    bg: 'bg-[#FEF9E7]',
    text: 'text-[#A07800]',
    label: 'Draft',
  },

  queued: {
    dot: '◌',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1E5FAD]',
    label: 'Queued',
  },

  processing: {
    dot: '◌',
    bg: 'bg-[#F3F0FF]',
    text: 'text-[#5B2DA6]',
    label: 'Processing',
  },

  failed: {
    dot: '✕',
    bg: 'bg-[#FEF0ED]',
    text: 'text-[#B83F20]',
    label: 'Failed',
  },
}

function AssignmentCard({
  assignment,
  onDelete,
}: {
  assignment: Assignment
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] =
    useState(false)

  const st =
    FIGMA_STATUS[assignment.status] ??
    FIGMA_STATUS.draft

  return (
    <div
      className="
        group
        relative
        rounded-2xl
        border
        border-zinc-200/70
        bg-white
        p-5
        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        transition-all
        duration-200
        hover:-translate-y-[2px]
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]
      "
    >

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <Link
          href={`/assessments/${assignment._id}`}
          className="
            flex-1
            line-clamp-2
            text-[15px]
            font-semibold
            leading-[1.35]
            tracking-[-0.01em]
            text-zinc-900
            transition-colors
            hover:text-zinc-700
          "
        >
          {assignment.title}
        </Link>

        <span
          className={`
            inline-flex
            items-center
            gap-1
            rounded-full
            px-2.5
            py-1
            text-[11.5px]
            font-semibold
            ${st.bg}
            ${st.text}
          `}
        >
          {st.dot} {st.label}
        </span>
      </div>

      {/* Subject */}
      {assignment.subject && (
        <p className="mb-4 text-[13px] text-zinc-500">
          {assignment.subject}
        </p>
      )}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">

        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-zinc-50
            p-3
          "
        >
          <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
            <FileText size={13} />

            <span className="text-[11px] font-medium">
              Questions
            </span>
          </div>

          <p className="text-[16px] font-bold text-zinc-900">
            {assignment.totalQuestions}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-zinc-200
            bg-zinc-50
            p-3
          "
        >
          <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
            <Clock3 size={13} />

            <span className="text-[11px] font-medium">
              Marks
            </span>
          </div>

          <p className="text-[16px] font-bold text-zinc-900">
            {assignment.totalMarks}
          </p>
        </div>
      </div>

      {/* Question Types */}
      <div className="mb-4 flex flex-wrap gap-2">
        {assignment.questionTypes.map((type) => (
          <span
            key={type}
            className="
              rounded-full
              border
              border-zinc-200
              bg-zinc-50
              px-2.5
              py-1
              text-[11px]
              font-medium
              text-zinc-600
            "
          >
            {QUESTION_TYPE_LABELS[type]}
          </span>
        ))}
      </div>

      {/* Difficulty */}
      <div className="mb-5 flex h-1.5 gap-1 overflow-hidden rounded-full">
        {(
          ['easy', 'medium', 'hard'] as const
        ).map((level) => {
          const pct =
            assignment.difficultyDistribution?.[
              level
            ] ?? 0

          return pct > 0 ? (
            <div
              key={level}
              className="h-full rounded-full"
              style={{
                flex: pct,
                background:
                  level === 'easy'
                    ? '#4ade80'
                    : level === 'medium'
                    ? '#facc15'
                    : '#f87171',
                minWidth: 6,
              }}
            />
          ) : null
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4">

        <p className="text-[12px] text-zinc-400">
          Created{' '}
          {formatDate(assignment.createdAt)}
        </p>

        {!confirmDelete ? (
          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setConfirmDelete(true)
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-200
                text-zinc-500
                transition-all
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-500
              "
            >
              <Trash2 size={14} />
            </button>

            <Link
              href={`/assessments/${assignment._id}`}
              className="
                inline-flex
                h-9
                items-center
                gap-1.5
                rounded-xl
                bg-[#0B1736]
                px-4
                text-[12.5px]
                font-semibold
                text-white
                transition-all
                hover:opacity-90
              "
            >
              Open

              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setConfirmDelete(false)
              }
              className="
                rounded-xl
                border
                border-zinc-200
                px-3
                py-2
                text-[12px]
                font-medium
                text-zinc-900
              "
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onDelete(assignment._id)
              }
              className="
                rounded-xl
                bg-red-500
                px-3
                py-2
                text-[12px]
                font-medium
                text-white
                transition-colors
                hover:bg-red-600
              "
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

type SortKey =
  | 'createdAt'
  | 'title'
  | 'totalQuestions'

type FilterStatus =
  | 'all'
  | 'completed'
  | 'processing'
  | 'queued'
  | 'failed'

export default function AssignmentsPage() {
  const {
    assignments,
    assignmentsLoading,
    setAssignments,
    setAssignmentsLoading,
  } = useAssessmentStore()

  const [search, setSearch] = useState('')

  const [sortBy, setSortBy] =
    useState<SortKey>('createdAt')

  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>('all')

  useEffect(() => {
    setAssignmentsLoading(true)

    fetchAssignments()
      .then((d) =>
        setAssignments(d.assignments)
      )
      .catch(console.error)
      .finally(() =>
        setAssignmentsLoading(false)
      )
  }, [setAssignments, setAssignmentsLoading])

  const handleDelete = async (
    id: string
  ) => {
    try {
      await deleteAssignment(id)

      setAssignments(
        assignments.filter(
          (a) => a._id !== id
        )
      )
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const filtered = assignments
    .filter((a) => {
      const matchesSearch =
        a.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (a.subject || '')
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        filterStatus === 'all' ||
        a.status === filterStatus

      return (
        matchesSearch && matchesStatus
      )
    })
    .sort((a, b) => {
      if (sortBy === 'title')
        return a.title.localeCompare(
          b.title
        )

      if (sortBy === 'totalQuestions')
        return (
          b.totalQuestions -
          a.totalQuestions
        )

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
    })

  const statusCounts = {
    all: assignments.length,

    completed: assignments.filter(
      (a) => a.status === 'completed'
    ).length,

    processing: assignments.filter(
      (a) => a.status === 'processing'
    ).length,

    queued: assignments.filter(
      (a) => a.status === 'queued'
    ).length,

    failed: assignments.filter(
      (a) => a.status === 'failed'
    ).length,
  }

  const TAB_LABELS: Record<
    FilterStatus,
    string
  > = {
    all: 'All',
    completed: 'Active',
    processing: 'Processing',
    queued: 'Queued',
    failed: 'Failed',
  }

  return (
    <div className="flex h-full flex-col">

      {/* SHOW TOOLBAR ONLY WHEN ASSIGNMENTS EXIST */}
      {assignments.length > 0 && (
        <div className="space-y-5">

          {/* Tabs */}
          <div className="flex gap-0 border-b border-zinc-200">
            {(
              Object.keys(
                TAB_LABELS
              ) as FilterStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status)
                }
                className={`
                  -mb-px
                  border-b-2
                  px-4
                  py-2.5
                  text-[13.5px]
                  font-medium
                  transition-all
                  ${
                    filterStatus === status
                      ? 'border-zinc-900 text-zinc-900'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }
                `}
              >
                {TAB_LABELS[status]}

                {status === 'all' && (
                  <span
                    className="
                      ml-1.5
                      rounded-full
                      bg-zinc-900
                      px-1.5
                      py-0.5
                      text-[11px]
                      font-semibold
                      text-white
                    "
                  >
                    {statusCounts.all}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              {/* Search */}
              <div className="relative w-[320px]">

                <Search
                  size={14}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-zinc-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-10
                    w-full
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    pl-9
                    pr-4
                    text-[13px]
                    outline-none
                    transition-all
                    placeholder:text-zinc-400
                    focus:border-zinc-300
                    focus:ring-4
                    focus:ring-zinc-100
                  "
                />
              </div>

              {/* Sort */}
              <div className="relative">

                <ArrowUpDown
                  size={13}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-zinc-400
                  "
                />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target
                        .value as SortKey
                    )
                  }
                  className="
                    h-10
                    cursor-pointer
                    appearance-none
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    pl-9
                    pr-8
                    text-[13px]
                    outline-none
                    transition-all
                    focus:border-zinc-300
                    focus:ring-4
                    focus:ring-zinc-100
                  "
                >
                  <option value="createdAt">
                    Newest
                  </option>

                  <option value="title">
                    Title
                  </option>

                  <option value="totalQuestions">
                    Questions
                  </option>
                </select>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/assignments/create"
              className="
                inline-flex
                h-11
                items-center
                gap-2
                rounded-2xl
                bg-[#0B1736]
                px-5
                text-[13px]
                font-semibold
                text-white
                transition-all
                hover:opacity-90
              "
            >
              <Plus size={15} />

              Create Assignment
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {assignmentsLoading ? (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
                skeleton-shimmer
                h-[300px]
                rounded-2xl
              "
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (

        /* Empty State */
        <div className="flex flex-1 items-center justify-center pb-24">

          <div className="mx-auto flex max-w-[460px] flex-col items-center text-center">

            <div
              className="
                mb-10
                flex
                h-36
                w-36
                items-center
                justify-center
                rounded-[40px]
                bg-zinc-50
              "
            >
              <FileText
                size={58}
                className="text-zinc-400"
                strokeWidth={1.6}
              />
            </div>

            <h3
              className="
                mb-4
                text-[42px]
                font-bold
                leading-[1]
                tracking-[-0.06em]
                text-zinc-900
              "
            >
              {search ||
              filterStatus !== 'all'
                ? 'No Matching Assignments'
                : 'No assignments yet'}
            </h3>

            <p
              className="
                mb-10
                max-w-[520px]
                text-[16px]
                leading-[1.8]
                text-zinc-500
              "
            >
              {search ||
              filterStatus !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.'}
            </p>

            {!search &&
              filterStatus === 'all' && (
                <Link
                  href="/assignments/create"
                  className="
                    inline-flex
                    h-14
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#0B1736]
                    px-7
                    text-[15px]
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:opacity-90
                  "
                >
                  <Plus size={17} />

                  Create Your First Assignment
                </Link>
              )}
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}