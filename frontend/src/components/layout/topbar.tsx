'use client'

import {
  Bell,
  Settings,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react'

interface TopbarProps {
  pageTitle?: string
  pageSubtitle?: string
}

export function Topbar({
  pageTitle,
}: TopbarProps) {
  return (
    <header className="w-full">

      <div
        className="
          mx-auto
          flex
          h-[56px]
          max-w-[1100px]
          items-center
          justify-between
          rounded-[16px]
          border
          border-[#ECECEC]
          bg-[#F8F8F8]
          px-[24px]
          pr-[12px]
        "
      >

        {/* Left */}
        <div className="flex items-center gap-[8px] min-w-0">

          {/* Back */}
          <button
            className="
              flex
              h-[24px]
              w-[24px]
              items-center
              justify-center
              rounded-full
              transition-colors
              hover:bg-[#ECECEC]
            "
          >
            <ArrowLeft
              size={14}
              className="text-[#5F5F5F]"
            />
          </button>

          {/* Page Icon */}
          <LayoutGrid
            size={13}
            className="text-[#A0A0A0]"
          />

          {/* Title */}
          {pageTitle && (
            <h1
              className="
                truncate
                text-[13px]
                font-[500]
                leading-none
                text-[#8A8A8A]
              "
            >
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-[10px]">

          {/* Notifications */}
          <button
            className="
              relative
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#E7E7E7]
              bg-white
            "
          >

            <Bell
              size={16}
              className="text-[#5F5F5F]"
            />

            <span
              className="
                absolute
                right-[10px]
                top-[10px]
                h-[7px]
                w-[7px]
                rounded-full
                bg-[#FF5A36]
              "
            />
          </button>

          {/* Settings */}
          <button
            className="
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#E7E7E7]
              bg-white
            "
          >

            <Settings
              size={16}
              className="text-[#5F5F5F]"
            />
          </button>

          {/* Profile */}
          <button
            className="
              flex
              h-[40px]
              items-center
              gap-2
              rounded-[14px]
              border
              border-[#E7E7E7]
              bg-white
              px-[12px]
            "
          >

            {/* Avatar */}
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-[#0B1736]
                text-[11px]
                font-bold
                text-[#FFD84D]
              "
            >
              JD
            </div>

            {/* Name */}
            <span
              className="
                text-[13px]
                font-[500]
                text-[#1F1F1F]
              "
            >
              John Doe
            </span>

            <ChevronDown
              size={14}
              className="text-[#8A8A8A]"
            />
          </button>

        </div>
      </div>
    </header>
  )
}