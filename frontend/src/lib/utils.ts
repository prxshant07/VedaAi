import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq: 'Multiple Choice', short: 'Short Answer', long: 'Long Answer', true_false: 'True / False',
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-[#EBF7F0] text-[#1A7A47] border-[#B7E4CC]',
  medium: 'bg-[#FEF9E7] text-[#A07800] border-[#F5D97A]',
  hard:   'bg-[#FEF0ED] text-[#B83F20] border-[#F5B4A4]',
}

export const STATUS_COLORS: Record<string, string> = {
  draft:      'bg-[#FEF9E7] text-[#A07800]',
  queued:     'bg-[#EFF6FF] text-[#1E5FAD]',
  processing: 'bg-[#F3F0FF] text-[#5B2DA6]',
  completed:  'bg-[#EBF7F0] text-[#1A7A47]',
  failed:     'bg-[#FEF0ED] text-[#B83F20]',
}
