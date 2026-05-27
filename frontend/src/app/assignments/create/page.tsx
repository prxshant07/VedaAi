'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Upload, Check, ChevronRight } from 'lucide-react'
import { createAssignment, uploadFile } from '@/lib/api'
import { useAssessmentStore } from '@/store/assessmentStore'
import { QuestionType } from '@/types'
import { cn, QUESTION_TYPE_LABELS } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  subject: z.string().optional(),
  instructions: z.string().max(2000).optional(),
  totalQuestions: z.coerce.number().int().min(1).max(100),
  totalMarks: z.coerce.number().int().min(1),
})

type FormValues = z.infer<typeof schema>

const QUESTION_TYPES: QuestionType[] = ['mcq', 'short', 'long', 'true_false']
type DifficultyState = { easy: number; medium: number; hard: number }

export default function CreateAssignmentPage() {
  const router = useRouter()
  const { uploadedFile, setUploadedFile, setGenerationQueued } = useAssessmentStore()
  const [step, setStep] = useState<number>(1)
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['mcq'])
  const [difficulty, setDifficulty] = useState<DifficultyState>({ easy: 33, medium: 34, hard: 33 })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', dueDate: '', subject: '', instructions: '', totalQuestions: 10, totalMarks: 50 },
  })

  const values = form.watch()
  const diffSum = difficulty.easy + difficulty.medium + difficulty.hard

  const toggleType = (ty: QuestionType) => {
    setSelectedTypes((prev) => prev.includes(ty) ? (prev.length > 1 ? prev.filter((t) => t !== ty) : prev) : [...prev, ty])
  }

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFormError(null)
    try {
      const res = await uploadFile(file)
      setUploadedFile(res.file)
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [setUploadedFile])

  const goToNextStep = async () => {
    setFormError(null)
    if (step === 1) {
      const isValid = await form.trigger(['title', 'dueDate', 'totalQuestions', 'totalMarks'])
      if (!isValid) return
    }
    if (step === 2 && diffSum !== 100) { setFormError('Difficulty percentages must add up to 100.'); return }
    setStep((c) => Math.min(c + 1, 3))
  }

  const onSubmit = async (data: FormValues) => {
    setFormError(null)
    if (selectedTypes.length === 0) { setFormError('Select at least one question type.'); return }
    if (diffSum !== 100) { setFormError('Difficulty percentages must add up to 100.'); setStep(2); return }
    setSubmitting(true)
    try {
      const res = await createAssignment({ ...data, subject: data.subject ?? '', instructions: data.instructions ?? '', questionTypes: selectedTypes, difficultyDistribution: difficulty }, uploadedFile ?? undefined)
      setGenerationQueued(res.assignment.jobId)
      router.push(`/assessments/${res.assignment.id}`)
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to create assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const STEPS = [{ n: 1, label: 'Assignment Details' }, { n: 2, label: 'Upload Material' }, { n: 3, label: 'Question Setup' }]

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Step bar */}
      <div className="flex items-center gap-0 bg-[hsl(48,20%,97%)] border border-[#E5E5E2] rounded-[14px] p-3">
        {STEPS.map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center flex-1">
            <button type="button" onClick={() => setStep(n)} className="flex items-center gap-2.5 min-w-0">
              <span className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0 transition-all',
                step > n ? 'bg-[hsl(160,84%,39%)] text-white' : step === n ? 'bg-[hsl(222,47%,11%)] text-white' : 'bg-[#E5E5E2] text-[hsl(215,16%,47%)]'
              )}>
                {step > n ? <Check size={11} strokeWidth={3} /> : n}
              </span>
              <span className={cn('text-[12.5px] truncate', step === n ? 'font-semibold text-[hsl(222,47%,11%)]' : 'text-[hsl(215,16%,47%)]')}>
                {label}
              </span>
            </button>
            {i < arr.length - 1 && <ChevronRight size={14} className="text-[#D0D0CB] mx-2 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* ── STEP 1: Assignment Details ── */}
        {step === 1 && (
          <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Basic Info</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Assignment Title *</label>
                <input {...form.register('title')} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all" placeholder="e.g. Quiz on Electricity" />
                {form.formState.errors.title && <p className="text-[11.5px] text-red-500 mt-1">{form.formState.errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Subject</label>
                  <select className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all bg-white" {...form.register('subject')}>
                    <option value="">Select subject</option>
                    <option>English</option><option>Mathematics</option><option>Science</option><option>History</option><option>Geography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Due Date *</label>
                  <input type="date" {...form.register('dueDate')} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all" />
                  {form.formState.errors.dueDate && <p className="text-[11.5px] text-red-500 mt-1">{form.formState.errors.dueDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Total Marks</label>
                  <input type="number" {...form.register('totalMarks', { valueAsNumber: true })} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Number of Questions</label>
                  <input type="number" {...form.register('totalQuestions', { valueAsNumber: true })} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[hsl(215,16%,40%)] mb-1.5">Additional Instructions</label>
                <textarea {...form.register('instructions')} rows={3} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all resize-none" placeholder="e.g. Focus on neural networks…" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Upload Material ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Upload Source Material</p>
              </div>
              <div className="p-5">
                <p className="text-[13px] text-[hsl(215,16%,47%)] mb-4">Upload files to provide content for AI to generate questions from.</p>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#D0D0CB] rounded-xl p-8 cursor-pointer transition-all hover:border-[hsl(222,47%,11%)]/40 hover:bg-[hsl(48,20%,98%)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(48,20%,96%)] border border-[#E5E5E2] mb-3">
                    <Upload size={18} className="text-[hsl(215,16%,55%)]" />
                  </div>
                  <span className="text-[13.5px] font-medium text-[hsl(222,47%,11%)] mb-1">Drop files here or click to upload</span>
                  <span className="text-[12px] text-[hsl(215,16%,55%)]">Supports PDF, DOCX, TXT — up to 25 MB</span>
                  <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
                {uploadedFile && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[hsl(48,20%,97%)] border border-[#E5E5E2] px-3.5 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(160,84%,39%)] text-white flex-shrink-0"><Check size={13} strokeWidth={3} /></div>
                    <span className="text-[13px] font-medium text-[hsl(222,47%,11%)] flex-1 truncate">{uploadedFile.originalName}</span>
                  </div>
                )}
                {uploading && <p className="mt-2 text-[12.5px] text-[hsl(215,16%,47%)]">Uploading…</p>}
              </div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Or Describe the Topic</p>
              </div>
              <div className="p-5">
                <textarea {...form.register('instructions')} rows={4} className="w-full px-3.5 py-2.5 text-[13.5px] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(222,47%,11%)]/10 focus:border-[hsl(222,47%,11%)]/40 transition-all resize-none" placeholder="e.g. Chapter 12 — Electricity. Covers concepts of electric current, voltage, resistance, Ohm's Law…" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Question Setup ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Question Types</p>
              </div>
              <div className="p-5 space-y-2.5">
                {QUESTION_TYPES.map((type) => (
                  <button key={type} type="button" onClick={() => toggleType(type)}
                    className={cn('w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all',
                      selectedTypes.includes(type) ? 'border-[hsl(222,47%,11%)]/30 bg-[hsl(222,47%,11%)]/5 text-[hsl(222,47%,11%)]' : 'border-[#E5E5E2] bg-white text-[hsl(215,16%,40%)] hover:bg-[hsl(48,20%,97%)]'
                    )}>
                    <span className="text-[13.5px] font-medium">{QUESTION_TYPE_LABELS[type]}</span>
                    {selectedTypes.includes(type) && <Check size={15} strokeWidth={2.5} className="text-[hsl(222,47%,11%)]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)] flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Difficulty Distribution</p>
                <span className={cn('text-[12px] font-bold', diffSum === 100 ? 'text-[hsl(160,84%,39%)]' : 'text-red-500')}>Total {diffSum}%</span>
              </div>
              <div className="p-5 space-y-4">
                {(['easy','medium','hard'] as const).map((level) => (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium capitalize text-[hsl(215,16%,40%)]">{level}</span>
                      <span className="text-[13px] font-bold text-[hsl(222,47%,11%)]">{difficulty[level]}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={difficulty[level]}
                      onChange={(e) => setDifficulty((prev) => ({ ...prev, [level]: Number(e.target.value) }))}
                      className="w-full accent-[hsl(222,47%,11%)]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Review summary */}
            <div className="bg-white rounded-[14px] border border-[#E5E5E2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0EFE8] bg-[hsl(48,20%,98%)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[hsl(215,16%,55%)]">Review</p>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {[
                  { label: 'Title', value: values.title || '—' },
                  { label: 'Subject', value: values.subject || 'General' },
                  { label: 'Due Date', value: values.dueDate || '—' },
                  { label: 'Questions', value: `${values.totalQuestions} questions` },
                  { label: 'Marks', value: `${values.totalMarks} marks` },
                  { label: 'Types', value: selectedTypes.map((t) => QUESTION_TYPE_LABELS[t]).join(', ') },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-[hsl(48,20%,97%)] border border-[#E5E5E2] p-3">
                    <div className="text-[11px] font-semibold text-[hsl(215,16%,55%)] mb-1">{label}</div>
                    <div className="text-[13px] font-medium text-[hsl(222,47%,11%)]">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">{formError}</div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={() => setStep((c) => Math.max(c - 1, 1))} disabled={step === 1 || submitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[hsl(215,16%,40%)] border border-[#E5E5E2] rounded-xl hover:bg-[hsl(48,20%,96%)] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Back
          </button>

          {step < 3 ? (
            <button type="button" onClick={goToNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[hsl(222,47%,11%)] rounded-xl hover:opacity-90 transition-opacity">
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button type="submit" disabled={submitting || uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-[hsl(222,47%,11%)] bg-[hsl(45,100%,54%)] rounded-xl hover:bg-[hsl(40,96%,44%)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {submitting ? 'Creating…' : '✦ Generate Paper'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
