'use client'

import { Bell, Menu, Search } from 'lucide-react'
import { useState } from 'react'

export function Topbar() {
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 md:px-6 xl:px-10">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white shadow-sm transition-all hover:scale-[1.02] lg:hidden">
            <Menu size={20} />
          </button>

          {/* Page Heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
              Dashboard
            </h1>

            <p className="mt-1 hidden text-sm text-textSecondary sm:block">
              Welcome back. Manage your AI assessments.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search assessments..."
                className="
                  h-12
                  w-[260px]
                  rounded-2xl
                  border
                  border-border
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition-all
                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-100
                "
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white shadow-sm transition-all hover:scale-[1.02]">
            <Bell
              size={18}
              className="text-textPrimary"
            />

            {/* Notification Dot */}
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <button className="group flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm transition-all hover:scale-[1.01]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-sm font-semibold text-white">
              A
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-sm font-semibold text-textPrimary">
                Admin
              </p>

              <p className="text-xs text-textSecondary">
                Premium Plan
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}