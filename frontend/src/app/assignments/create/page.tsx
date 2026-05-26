'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { createAssignment, uploadFile } from '@/lib/api';
import { useAssessmentStore } from '@/store/assessmentStore';
import { QuestionType } from '@/types';
import { cn, QUESTION_TYPE_LABELS } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  subject: z.string().optional(),
  instructions: z.string().max(2000).optional(),
  totalQuestions: z.coerce.number().int().min(1).max(100),
  totalMarks: z.coerce.number().int().min(1),
});

type FormValues = z.infer<typeof schema>;

const QUESTION_TYPES: QuestionType[] = ['mcq', 'short', 'long', 'true_false'];

type DifficultyState = {
  easy: number;
  medium: number;
  hard: number;
};

export default function CreateAssignmentPage() {
  const router = useRouter();

  const { uploadedFile, setUploadedFile, setGenerationQueued } =
    useAssessmentStore();

  const [step, setStep] = useState<number>(1);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['mcq']);
  const [difficulty, setDifficulty] = useState<DifficultyState>({
    easy: 33,
    medium: 34,
    hard: 33,
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

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
  });

  const values = form.watch();
  const diffSum = difficulty.easy + difficulty.medium + difficulty.hard;

  const toggleType = (ty: QuestionType) => {
    setSelectedTypes((prev) =>
      prev.includes(ty)
        ? prev.length > 1
          ? prev.filter((t) => t !== ty)
          : prev
        : [...prev, ty]
    );
  };

  const handleDifficulty = (key: keyof DifficultyState, value: number) => {
    setDifficulty((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploading(true);
      setFormError(null);

      try {
        const res = await uploadFile(file);
        setUploadedFile(res.file);
      } catch (err: unknown) {
        setFormError((err as Error).message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [setUploadedFile]
  );

  const goToNextStep = async () => {
    setFormError(null);

    if (step === 1) {
      const isValid = await form.trigger([
        'title',
        'dueDate',
        'totalQuestions',
        'totalMarks',
      ]);

      if (!isValid) return;
    }

    if (step === 2 && diffSum !== 100) {
      setFormError('Difficulty percentages must add up to 100.');
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const onSubmit = async (data: FormValues) => {
    setFormError(null);

    if (selectedTypes.length === 0) {
      setFormError('Select at least one question type.');
      return;
    }

    if (diffSum !== 100) {
      setFormError('Difficulty percentages must add up to 100.');
      setStep(2);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...data,
        subject: data.subject ?? '',
        instructions: data.instructions ?? '',
        questionTypes: selectedTypes,
        difficultyDistribution: difficulty,
      };

      const res = await createAssignment(payload, uploadedFile ?? undefined);

      setGenerationQueued(res.assignment.jobId);
      router.push(`/assessments/${res.assignment.id}`);
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          New Assignment
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Configure your assessment and let AI generate the questions
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[
          { n: 1, label: 'Details' },
          { n: 2, label: 'Questions' },
          { n: 3, label: 'Review' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(n)}
              className="flex items-center gap-1.5"
              aria-label={`Go to ${label}`}
            >
              <span
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                  step > n
                    ? 'bg-zinc-900 text-white'
                    : step === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-400'
                )}
              >
                {step > n ? 'ok' : n}
              </span>
              <span
                className={cn(
                  'text-xs',
                  step === n ? 'text-zinc-700 font-medium' : 'text-zinc-400'
                )}
              >
                {label}
              </span>
            </button>
            {i < arr.length - 1 && <div className="w-8 h-px bg-zinc-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {step === 1 && (
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-700">
              Assignment details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Title *
                </label>
                <input
                  {...form.register('title')}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="e.g. Machine Learning Midterm"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Subject
                </label>
                <input
                  {...form.register('subject')}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Due date *
                </label>
                <input
                  type="date"
                  {...form.register('dueDate')}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                {form.formState.errors.dueDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.dueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Total marks
                </label>
                <input
                  type="number"
                  {...form.register('totalMarks', { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                {form.formState.errors.totalMarks && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.totalMarks.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Number of questions
                </label>
                <input
                  type="number"
                  {...form.register('totalQuestions', { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                {form.formState.errors.totalQuestions && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.totalQuestions.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Additional instructions
                </label>
                <textarea
                  {...form.register('instructions')}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  placeholder="e.g. Focus on neural networks..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-zinc-700">
                Question setup
              </h2>

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-2">
                  Question types
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg border text-left transition-colors',
                        selectedTypes.includes(type)
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      )}
                    >
                      {QUESTION_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-zinc-600">
                    Difficulty distribution
                  </label>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      diffSum === 100 ? 'text-emerald-600' : 'text-red-500'
                    )}
                  >
                    Total {diffSum}%
                  </span>
                </div>
                <div className="space-y-3">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-500 capitalize">
                          {level}
                        </span>
                        <span className="text-xs font-medium text-zinc-700">
                          {difficulty[level]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={difficulty[level]}
                        onChange={(e) =>
                          handleDifficulty(level, Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-700">
                Source material
              </h2>
              <input
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
              />
              <p className="text-xs text-zinc-400">
                {uploading
                  ? 'Uploading...'
                  : uploadedFile
                  ? `Uploaded ${uploadedFile.originalName}`
                  : 'Optional: upload source content for the generated paper.'}
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-700">
              Review assignment
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ReviewItem label="Title" value={values.title || '-'} />
              <ReviewItem label="Subject" value={values.subject || 'General'} />
              <ReviewItem label="Due date" value={values.dueDate || '-'} />
              <ReviewItem
                label="Questions"
                value={`${values.totalQuestions} questions`}
              />
              <ReviewItem label="Marks" value={`${values.totalMarks} marks`} />
              <ReviewItem
                label="Types"
                value={selectedTypes
                  .map((type) => QUESTION_TYPE_LABELS[type])
                  .join(', ')}
              />
              <ReviewItem
                label="Difficulty"
                value={`Easy ${difficulty.easy}%, Medium ${difficulty.medium}%, Hard ${difficulty.hard}%`}
              />
              <ReviewItem
                label="Source"
                value={uploadedFile?.originalName || 'No file uploaded'}
              />
            </div>
          </div>
        )}

        {formError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 1))}
            disabled={step === 1 || submitting}
            className="px-3.5 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-3.5 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-3.5 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Assignment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <div className="text-xs font-medium text-zinc-400 mb-1">{label}</div>
      <div className="text-sm text-zinc-700">{value}</div>
    </div>
  );
}
