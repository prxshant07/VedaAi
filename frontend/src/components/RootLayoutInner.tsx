'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  PlusSquare,
  FileText,
  Settings,
  Sparkles,
  Bell,
  Search,
  Menu,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/assignments/create',
    label: 'New Assignment',
    icon: PlusSquare,
  },
  {
    href: '/assignments',
    label: 'All Assignments',
    icon: FileText,
  },
]

export default function RootLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:grid lg:grid-cols-dashboard">
        {/* SIDEBAR */}
        <aside className="sticky top-0 h-screen p-5">
          <div className="flex h-full flex-col rounded-[32px] border border-border bg-white shadow-sidebar">
            {/* Logo */}
            <div className="px-6 pt-7 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-floating">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-textPrimary">
                    VedaAI
                  </h1>

                  <p className="text-xs text-textSecondary">
                    AI Assessment Creator
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-border" />

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <div className="mb-4 px-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary">
                  Workspace
                </p>
              </div>

              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon

                  const isActive =
                    pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200',

                        isActive
                          ? 'bg-violet-600 text-white shadow-lg'
                          : 'text-textSecondary hover:bg-violet-50 hover:text-violet-700'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl transition-all',

                          isActive
                            ? 'bg-white/15'
                            : 'group-hover:bg-white'
                        )}
                      >
                        <Icon size={20} />
                      </div>

                      <span className="font-medium">
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* CTA */}
            <div className="p-4">
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 to-violet-700 p-5 text-white">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-lg font-semibold">
                    Generate Assessment
                  </h3>

                  <p className="mt-2 text-sm text-violet-100 leading-relaxed">
                    Create AI-powered papers instantly.
                  </p>

                  <Link
                    href="/assignments/create"
                    className="mt-5 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition-all hover:scale-[1.02]"
                  >
                    Create New
                  </Link>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="border-t border-border p-4">
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-textSecondary transition-all hover:bg-muted hover:text-textPrimary">
                <Settings size={20} />

                <span className="font-medium">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="min-w-0 flex flex-col">
          {/* TOPBAR */}
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-6 xl:px-10">
              {/* Left */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-textSecondary">
                  Manage your AI assessments.
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden xl:flex">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
                  />

                  <input
                    type="text"
                    placeholder="Search..."
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

                {/* Notifications */}
                <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
                  <Bell size={18} />

                  <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold text-white">
                    A
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-textPrimary">
                      Admin
                    </p>

                    <p className="text-xs text-textSecondary">
                      Premium Plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE */}
          <main className="flex-1 overflow-y-auto px-6 py-6 xl:px-10">
            <div className="dashboard-container fade-page">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="flex min-h-screen flex-col lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white">
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Sparkles size={18} />
              </div>

              <span className="text-lg font-bold">
                VedaAI
              </span>
            </div>

            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Page */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon

              const isActive =
                pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-w-[70px] flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',

                      isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-textSecondary'
                    )}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={cn(
                      'text-[11px] font-medium',

                      isActive
                        ? 'text-violet-700'
                        : 'text-textSecondary'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}