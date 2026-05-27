'use client'

import { CheckCircle2, Loader2, AlertCircle, Clock3 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface GenerationStatusProps {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  error?: string | null
}

const statusConfig = {
  idle: null,
  queued: {
    containerClass: 'border-blue-200 bg-blue-50/80',
    icon: Clock3,
    iconClass: 'text-blue-600',
    progressClass: '[&>div]:bg-blue-500',
    title: 'Queued for Generation',
    description: 'Your assessment has been queued.',
  },
  processing: {
    containerClass: 'border-[hsl(222,47%,11%)]/20 bg-[hsl(45,100%,54%)]/8',
    icon: Loader2,
    iconClass: 'text-[hsl(222,47%,11%)] animate-spin',
    progressClass: '[&>div]:bg-[hsl(222,47%,11%)]',
    title: 'Generating Assessment',
    description: 'AI is creating your assessment.',
  },
  completed: {
    containerClass: 'border-emerald-200 bg-emerald-50/80',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
    progressClass: '[&>div]:bg-emerald-500',
    title: 'Generation Complete',
    description: 'Assessment generated successfully.',
  },
  failed: {
    containerClass: 'border-red-200 bg-red-50/80',
    icon: AlertCircle,
    iconClass: 'text-red-600',
    progressClass: '[&>div]:bg-red-500',
    title: 'Generation Failed',
    description: 'Something went wrong during generation.',
  },
}

export function GenerationStatus({ status, progress, message, error }: GenerationStatusProps) {
  if (status === 'idle') return null
  const config = statusConfig[status]
  if (!config) return null
  const Icon = config.icon

  return (
    <div className={`relative overflow-hidden rounded-[14px] border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ${config.containerClass}`}>
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 shadow-sm flex-shrink-0">
            <Icon size={24} className={config.iconClass} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-[hsl(222,47%,11%)]">{config.title}</h3>
            <p className="mt-0.5 text-[13px] text-[hsl(215,16%,47%)]">
              {status === 'failed' ? error || config.description : message || config.description}
            </p>
          </div>
        </div>

        {(status === 'queued' || status === 'processing') && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-medium text-[hsl(215,16%,47%)]">Progress</span>
              <span className="text-[12px] font-semibold text-[hsl(222,47%,11%)]">{progress}%</span>
            </div>
            <Progress value={progress} className={`h-2 rounded-full bg-white/70 ${config.progressClass}`} />
            <p className="mt-2 text-[11.5px] text-[hsl(215,16%,55%)]">Please wait while the AI processes your request.</p>
          </div>
        )}

        {status === 'completed' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2.5 text-[13px] font-medium text-emerald-700">
            <CheckCircle2 size={16} />
            Assessment is ready to review.
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-4 rounded-xl bg-white/60 px-4 py-2.5 text-[13px] text-red-700">
            Please try again or adjust your generation settings.
          </div>
        )}
      </div>
    </div>
  )
}
