'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import {
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import { fetchAssignments } from '@/lib/api'

import { AssignmentCard } from '@/components/assessment/AssignmentCard'

import { StatCard } from '@/components/dashboard/stat-card'

import { EmptyState } from '@/components/ui/empty-state'

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
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1
            className="
              text-[20px]
              font-bold
              tracking-tight
              text-[hsl(222,47%,11%)]
            "
          >
            Assignments
          </h1>

          <p
            className="
              mt-0.5
              text-[13px]
              text-[hsl(215,16%,47%)]
            "
          >
            Create and manage assignments
            for your classes
          </p>
        </div>

        <Link
          href="/assignments/create"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[hsl(222,47%,11%)]
            px-4
            py-2.5
            text-[13px]
            font-semibold
            text-white
            transition-opacity
            hover:opacity-90
          "
        >
          <Plus
            size={15}
            strokeWidth={2.5}
          />

          Create Assignment
        </Link>
      </div>

      {/* Stats */}
      <section
        className="
          grid
          grid-cols-2
          gap-4
          xl:grid-cols-4
        "
      >
        <StatCard
          value={stats.total}
          title="Total Assessments"
          icon={<Sparkles size={20} />}
        />

        <StatCard
          value={stats.completed}
          title="Completed"
          icon={<CheckCircle2 size={20} />}
        />

        <StatCard
          value={stats.processing}
          title="Processing"
          icon={<Loader2 size={20} />}
        />

        <StatCard
          value={stats.questions}
          title="Questions Generated"
          icon={<FileText size={20} />}
        />
      </section>

      {/* Recent Assignments */}
      <section>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2
              className="
                text-[16px]
                font-bold
                text-[hsl(222,47%,11%)]
              "
            >
              Recent Assignments
            </h2>

            <p
              className="
                mt-0.5
                text-[12.5px]
                text-[hsl(215,16%,47%)]
              "
            >
              Recently generated
              AI-powered assessments
            </p>
          </div>

          <Link
            href="/assignments"
            className="
              inline-flex
              items-center
              gap-1.5
              text-[12.5px]
              font-semibold
              text-[hsl(222,47%,11%)]
              transition-opacity
              hover:opacity-70
            "
          >
            View All

            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Loading */}
        {assignmentsLoading ? (
          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="
                  skeleton-shimmer
                  h-[220px]
                  rounded-[24px]
                  bg-[#E4E4E4]
                "
              />
            ))}
          </div>

        /* Empty State */
        ) : assignments.length === 0 ? (

          <EmptyState
            illustration="/illustrations/Illustrations.png"
            title="No assignments yet"
            description="Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading."
            actionLabel="Create Your First Assignment"
            actionHref="/assignments/create"
          />

        /* Populated */
        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {assignments
              .slice(0, 6)
              .map((a) => (
                <AssignmentCard
                  key={a._id}
                  assignment={a}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  )
}