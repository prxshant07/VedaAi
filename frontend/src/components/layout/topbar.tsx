'use client'

import { Bell, Search, Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface TopbarProps {
  pageTitle?: string
  pageSubtitle?: string
}

export function Topbar({ pageTitle, pageSubtitle }: TopbarProps) {
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/90 backdrop-blur-xl px-6">

      {/* Left */}
      <div>
        {pageTitle && (
          <h1 className="text-[15px] font-semibold text-[hsl(222,47%,11%)] tracking-tight">
            {pageTitle}
          </h1>
        )}
        {pageSubtitle && (
          <p className="text-[12px] text-[hsl(215,16%,47%)]">{pageSubtitle}</p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative hidden md:flex">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215,16%,55%)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments…"
            className="h-8 w-52 rounded-lg border border-border bg-[hsl(48,20%,97%)] pl-8 pr-3 text-[13px] outline-none transition-all focus:border-[hsl(222,47%,11%)]/30 focus:bg-white focus:ring-2 focus:ring-[hsl(222,47%,11%)]/8"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-[hsl(48,20%,96%)]">
          <Bell size={15} className="text-[hsl(222,47%,11%)]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(14,100%,50%)] ring-1 ring-white" />
        </button>

        {/* Settings */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-[hsl(48,20%,96%)]">
          <Settings size={15} className="text-[hsl(215,16%,47%)]" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 transition-colors hover:bg-[hsl(48,20%,96%)]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-[10px] font-bold text-white">
            JD
          </div>
          <span className="hidden text-[13px] font-medium text-[hsl(222,47%,11%)] lg:block">John Doe</span>
          <ChevronDown size={13} className="text-[hsl(215,16%,55%)]" />
        </button>

      </div>
    </header>
  )
}
