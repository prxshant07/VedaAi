'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  Search,
  Plus,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import {
  fetchAssignments,
  deleteAssignment,
} from '@/lib/api'

import { EmptyState } from '@/components/ui/empty-state'

import { AssignmentCardV2 } from '@/components/dashboard/assignment-card-v2'

export default function AssignmentsPage() {
  const {
    assignments,
    assignmentsLoading,
    setAssignments,
    setAssignmentsLoading,
  } = useAssessmentStore()

  const [search, setSearch] = useState('')

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

  const filtered = assignments.filter((a) => {
    return (
      a.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (a.subject || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  })

  return (
    <div className="flex h-full flex-col">

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <EmptyState
          illustration="/illustrations/Illustrations.png"
          title="No assignments yet"
          description="Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading."
          actionLabel="Create Your First Assignment"
          actionHref="/assignments/create"
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">

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

          {/* Grid */}
          <div
            className="
              grid
              grid-cols-2
              gap-[10px]
            "
          >
            {filtered.map((assignment) => (
              <AssignmentCardV2
                key={assignment._id}
                id={assignment._id}
                title={assignment.title}
                createdAt={
                  assignment.createdAt
                    ? new Date(
                        assignment.createdAt
                      ).toLocaleDateString(
                        'en-GB'
                      )
                    : ''
                }
                dueDate={
                  assignment.dueDate
                    ? new Date(
                        assignment.dueDate
                      ).toLocaleDateString(
                        'en-GB'
                      )
                    : ''
                }
                status={
                  assignment.status ===
                  'completed'
                    ? 'completed'
                    : assignment.status ===
                      'processing'
                    ? 'draft'
                    : 'active'
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}