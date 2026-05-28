'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import { useRouter } from 'next/navigation'

import {
  Upload,
  Check,
  ChevronRight,
} from 'lucide-react'

import {
  createAssignment,
  uploadFile,
} from '@/lib/api'

import { useAssessmentStore } from '@/store/assessmentStore'

import { QuestionType } from '@/types'

import {
  cn,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

const schema = z.object({
  title: z
    .string()
    .min(
      3,
      'Title must be at least 3 characters'
    ),

  dueDate: z
    .string()
    .min(1, 'Due date is required'),

  subject: z.string().optional(),

  instructions: z
    .string()
    .max(2000)
    .optional(),

  totalQuestions: z.coerce.number()
    .int()
    .min(1)
    .max(100),

  totalMarks: z.coerce.number()
    .int()
    .min(1),
})

type FormValues = z.infer<typeof schema>

const QUESTION_TYPES: QuestionType[] = [
  'mcq',
  'short',
  'long',
  'true_false',
]

type DifficultyState = {
  easy: number
  medium: number
  hard: number
}

export default function CreateAssignmentPage() {
  const router = useRouter()

  const {
    uploadedFile,
    setUploadedFile,
    setGenerationQueued,
  } = useAssessmentStore()

  const [step, setStep] =
    useState<number>(1)

  const [selectedTypes, setSelectedTypes] =
    useState<QuestionType[]>(['mcq'])

  const [difficulty, setDifficulty] =
    useState<DifficultyState>({
      easy: 33,
      medium: 34,
      hard: 33,
    })

  const [uploading, setUploading] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [formError, setFormError] =
    useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: '',
      dueDate: '',
      subject: '',
      instructions: '',
      totalQuestions: 10,
      totalMarks: 50,
    },
  })

  const values = form.watch()

  const diffSum =
    difficulty.easy +
    difficulty.medium +
    difficulty.hard

  const toggleType = (
    ty: QuestionType
  ) => {
    setSelectedTypes((prev) =>
      prev.includes(ty)
        ? prev.length > 1
          ? prev.filter((t) => t !== ty)
          : prev
        : [...prev, ty]
    )
  }

  const handleFileUpload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0]

      if (!file) return

      setUploading(true)

      setFormError(null)

      try {
        const res = await uploadFile(file)

        setUploadedFile(res.file)
      } catch (err: unknown) {
        setFormError(
          (err as Error).message ||
            'Upload failed'
        )
      } finally {
        setUploading(false)
      }
    },
    [setUploadedFile]
  )

  const goToNextStep = async () => {
    setFormError(null)

    if (step === 1) {
      const isValid = await form.trigger([
        'title',
        'dueDate',
        'totalQuestions',
        'totalMarks',
      ])

      if (!isValid) return
    }

    if (
      step === 2 &&
      diffSum !== 100
    ) {
      setFormError(
        'Difficulty percentages must add up to 100.'
      )

      return
    }

    setStep((c) =>
      Math.min(c + 1, 3)
    )
  }

  const onSubmit = async (
    data: FormValues
  ) => {
    setFormError(null)

    if (selectedTypes.length === 0) {
      setFormError(
        'Select at least one question type.'
      )

      return
    }

    if (diffSum !== 100) {
      setFormError(
        'Difficulty percentages must add up to 100.'
      )

      setStep(2)

      return
    }

    setSubmitting(true)

    try {
      const res =
        await createAssignment(
          {
            ...data,

            subject:
              data.subject ?? '',

            instructions:
              data.instructions ?? '',

            questionTypes:
              selectedTypes,

            difficultyDistribution:
              difficulty,
          },

          uploadedFile ?? undefined
        )

      setGenerationQueued(
        res.assignment.jobId
      )

      router.push(
        `/assessments/${res.assignment.id}`
      )
    } catch (err: unknown) {
      setFormError(
        (err as Error).message ||
          'Failed to create assignment'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const STEPS = [
    {
      n: 1,
      label: 'Assignment Details',
    },

    {
      n: 2,
      label: 'Upload Material',
    },

    {
      n: 3,
      label: 'Question Setup',
    },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-5">

      {/* Step Bar */}
      <div
        className="
          flex
          items-center
          gap-0
          rounded-[14px]
          border
          border-[#E5E5E2]
          bg-[hsl(48,20%,97%)]
          p-3
        "
      >
        {STEPS.map(
          ({ n, label }, i, arr) => (
            <div
              key={n}
              className="
                flex
                flex-1
                items-center
              "
            >
              <button
                type="button"
                onClick={() => setStep(n)}
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2.5
                "
              >
                <span
                  className={cn(
                    `
                      flex
                      h-6
                      w-6
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[11px]
                      font-bold
                      transition-all
                    `,

                    step > n
                      ? 'bg-[hsl(160,84%,39%)] text-white'
                      : step === n
                      ? 'bg-[hsl(222,47%,11%)] text-white'
                      : 'bg-[#E5E5E2] text-[hsl(215,16%,47%)]'
                  )}
                >
                  {step > n ? (
                    <Check
                      size={11}
                      strokeWidth={3}
                    />
                  ) : (
                    n
                  )}
                </span>

                <span
                  className={cn(
                    `
                      truncate
                      text-[12.5px]
                    `,

                    step === n
                      ? 'font-semibold text-[hsl(222,47%,11%)]'
                      : 'text-[hsl(215,16%,47%)]'
                  )}
                >
                  {label}
                </span>
              </button>

              {i < arr.length - 1 && (
                <ChevronRight
                  size={14}
                  className="
                    mx-2
                    flex-shrink-0
                    text-[#D0D0CB]
                  "
                />
              )}
            </div>
          )
        )}
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* STEP 1 */}
        {step === 1 && (
          <div
            className="
              overflow-hidden
              rounded-[14px]
              border
              border-[#E5E5E2]
              bg-white
              shadow-[0_1px_3px_rgba(0,0,0,0.05)]
            "
          >

            <div
              className="
                border-b
                border-[#F0EFE8]
                bg-[hsl(48,20%,98%)]
                px-5
                py-3.5
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]
                  text-[hsl(215,16%,55%)]
                "
              >
                Basic Info
              </p>
            </div>

            <div className="space-y-4 p-5">

              {/* Title */}
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-semibold
                    text-[hsl(215,16%,40%)]
                  "
                >
                  Assignment Title *
                </label>

                <input
                  {...form.register('title')}
                  placeholder="e.g. Quiz on Electricity"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#E5E5E2]
                    px-3.5
                    py-2.5
                    text-[13.5px]
                    transition-all
                    focus:border-[hsl(222,47%,11%)]/40
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[hsl(222,47%,11%)]/10
                  "
                />

                {form.formState.errors.title && (
                  <p
                    className="
                      mt-1
                      text-[11.5px]
                      text-red-500
                    "
                  >
                    {
                      form.formState.errors
                        .title.message
                    }
                  </p>
                )}
              </div>

              {/* Subject + Date */}
              <div className="grid grid-cols-2 gap-3">

                {/* Subject */}
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-[12px]
                      font-semibold
                      text-[hsl(215,16%,40%)]
                    "
                  >
                    Subject
                  </label>

                  <input
                    type="text"
                    {...form.register(
                      'subject'
                    )}
                    placeholder="e.g. Physics"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E5E5E2]
                      px-3.5
                      py-2.5
                      text-[13.5px]
                      transition-all
                      focus:border-[hsl(222,47%,11%)]/40
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[hsl(222,47%,11%)]/10
                    "
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-[12px]
                      font-semibold
                      text-[hsl(215,16%,40%)]
                    "
                  >
                    Due Date *
                  </label>

                  <input
                    type="date"
                    {...form.register(
                      'dueDate'
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E5E5E2]
                      px-3.5
                      py-2.5
                      text-[13.5px]
                      transition-all
                      focus:border-[hsl(222,47%,11%)]/40
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[hsl(222,47%,11%)]/10
                    "
                  />

                  {form.formState.errors
                    .dueDate && (
                    <p
                      className="
                        mt-1
                        text-[11.5px]
                        text-red-500
                      "
                    >
                      {
                        form.formState.errors
                          .dueDate.message
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Marks + Questions */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-[12px]
                      font-semibold
                      text-[hsl(215,16%,40%)]
                    "
                  >
                    Total Marks
                  </label>

                  <input
                    type="number"
                    {...form.register(
                      'totalMarks',
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E5E5E2]
                      px-3.5
                      py-2.5
                      text-[13.5px]
                      transition-all
                      focus:border-[hsl(222,47%,11%)]/40
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[hsl(222,47%,11%)]/10
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-[12px]
                      font-semibold
                      text-[hsl(215,16%,40%)]
                    "
                  >
                    Number of Questions
                  </label>

                  <input
                    type="number"
                    {...form.register(
                      'totalQuestions',
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E5E5E2]
                      px-3.5
                      py-2.5
                      text-[13.5px]
                      transition-all
                      focus:border-[hsl(222,47%,11%)]/40
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[hsl(222,47%,11%)]/10
                    "
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-semibold
                    text-[hsl(215,16%,40%)]
                  "
                >
                  Additional Instructions
                </label>

                <textarea
                  {...form.register(
                    'instructions'
                  )}
                  rows={3}
                  placeholder="e.g. Focus on neural networks…"
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#E5E5E2]
                    px-3.5
                    py-2.5
                    text-[13.5px]
                    transition-all
                    focus:border-[hsl(222,47%,11%)]/40
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[hsl(222,47%,11%)]/10
                  "
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}