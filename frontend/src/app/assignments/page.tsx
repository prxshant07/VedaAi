'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Sparkles,
  Search,
  ArrowUpDown,
  Clock3,
  FileText,
  Trash2,
  ArrowRight,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import {
  fetchAssignments,
  deleteAssignment,
} from '@/lib/api'

import {
  formatDate,
  STATUS_COLORS,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

import { Assignment } from '@/types'

/* =========================================
   CARD
========================================= */

function AssignmentCard({
  assignment,
  onDelete,
}: {
  assignment: Assignment
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] =
    useState(false)

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-border
        bg-white
        p-5
        shadow-card
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-100/40 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/assessments/${assignment._id}`}
              className="
                line-clamp-2
                text-xl
                font-semibold
                leading-snug
                text-textPrimary
                transition-colors
                hover:text-violet-700
              "
            >
              {assignment.title}
            </Link>

            {assignment.subject && (
              <p className="mt-2 text-sm text-textSecondary">
                {assignment.subject}
              </p>
            )}
          </div>

          <span
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              capitalize
              ${STATUS_COLORS[assignment.status]}
            `}
          >
            {assignment.status}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-textSecondary">
              <FileText size={16} />

              <span className="text-xs font-medium">
                Questions
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-textPrimary">
              {assignment.totalQuestions}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-textSecondary">
              <Clock3 size={16} />

              <span className="text-xs font-medium">
                Marks
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-textPrimary">
              {assignment.totalMarks}
            </p>
          </div>
        </div>

        {/* Question Types */}
        <div className="mt-5 flex flex-wrap gap-2">
          {assignment.questionTypes.map(
            (type) => (
              <span
                key={type}
                className="
                  rounded-full
                  bg-violet-50
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-violet-700
                "
              >
                {QUESTION_TYPE_LABELS[type]}
              </span>
            )
          )}
        </div>

        {/* Difficulty */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-textSecondary">
              Difficulty Distribution
            </span>
          </div>

          <div className="flex gap-1">
            {(
              [
                'easy',
                'medium',
                'hard',
              ] as const
            ).map((level) => {
              const pct =
                assignment
                  .difficultyDistribution?.[
                  level
                ] ?? 0

              return (
                <div
                  key={level}
                  className="h-2 rounded-full transition-all"
                  style={{
                    flex: pct,
                    background:
                      level === 'easy'
                        ? '#4ade80'
                        : level ===
                          'medium'
                        ? '#facc15'
                        : '#f87171',
                    minWidth:
                      pct > 0 ? 8 : 0,
                  }}
                  title={`${level}: ${pct}%`}
                />
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-xs text-textSecondary">
              Created{' '}
              {formatDate(
                assignment.createdAt
              )}
            </p>
          </div>

          {!confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setConfirmDelete(true)
                }
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-border
                  text-textSecondary
                  transition-all
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <Trash2 size={18} />
              </button>

              <Link
                href={`/assessments/${assignment._id}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-violet-600
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  hover:bg-violet-700
                "
              >
                Open

                <ArrowRight size={16} />
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
                  border-border
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-textPrimary
                "
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  onDelete(
                    assignment._id
                  )
                }
                className="
                  rounded-xl
                  bg-red-500
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                "
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================
   SKELETON
========================================= */

function SkeletonCard() {
  return (
    <div
      className="
        skeleton-shimmer
        h-[340px]
        rounded-[28px]
      "
    />
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

/* =========================================
   PAGE
========================================= */

export default function AssignmentsPage() {
  const {
    assignments,
    assignmentsLoading,
    setAssignments,
    setAssignmentsLoading,
  } = useAssessmentStore()

  const [search, setSearch] =
    useState('')

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
  }, [
    setAssignments,
    setAssignmentsLoading,
  ])

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
      console.error(
        'Delete failed:',
        err
      )
    }
  }

  const filtered = assignments
    .filter((a) => {
      const matchesSearch =
        a.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        (a.subject || '')
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchesStatus =
        filterStatus === 'all' ||
        a.status === filterStatus

      return (
        matchesSearch &&
        matchesStatus
      )
    })

    .sort((a, b) => {
      if (sortBy === 'title')
        return a.title.localeCompare(
          b.title
        )

      if (
        sortBy === 'totalQuestions'
      )
        return (
          b.totalQuestions -
          a.totalQuestions
        )

      return (
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
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

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[36px]
          bg-gradient-to-br
          from-violet-600
          to-violet-800
          p-8
          text-white
        "
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles size={16} />

              AI Assessment Workspace
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
              Manage All Assignments
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-violet-100">
              Organize, review, and manage
              all AI-generated assessments
              from one modern dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/assignments/create"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  text-violet-700
                  transition-all
                  hover:scale-[1.02]
                "
              >
                Create Assignment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section
        className="
          rounded-[32px]
          border
          border-border
          bg-white
          p-5
          shadow-card
        "
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          {/* Search */}
          <div className="relative w-full xl:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
            />

            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-border
                bg-white
                pl-11
                pr-4
                text-sm
                outline-none
                transition-all
                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-100
              "
            />
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                'all',
                'completed',
                'processing',
                'queued',
                'failed',
              ] as FilterStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(
                    status
                  )
                }
                className={`
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all

                  ${
                    filterStatus ===
                    status
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'bg-muted text-textSecondary hover:bg-violet-50 hover:text-violet-700'
                  }
                `}
              >
                {status
                  .charAt(0)
                  .toUpperCase() +
                  status.slice(1)}

                <span className="ml-2 opacity-70">
                  {
                    statusCounts[
                      status
                    ]
                  }
                </span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="xl:ml-auto">
            <div className="relative">
              <ArrowUpDown
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
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
                  h-12
                  rounded-2xl
                  border
                  border-border
                  bg-white
                  pl-11
                  pr-10
                  text-sm
                  outline-none
                  transition-all
                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-100
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
        </div>
      </section>

      {/* GRID */}
      {assignmentsLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="
            rounded-[32px]
            border
            border-border
            bg-white
            p-12
            text-center
            shadow-card
          "
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <Sparkles size={36} />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-textPrimary">
            {search ||
            filterStatus !== 'all'
              ? 'No Matching Assignments'
              : 'No Assignments Yet'}
          </h3>

          <p className="mx-auto mt-3 max-w-md text-textSecondary">
            {search ||
            filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Start creating intelligent AI-powered assessments.'}
          </p>

          {!search &&
            filterStatus ===
              'all' && (
              <Link
                href="/assignments/create"
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-600
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:bg-violet-700
                "
              >
                Create Assignment
              </Link>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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