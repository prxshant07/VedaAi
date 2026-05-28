'use client'

import {
  Bell,
  Search,
  Settings,
  ChevronDown,
} from 'lucide-react'

import { useState } from 'react'

interface TopbarProps {
  pageTitle?: string
  pageSubtitle?: string
}

export function Topbar({
  pageTitle,
  pageSubtitle,
}: TopbarProps) {
  const [search, setSearch] = useState('')

  return (
    <header className="w-full">

      <div
        className="
          mx-auto
          flex
          h-14
          max-w-[1100px]
          items-center
          justify-between
          rounded-2xl
          border
          border-zinc-200
          bg-white
          pl-6
          pr-3
          shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        "
      >

        {/* Left */}
        <div className="min-w-0">
          {pageTitle && (
            <h1
              className="
                truncate
                text-[15px]
                font-semibold
                tracking-[-0.02em]
                text-zinc-900
              "
            >
              {pageTitle}
            </h1>
          )}

          {pageSubtitle && (
            <p
              className="
                mt-0.5
                truncate
                text-[12px]
                text-zinc-500
              "
            >
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative hidden md:flex">

            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-zinc-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search assignments..."
              className="
                h-10
                w-60
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                pl-9
                pr-4
                text-[13px]
                text-zinc-700
                outline-none
                transition-all
                placeholder:text-zinc-400
                focus:border-zinc-300
                focus:bg-white
                focus:ring-4
                focus:ring-zinc-100
              "
            />
          </div>

          {/* Notifications */}
          <button
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-200
              bg-white
              text-zinc-500
              transition-all
              hover:bg-zinc-100
              hover:text-zinc-900
            "
          >
            <Bell size={17} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-[#FF5A36]
                ring-2
                ring-white
              "
            />
          </button>

          {/* Settings */}
          <button
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-200
              bg-white
              text-zinc-500
              transition-all
              hover:bg-zinc-100
              hover:text-zinc-900
            "
          >
            <Settings size={17} />
          </button>

          {/* Profile */}
          <button
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-3
              transition-all
              hover:bg-zinc-100
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
                font-semibold
                text-[#FFD84D]
              "
            >
              JD
            </div>

            {/* Name */}
            <span
              className="
                hidden
                text-[13px]
                font-medium
                text-zinc-900
                lg:block
              "
            >
              John Doe
            </span>

            <ChevronDown
              size={14}
              className="text-zinc-400"
            />
          </button>

        </div>
      </div>
    </header>
  )
}