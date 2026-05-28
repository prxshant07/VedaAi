'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import {
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  Plus,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import { fetchAssignments } from '@/lib/api'

import { AssignmentCardV2 } from '@/components/dashboard/assignment-card-v2'

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
    <div className="space-y-[20px]">

      {/* Header */}
      <section>

        <div className="flex items-center gap-2">

          <div
            className="
              h-[14px]
              w-[14px]
              rounded-full
              bg-[#58D26B]
            "
          />

          <h1
            className="
              text-[32px]
              font-[700]
              leading-none
              tracking-[-0.06em]
              text-[#1F1F1F]
            "
          >
            Assignments
          </h1>
        </div>

        <p
          className="
            mt-[8px]
            text-[15px]
            font-[500]
            text-[#8A8A8A]
          "
        >
          Manage and create assignments for your classes.
        </p>
      </section>

      {/* Toolbar */}
      <section
        className="
          flex
          items-center
          justify-between
          rounded-[20px]
          bg-[#F8F8F8]
          px-[18px]
          py-[10px]
        "
      >

        {/* Filter */}
        <button
          className="
            flex
            items-center
            gap-2
            text-[14px]
            font-[600]
            text-[#8A8A8A]
          "
        >

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
          </svg>

          Filter By
        </button>

        {/* Search */}
        <div className="relative w-[355px]">

          <svg
            className="
              absolute
              left-[16px]
              top-1/2
              -translate-y-1/2
              text-[#A0A0A0]
            "
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            placeholder="Search Assignment"
            className="
              h-[44px]
              w-full
              rounded-full
              border
              border-[#DADADA]
              bg-white
              pl-[44px]
              pr-[18px]
              text-[14px]
              font-[500]
              text-[#1F1F1F]
              outline-none
              placeholder:text-[#A0A0A0]
            "
          />
        </div>
      </section>

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

      {/* Assignments */}
      <section>

        {/* Loading */}
        {assignmentsLoading ? (

          <div
            className="
              grid
              grid-cols-2
              gap-[10px]
            "
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="
                  skeleton-shimmer
                  h-[132px]
                  rounded-[24px]
                  bg-[#E4E4E4]
                "
              />
            ))}
          </div>

        ) : assignments.length === 0 ? (

          <EmptyState
            illustration="/illustrations/Illustrations.png"
            title="No assignments yet"
            description="Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading."
            actionLabel="Create Your First Assignment"
            actionHref="/assignments/create"
          />

        ) : (

          <>
            {/* Cards */}
            <section
              className="
                grid
                grid-cols-2
                gap-[10px]
              "
            >
              {assignments
                .slice(0, 6)
                .map((a) => (
                  <AssignmentCardV2
                    key={a._id}
                    id={a._id}
                    title={a.title}
                    subject={a.subject || 'General'}
                    questions={a.totalQuestions || 0}
                    createdAt={a.createdAt}
                    dueDate={a.dueDate}
                    status={
                      a.status === 'completed'
                        ? 'completed'
                        : a.status === 'processing'
                        ? 'draft'
                        : 'active'
                    }
                  />
                ))}
            </section>

            {/* Floating Create Button */}
            <div
              className="
                fixed
                bottom-[24px]
                left-1/2
                z-50
                -translate-x-1/2
              "
            >

              <Link
                href="/assignments/create"
                className="
                  flex
                  h-[56px]
                  items-center
                  gap-2
                  rounded-full
                  bg-[#101010]
                  px-[28px]
                  text-[16px]
                  font-[600]
                  text-white
                  shadow-[0_14px_40px_rgba(0,0,0,0.24)]
                "
              >

                <Plus size={18} />

                Create Assignment
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}