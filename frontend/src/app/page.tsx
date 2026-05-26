'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import {
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  ArrowRight,
  Clock3,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import { fetchAssignments } from '@/lib/api'

import {
  formatDate,
  STATUS_COLORS,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

import { Assignment } from '@/types'

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  value,
  label,
  icon,
}: {
  value: number
  label: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-border
        bg-white
        p-6
        shadow-card
      "
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-textSecondary">
            {label}
          </p>

          <h3 className="mt-4 text-4xl font-bold tracking-tight text-textPrimary">
            {value}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================
   ASSIGNMENT CARD
========================================= */

function AssignmentCard({
  assignment,
}: {
  assignment: Assignment
}) {
  return (
    <Link
      href={`/assessments/${assignment._id}`}
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
        <div className="flex items-start justify-between gap-4">
          <div
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
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Sparkles size={18} />
          </div>
        </div>

        {/* Title */}
        <div className="mt-5">
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-textPrimary">
            {assignment.title}
          </h3>

          <p className="mt-2 text-sm text-textSecondary">
            {assignment.subject || 'General'}
          </p>
        </div>

        {/* Meta */}
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
          {assignment.questionTypes
            ?.slice(0, 3)
            .map((type) => (
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
            ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-textSecondary">
              Due{' '}
              {formatDate(
                assignment.dueDate
              )}
            </p>
          </div>

          <div
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
              group-hover:bg-violet-700
            "
          >
            Open

            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* =========================================
   PAGE
========================================= */

export default function DashboardPage() {
  const {
    assignments,
    assignmentsLoading,
    setAssignments,
    setAssignmentsLoading,
    setAssignmentsError,
  } = useAssessmentStore()

  useEffect(() => {
    setAssignmentsLoading(true)

    fetchAssignments()
      .then((data) =>
        setAssignments(data.assignments)
      )
      .catch((err) =>
        setAssignmentsError(err.message)
      )
      .finally(() =>
        setAssignmentsLoading(false)
      )
  }, [
    setAssignments,
    setAssignmentsLoading,
    setAssignmentsError,
  ])

  const stats = {
    total: assignments.length,

    completed: assignments.filter(
      (a) => a.status === 'completed'
    ).length,

    processing: assignments.filter(
      (a) => a.status === 'processing'
    ).length,

    questions: assignments.reduce(
      (s, a) =>
        s + (a.totalQuestions || 0),
      0
    ),
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

              AI Powered Assessment System
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight xl:text-5xl">
              Create Modern Assessments Faster
            </h1>

            <p className="mt-4 max-w-xl text-violet-100 text-lg leading-relaxed">
              Generate AI-powered assignments,
              track performance, and manage
              assessments in one intelligent
              dashboard.
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

              <Link
                href="/assignments"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur-sm
                "
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          value={stats.total}
          label="Total Assessments"
          icon={<Sparkles size={24} />}
        />

        <StatCard
          value={stats.completed}
          label="Completed"
          icon={
            <CheckCircle2 size={24} />
          }
        />

        <StatCard
          value={stats.processing}
          label="Processing"
          icon={<Loader2 size={24} />}
        />

        <StatCard
          value={stats.questions}
          label="Questions Generated"
          icon={<FileText size={24} />}
        />
      </section>

      {/* ASSIGNMENTS */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">
              Recent Assignments
            </h2>

            <p className="mt-1 text-sm text-textSecondary">
              Recently generated AI-powered
              assessments
            </p>
          </div>

          <Link
            href="/assignments"
            className="
              hidden
              rounded-2xl
              bg-violet-50
              px-5
              py-3
              text-sm
              font-semibold
              text-violet-700
              transition-all
              hover:bg-violet-100
              md:inline-flex
            "
          >
            View All
          </Link>
        </div>

        {assignmentsLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="
                  skeleton-shimmer
                  h-[320px]
                  rounded-[28px]
                "
              />
            ))}
          </div>
        ) : assignments.length === 0 ? (
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
              No Assignments Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-textSecondary">
              Start creating intelligent
              AI-powered assessments for your
              students and teams.
            </p>

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
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {assignments
              .slice(0, 6)
              .map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  )
}