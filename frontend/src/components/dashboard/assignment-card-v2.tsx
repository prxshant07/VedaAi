'use client'

import Link from 'next/link'

import {
  MoreVertical,
} from 'lucide-react'

interface AssignmentCardV2Props {
  id?: string
  title: string
  subject?: string
  questions?: number
  duration?: string
  difficulty?: string
  status?: 'active' | 'draft' | 'completed'
  progress?: number
  createdAt?: string
  dueDate?: string
}

export function AssignmentCardV2({
  id,
  title,
  createdAt = '20-06-2025',
  dueDate = '21-06-2025',
}: AssignmentCardV2Props) {
  return (
    <div
      className="
        group
        relative
        h-[132px]
        rounded-[24px]
        bg-[#F8F8F8]
        px-[20px]
        py-[20px]
        transition-all
        duration-200
        hover:bg-white
      "
    >

      {/* Top */}
      <div className="flex items-start justify-between">

        {/* Title */}
        <h3
          className="
            max-w-[260px]
            text-[20px]
            font-[700]
            leading-[110%]
            tracking-[-0.06em]
            text-[#1F1F1F]
          "
        >
          {title}
        </h3>

        {/* Menu */}
        <button
          className="
            flex
            h-[28px]
            w-[28px]
            items-center
            justify-center
            rounded-full
            transition-colors
            hover:bg-[#EFEFEF]
          "
        >

          <MoreVertical
            size={18}
            strokeWidth={2.2}
            className="text-[#9A9A9A]"
          />
        </button>
      </div>

      {/* Bottom */}
      <div
        className="
          absolute
          bottom-[18px]
          left-[20px]
          right-[20px]
          flex
          items-center
          justify-between
        "
      >

        {/* Assigned */}
        <div className="flex items-center gap-[4px]">

          <span
            className="
              text-[14px]
              font-[700]
              tracking-[-0.03em]
              text-[#1F1F1F]
            "
          >
            Assigned on :
          </span>

          <span
            className="
              text-[14px]
              font-[500]
              tracking-[-0.03em]
              text-[#7A7A7A]
            "
          >
            {createdAt
              ? new Date(
                  createdAt
                ).toLocaleDateString(
                  'en-GB'
                )
              : '--'}
          </span>
        </div>

        {/* Due */}
        <div className="flex items-center gap-[4px]">

          <span
            className="
              text-[14px]
              font-[700]
              tracking-[-0.03em]
              text-[#1F1F1F]
            "
          >
            Due :
          </span>

          <span
            className="
              text-[14px]
              font-[500]
              tracking-[-0.03em]
              text-[#7A7A7A]
            "
          >
            {dueDate
              ? new Date(
                  dueDate
                ).toLocaleDateString(
                  'en-GB'
                )
              : '--'}
          </span>
        </div>
      </div>

      {/* Hover Menu */}
      <div
        className="
          absolute
          right-[48px]
          top-[44px]
          hidden
          w-[140px]
          rounded-[16px]
          bg-white
          p-[8px]
          shadow-[0_18px_40px_rgba(0,0,0,0.12)]
          group-hover:block
        "
      >

        {/* IMPORTANT:
            Keep internal route as /assessments
            because backend + dynamic pages still use it.
            Only UI wording changed to Assignments.
        */}
        <Link
          href={
            id
              ? `/assessments/${id}`
              : '#'
          }
          className="
            flex
            h-[38px]
            items-center
            rounded-[10px]
            px-[12px]
            text-[14px]
            font-[500]
            text-[#1F1F1F]
            transition-colors
            hover:bg-[#F5F5F5]
          "
        >
          View Assignment
        </Link>

        <button
          className="
            flex
            h-[38px]
            w-full
            items-center
            rounded-[10px]
            px-[12px]
            text-left
            text-[14px]
            font-[500]
            text-[#E5484D]
            transition-colors
            hover:bg-[#FFF1F1]
          "
        >
          Delete
        </button>
      </div>
    </div>
  )
}