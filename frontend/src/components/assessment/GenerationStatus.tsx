'use client'

import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock3,
  Sparkles,
} from 'lucide-react'

import { Progress } from '@/components/ui/progress'

interface GenerationStatusProps {
  status:
    | 'idle'
    | 'queued'
    | 'processing'
    | 'completed'
    | 'failed'

  progress: number

  message: string

  error?: string | null
}

const statusConfig = {
  idle: null,

  queued: {
    containerClass:
      'border-blue-200 bg-blue-50/80',

    icon: Clock3,

    iconClass: 'text-blue-600',

    progressClass:
      '[&>div]:bg-blue-500',

    title: 'Queued for Generation',

    description:
      'Your assessment has been queued.',
  },

  processing: {
    containerClass:
      'border-violet-200 bg-violet-50/80',

    icon: Loader2,

    iconClass:
      'text-violet-600 animate-spin',

    progressClass:
      '[&>div]:bg-violet-600',

    title: 'Generating Assessment',

    description:
      'AI is creating your assessment.',
  },

  completed: {
    containerClass:
      'border-emerald-200 bg-emerald-50/80',

    icon: CheckCircle2,

    iconClass: 'text-emerald-600',

    progressClass:
      '[&>div]:bg-emerald-500',

    title: 'Generation Complete',

    description:
      'Assessment generated successfully.',
  },

  failed: {
    containerClass:
      'border-red-200 bg-red-50/80',

    icon: AlertCircle,

    iconClass: 'text-red-600',

    progressClass:
      '[&>div]:bg-red-500',

    title: 'Generation Failed',

    description:
      'Something went wrong during generation.',
  },
}

export function GenerationStatus({
  status,
  progress,
  message,
  error,
}: GenerationStatusProps) {
  if (status === 'idle') return null

  const config = statusConfig[status]

  if (!config) return null

  const Icon = config.icon

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border
        p-5
        shadow-card
        backdrop-blur-sm
        transition-all
        duration-300
        ${config.containerClass}
      `}
    >
      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/30 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white/70
              shadow-sm
            "
          >
            <Icon
              size={26}
              className={config.iconClass}
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-textPrimary">
                {config.title}
              </h3>

              {status ===
                'processing' && (
                <Sparkles
                  size={16}
                  className="text-violet-500"
                />
              )}
            </div>

            <p className="mt-1 text-sm text-textSecondary">
              {status === 'failed'
                ? error ||
                  config.description
                : message ||
                  config.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        {(status === 'queued' ||
          status ===
            'processing') && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-textSecondary">
                Progress
              </span>

              <span className="text-xs font-semibold text-textPrimary">
                {progress}%
              </span>
            </div>

            <Progress
              value={progress}
              className={`
                h-3
                rounded-full
                bg-white/70
                ${config.progressClass}
              `}
            />

            <p className="mt-3 text-xs text-textSecondary">
              Please wait while the AI
              processes your request.
            </p>
          </div>
        )}

        {/* Success Footer */}
        {status ===
          'completed' && (
          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              rounded-2xl
              bg-white/60
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700
            "
          >
            <CheckCircle2 size={18} />

            Assessment is ready to review.
          </div>
        )}

        {/* Error Footer */}
        {status === 'failed' && (
          <div
            className="
              mt-5
              rounded-2xl
              bg-white/60
              px-4
              py-3
              text-sm
              text-red-700
            "
          >
            Please try again or adjust your
            generation settings.
          </div>
        )}
      </div>
    </div>
  )
}