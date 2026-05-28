'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
  ArrowLeft,
  RotateCcw,
  Download,
} from 'lucide-react'

import { useAssessmentStore } from '@/store/assessmentStore'

import {
  fetchAssignment,
  fetchAssessmentByAssignment,
  regenerateAssessment,
  downloadPDF,
} from '@/lib/api'

import { useGenerationSocket } from '@/hooks/useGenerationSocket'

import {
  DIFFICULTY_COLORS,
} from '@/lib/utils'

import {
  GeneratedPaper,
  Section,
  Question,
} from '@/types'

import { GenerationStatus } from '@/components/assessment/GenerationStatus'

export const dynamic = 'force-dynamic'

function QuestionItem({
  question,
  index,
}: {
  question: Question
  index: number
}) {
  return (
    <div className="flex gap-3 border-b border-[#F0EFE8] py-4 last:border-0">

      <div
        className="
          min-w-[24px]
          flex-shrink-0
          pt-0.5
          font-mono
          text-[12px]
          text-[hsl(215,16%,55%)]
        "
      >
        Q{index + 1}.
      </div>

      <div className="flex-1">

        <p
          className="
            mb-3
            text-[13.5px]
            leading-relaxed
            text-[hsl(222,47%,11%)]
          "
        >
          {question.question}
        </p>

        {question.options && (
          <ul className="mb-3 space-y-1.5">
            {question.options.map((opt, i) => (
              <li
                key={i}
                className="
                  flex
                  items-start
                  gap-2
                  text-[13px]
                  text-[hsl(215,16%,40%)]
                "
              >

                <span
                  className="
                    mt-0.5
                    flex
                    h-5
                    w-5
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E5E5E2]
                    text-[10px]
                    font-semibold
                    text-[hsl(215,16%,55%)]
                  "
                >
                  {String.fromCharCode(65 + i)}
                </span>

                {opt}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 flex items-center gap-2">

          <span
            className={`
              rounded-lg
              border
              px-2
              py-0.5
              text-[11px]
              font-semibold
              ${DIFFICULTY_COLORS[
                question.difficulty
              ]}
            `}
          >
            {question.difficulty}
          </span>

          <span
            className="
              ml-auto
              font-mono
              text-[11.5px]
              text-[hsl(215,16%,55%)]
            "
          >
            [{question.marks} marks]
          </span>
        </div>
      </div>
    </div>
  )
}

function SectionView({
  section,
  sectionIndex,
}: {
  section: Section
  sectionIndex: number
}) {
  const sectionLetter =
    String.fromCharCode(65 + sectionIndex)

  return (
    <div className="mb-6">

      <div
        className="
          mb-4
          rounded-lg
          bg-[hsl(222,47%,11%)]
          px-4
          py-2.5
          text-white
        "
      >

        <h3
          className="
            text-[13px]
            font-semibold
            tracking-[0.03em]
          "
        >
          Section {sectionLetter}:{' '}
          {section.title}
        </h3>

        {section.instruction && (
          <p
            className="
              mt-0.5
              text-[11.5px]
              italic
              text-white/70
            "
          >
            {section.instruction}
          </p>
        )}
      </div>

      {section.questions.map((q, qi) => (
        <QuestionItem
          key={q.id}
          question={q}
          index={qi}
        />
      ))}
    </div>
  )
}

function PaperView({
  paper,
}: {
  paper: GeneratedPaper
}) {
  return (
    <div
      id="printable-paper"
      className="
        rounded-[14px]
        border
        border-[#E5E5E2]
        bg-white
        p-8
        shadow-[0_1px_3px_rgba(0,0,0,0.05)]
        md:p-12
      "
    >

      <div className="mb-5 border-b-2 border-[#111] pb-5">

        <h2
          className="
            text-[22px]
            font-[700]
            tracking-[-0.04em]
            text-[#111]
          "
        >
          {paper.title}
        </h2>

        <div className="mt-3 flex items-center justify-between text-[13px] text-[#777]">

          <span>
            Questions:{' '}
            {paper.totalQuestions}
          </span>

          <span>
            Marks:{' '}
            {paper.totalMarks}
          </span>
        </div>
      </div>

      {paper.sections.map((section, si) => (
        <SectionView
          key={si}
          section={section}
          sectionIndex={si}
        />
      ))}
    </div>
  )
}

export default function AssignmentPage() {
  const params = useParams()

  const assignmentId =
    params?.id as string

  const {
    currentAssignment,
    currentPaper,
    paperLoading,
    generation,
    setCurrentAssignment,
    setCurrentPaper,
    setPaperLoading,
    setGenerationQueued,
    setGenerationStarted,
    setGenerationFailed,
    resetGeneration,
  } = useAssessmentStore()

  useGenerationSocket(assignmentId)

  const fetchedRef =
    useRef<string | null>(null)

  useEffect(() => {
    if (
      !assignmentId ||
      fetchedRef.current === assignmentId
    ) {
      return
    }

    fetchedRef.current = assignmentId

    setCurrentAssignment(null)
    setCurrentPaper(null)

    resetGeneration()

    const loadData = async () => {
      try {
        setPaperLoading(true)

        const assignmentRes =
          await fetchAssignment(
            assignmentId
          )

        if (
          assignmentRes?.assignment
        ) {
          setCurrentAssignment(
            assignmentRes.assignment
          )

          if (
            assignmentRes.assignment
              ?.jobId
          ) {
            if (
              assignmentRes.assignment
                .status === 'queued'
            ) {
              setGenerationQueued(
                assignmentRes.assignment
                  .jobId
              )
            } else if (
              assignmentRes.assignment
                .status ===
              'processing'
            ) {
              setGenerationStarted(
                assignmentRes.assignment
                  .jobId
              )
            } else if (
              assignmentRes.assignment
                .status === 'failed'
            ) {
              setGenerationFailed(
                assignmentRes.assignment
                  .errorMessage ||
                  'Generation failed'
              )
            }
          }
        }

        try {
          const paperRes =
            await fetchAssessmentByAssignment(
              assignmentId
            )

          if (paperRes?.paper) {
            setCurrentPaper(
              paperRes.paper
            )
          }
        } catch (err) {
          console.error(
            'Paper fetch failed:',
            err
          )
        }
      } catch (err) {
        console.error(
          'Assignment fetch failed:',
          err
        )
      } finally {
        setPaperLoading(false)
      }
    }

    loadData()
  }, [
    assignmentId,
    setCurrentAssignment,
    setCurrentPaper,
    setPaperLoading,
    setGenerationQueued,
    setGenerationStarted,
    setGenerationFailed,
    resetGeneration,
  ])

  const handleRegenerate =
    async () => {
      try {
        const res =
          await regenerateAssessment(
            assignmentId
          )

        if (res?.jobId) {
          setGenerationQueued(
            res.jobId
          )
        }
      } catch (err) {
        console.error(err)
      }
    }

  const handleDownload =
    async () => {
      try {
        await downloadPDF(
          assignmentId
        )
      } catch {
        window.print()
      }
    }

  return (
    <div className="mx-auto max-w-3xl space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <Link
            href="/assignments"
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-[#E5E5E2]
              bg-white
              px-3
              py-2
              text-[13px]
              font-medium
              text-[#666]
            "
          >
            <ArrowLeft size={14} />
            Assignments
          </Link>

          <h1
            className="
              text-[16px]
              font-[700]
              text-[#111]
            "
          >
            {currentAssignment?.title ||
              'Assignment'}
          </h1>
        </div>

        {currentPaper && (
          <div className="flex items-center gap-2">

            <button
              onClick={
                handleRegenerate
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                border
                border-[#E5E5E2]
                px-3.5
                py-2
                text-[12.5px]
                font-medium
                text-[#555]
              "
            >
              <RotateCcw size={13} />
              Regenerate
            </button>

            <button
              onClick={handleDownload}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                bg-[#111]
                px-3.5
                py-2
                text-[12.5px]
                font-semibold
                text-white
              "
            >
              <Download size={13} />
              Download PDF
            </button>
          </div>
        )}
      </div>

      <GenerationStatus
        status={generation.status}
        progress={
          generation.progress
        }
        message={
          generation.message
        }
        error={generation.error}
      />

      {paperLoading ? (
        <div
          className="
            rounded-[14px]
            border
            border-[#E5E5E2]
            bg-white
            p-6
          "
        >
          Loading...
        </div>
      ) : currentPaper ? (
        <PaperView
          paper={currentPaper}
        />
      ) : (
        <div
          className="
            rounded-[14px]
            border
            border-[#E5E5E2]
            bg-white
            p-10
            text-center
            text-[#777]
          "
        >
          No generated paper found.
        </div>
      )}
    </div>
  )
}