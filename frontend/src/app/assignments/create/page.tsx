'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

import {
  UploadCloud,
  Plus,
  ArrowLeft,
  ArrowRight,
  X,
} from 'lucide-react'

import {
  createAssignment,
  uploadFile,
} from '@/lib/api'

import { useAssessmentStore } from '@/store/assessmentStore'

import { QuestionType } from '@/types'

const schema = z.object({
  dueDate: z.string().min(1),

  subject: z.string().optional(),

  instructions: z
    .string()
    .max(2000)
    .optional(),
})

type FormValues = z.infer<typeof schema>

type QuestionRow = {
  id: number
  label: string
  questions: number
  marks: number
}

export default function CreateAssignmentPage() {
  const router = useRouter()

  const {
    uploadedFile,
    setUploadedFile,
    setGenerationQueued,
  } = useAssessmentStore()

  const [uploading, setUploading] =
    useState(false)

  const [submitting, setSubmitting] =
    useState(false)

  const [rows, setRows] = useState<
    QuestionRow[]
  >([
    {
      id: 1,
      label:
        'Multiple Choice Questions',
      questions: 4,
      marks: 1,
    },

    {
      id: 2,
      label: 'Short Questions',
      questions: 3,
      marks: 2,
    },

    {
      id: 3,
      label:
        'Diagram/Graph-Based Questions',
      questions: 5,
      marks: 5,
    },

    {
      id: 4,
      label: 'Numerical Problems',
      questions: 5,
      marks: 5,
    },
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      dueDate: '',
      subject: '',
      instructions: '',
    },
  })

  const handleFileUpload =
    useCallback(
      async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file =
          e.target.files?.[0]

        if (!file) return

        setUploading(true)

        try {
          const res =
            await uploadFile(file)

          setUploadedFile(res.file)
        } finally {
          setUploading(false)
        }
      },
      [setUploadedFile]
    )

  const totalQuestions = rows.reduce(
    (acc, row) =>
      acc + row.questions,
    0
  )

  const totalMarks = rows.reduce(
    (acc, row) =>
      acc +
      row.questions * row.marks,
    0
  )

  const onSubmit = async (
    data: FormValues
  ) => {
    setSubmitting(true)

    try {
      const res =
        await createAssignment(
          {
            title:
              data.subject ||
              'Untitled Assignment',

            dueDate: data.dueDate,

            subject:
              data.subject ?? '',

            instructions:
              data.instructions ?? '',

            totalQuestions,

            totalMarks,

            questionTypes: [
              'mcq',
            ] as QuestionType[],

            difficultyDistribution: {
              easy: 33,
              medium: 34,
              hard: 33,
            },
          },

          uploadedFile ?? undefined
        )

      setGenerationQueued(
        res.assignment.jobId
      )

      router.push(
        `/assessments/${res.assignment.id}`
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1100px]">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center gap-2">

          <div className="h-2 w-2 rounded-full bg-[#53C26B]" />

          <div>
            <h1
              className="
                text-[20px]
                font-[700]
                tracking-[-0.04em]
                text-[#1F1F1F]
              "
            >
              Create Assignment
            </h1>

            <p
              className="
                mt-1
                text-[12px]
                text-[#8A8A8A]
              "
            >
              Set up a new assignment for
              your students
            </p>
          </div>
        </div>

        {/* Progress */}
        <div
          className="
            mt-6
            h-[4px]
            w-full
            rounded-full
            bg-[#D9D9D9]
          "
        >
          <div
            className="
              h-full
              w-[50%]
              rounded-full
              bg-[#555555]
            "
          />
        </div>
      </div>

      {/* Card */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >

        <div
          className="
            mx-auto
            flex
            w-[810px]
            flex-col
            gap-[32px]
            rounded-[32px]
            bg-[#F5F5F5]
            p-[32px]
          "
        >

          {/* Section */}
          <div>

            <h2
              className="
                text-[16px]
                font-[700]
                text-[#1F1F1F]
              "
            >
              Assignment Details
            </h2>

            <p
              className="
                text-[11px]
                text-[#9A9A9A]
              "
            >
              Basic information about your
              assignment
            </p>
          </div>

          {/* Upload */}
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-[20px]
              border
              border-dashed
              border-[#D5D5D5]
              bg-[#FAFAFA]
              px-6
              py-10
              text-center
            "
          >

            <UploadCloud
              size={26}
              className="text-[#3A3A3A]"
            />

            <p
              className="
                text-[13px]
                font-medium
                text-[#2A2A2A]
              "
            >
              Choose a file or drag &
              drop it here
            </p>

            <p
              className="
                text-[11px]
                text-[#A0A0A0]
              "
            >
              JPEG, PNG, upto 10MB
            </p>

            <label
              className="
                inline-flex
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-[#EAEAEA]
                px-5
                py-2
                text-[12px]
                font-medium
                text-[#3A3A3A]
              "
            >
              Browse Files

              <input
                type="file"
                className="hidden"
                onChange={
                  handleFileUpload
                }
              />
            </label>

            {uploading && (
              <p className="text-[12px] text-[#7A7A7A]">
                Uploading...
              </p>
            )}
          </div>

          <p
            className="
              text-center
              text-[11px]
              text-[#9A9A9A]
            "
          >
            Upload images of your preferred
            document/image
          </p>

          {/* Due Date */}
          <div>

            <label
              className="
                mb-2
                block
                text-[12px]
                font-semibold
                text-[#2A2A2A]
              "
            >
              Due Date
            </label>

            <input
              type="date"
              {...form.register('dueDate')}
              className="
                h-[42px]
                w-full
                rounded-full
                border
                border-[#E2E2E2]
                bg-white
                px-4
                text-[13px]
                outline-none
              "
            />
          </div>

          {/* Question Rows */}
          <div>

            <div
              className="
                mb-2
                grid
                grid-cols-[1fr_120px_80px]
                gap-3
                px-1
              "
            >

              <p
                className="
                  text-[12px]
                  font-semibold
                  text-[#2A2A2A]
                "
              >
                Question Type
              </p>

              <p
                className="
                  text-center
                  text-[12px]
                  font-semibold
                  text-[#2A2A2A]
                "
              >
                No. of Questions
              </p>

              <p
                className="
                  text-center
                  text-[12px]
                  font-semibold
                  text-[#2A2A2A]
                "
              >
                Marks
              </p>
            </div>

            <div className="space-y-2">

              {rows.map((row) => (
                <div
                  key={row.id}
                  className="
                    grid
                    grid-cols-[1fr_120px_80px]
                    gap-3
                  "
                >

                  {/* Select */}
                  <div
                    className="
                      flex
                      h-[38px]
                      items-center
                      justify-between
                      rounded-full
                      bg-white
                      px-4
                    "
                  >

                    <span className="text-[12px] text-[#2A2A2A]">
                      {row.label}
                    </span>

                    <X
                      size={13}
                      className="text-[#A0A0A0]"
                    />
                  </div>

                  {/* Questions */}
                  <div
                    className="
                      flex
                      h-[38px]
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[12px]
                    "
                  >
                    -
                    <span className="mx-3">
                      {row.questions}
                    </span>
                    +
                  </div>

                  {/* Marks */}
                  <div
                    className="
                      flex
                      h-[38px]
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[12px]
                    "
                  >
                    -
                    <span className="mx-3">
                      {row.marks}
                    </span>
                    +
                  </div>
                </div>
              ))}
            </div>

            {/* Add */}
            <button
              type="button"
              className="
                mt-4
                flex
                items-center
                gap-2
                text-[12px]
                text-[#2A2A2A]
              "
            >

              <div
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2F2F2F]
                  text-white
                "
              >
                <Plus size={12} />
              </div>

              Add Question Type
            </button>
          </div>

          {/* Totals */}
          <div
            className="
              text-right
              text-[12px]
              leading-6
              text-[#3A3A3A]
            "
          >
            <p>
              Total Questions:{' '}
              {totalQuestions}
            </p>

            <p>
              Total Marks:{' '}
              {totalMarks}
            </p>
          </div>

          {/* Additional Info */}
          <div>

            <label
              className="
                mb-2
                block
                text-[12px]
                font-semibold
                text-[#2A2A2A]
              "
            >
              Additional Information (For
              better output)
            </label>

            <textarea
              {...form.register(
                'instructions'
              )}
              rows={4}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="
                w-full
                rounded-[18px]
                border
                border-[#E2E2E2]
                bg-white
                px-4
                py-3
                text-[13px]
                outline-none
                placeholder:text-[#B0B0B0]
              "
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          className="
            mx-auto
            mt-5
            flex
            w-[810px]
            items-center
            justify-between
          "
        >

          <button
            type="button"
            className="
              inline-flex
              h-[40px]
              items-center
              gap-2
              rounded-full
              border
              border-[#D9D9D9]
              bg-white
              px-5
              text-[13px]
              text-[#2A2A2A]
            "
          >

            <ArrowLeft size={14} />

            Previous
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="
              inline-flex
              h-[40px]
              items-center
              gap-2
              rounded-full
              bg-[#0B1736]
              px-5
              text-[13px]
              font-medium
              text-white
            "
          >
            {submitting
              ? 'Creating...'
              : 'Next'}

            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}