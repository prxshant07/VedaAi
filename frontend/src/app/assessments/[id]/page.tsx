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
  fetchJobStatus,
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

        {(question.type === 'short' ||
          question.type === 'long') && (
          <div className="mb-3 space-y-2">
            {Array.from({
              length:
                question.type === 'long'
                  ? 6
                  : 3,
            }).map((_, i) => (
              <div
                key={i}
                className="h-6 border-b border-[#E5E5E2]"
              />
            ))}
          </div>
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
            [{question.marks} mark
            {question.marks !== 1
              ? 's'
              : ''}
            ]
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

      {/* Header */}
      <div className="mb-5 flex items-center gap-4 border-b-2 border-[hsl(222,47%,11%)] pb-5">

        <div
          className="
            flex
            h-14
            w-14
            flex-shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[hsl(222,47%,11%)]
            text-[16px]
            font-bold
            text-[hsl(45,100%,54%)]
          "
        >
          DP
        </div>

        <div>

          <h2
            className="
              text-[17px]
              font-bold
              text-[hsl(222,47%,11%)]
            "
          >
            Delhi Public School,
            Sector-4, Bokaro
          </h2>

          <p
            className="
              mt-0.5
              text-[12.5px]
              text-[hsl(215,16%,47%)]
            "
          >
            {paper.title}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div
        className="
          mb-4
          grid
          grid-cols-3
          gap-3
          text-[12.5px]
          text-[hsl(215,16%,47%)]
        "
      >

        <span>
          <strong className="text-[hsl(222,47%,11%)]">
            Time:
          </strong>{' '}
          {Math.max(
            30,
            paper.totalQuestions * 3
          )}{' '}
          minutes
        </span>

        <span className="text-center">
          <strong className="text-[hsl(222,47%,11%)]">
            Total Marks:
          </strong>{' '}
          {paper.totalMarks}
        </span>

        <span className="text-right">
          <strong className="text-[hsl(222,47%,11%)]">
            Questions:
          </strong>{' '}
          {paper.totalQuestions}
        </span>
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

export default function AssessmentPage() {
  const params = useParams()

  const assignmentId =
    params.id as string

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
    setGenerationComplete,
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
    )
      return

    fetchedRef.current = assignmentId

    setCurrentAssignment(null)
    setCurrentPaper(null)
    resetGeneration()

    Promise.all([
      fetchAssignment(
        assignmentId
      ).then((r) => {
        setCurrentAssignment(r.assignment)

        if (r.assignment.jobId) {
          if (
            r.assignment.status ===
            'queued'
          )
            setGenerationQueued(
              r.assignment.jobId
            )
          else if (
            r.assignment.status ===
            'processing'
          )
            setGenerationStarted(
              r.assignment.jobId
            )
          else if (
            r.assignment.status ===
            'failed'
          )
            setGenerationFailed(
              r.assignment.errorMessage ||
                'Generation failed'
            )
        }
      }),

      (() => {
        setPaperLoading(true)

        return fetchAssessmentByAssignment(
          assignmentId
        )
          .then((r) =>
            setCurrentPaper(r.paper)
          )
          .finally(() =>
            setPaperLoading(false)
          )
      })(),
    ])
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

        setGenerationQueued(res.jobId)
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

        <div className="flex min-w-0 items-center gap-3">

          <Link
            href="/assignments"
            className="
              flex
              flex-shrink-0
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
              text-[hsl(215,16%,47%)]
            "
          >
            <ArrowLeft size={14} />

            Assignments
          </Link>

          <span className="text-[hsl(215,16%,60%)]">
            /
          </span>

          <h1
            className="
              truncate
              text-[15px]
              font-semibold
              text-[hsl(222,47%,11%)]
            "
          >
            {currentAssignment?.title ||
              'Assessment'}
          </h1>
        </div>

        {currentPaper && (
          <div className="flex flex-shrink-0 items-center gap-2">

            <button
              onClick={handleRegenerate}
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
                text-[hsl(215,16%,40%)]
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
                bg-[hsl(222,47%,11%)]
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
        progress={generation.progress}
        message={generation.message}
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
            shadow-[0_1px_3px_rgba(0,0,0,0.05)]
          "
        >
          Loading...
        </div>
      ) : currentPaper ? (
        <PaperView paper={currentPaper} />
      ) : null}
    </div>
  )
}