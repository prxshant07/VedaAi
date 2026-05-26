'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
  Plus,
  ChevronRight,
} from 'lucide-react'

import clsx from 'clsx'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: FileText,
  },
  {
    label: 'Generate',
    href: '/generate',
    icon: Sparkles,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-full">
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
                Assessment Creator
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-border" />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon

              const isActive =
                pathname === item.href

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    'group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200',

                    isActive
                      ? 'bg-violet-600 text-white shadow-lg'
                      : 'text-textSecondary hover:bg-violet-50 hover:text-violet-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'flex h-10 w-10 items-center justify-center rounded-xl transition-all',

                        isActive
                          ? 'bg-white/15'
                          : 'bg-transparent group-hover:bg-white'
                      )}
                    >
                      <Icon size={20} />
                    </div>

                    <span className="font-medium">
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <ChevronRight
                      size={18}
                      className="opacity-80"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* CTA Card */}
        <div className="p-4">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 to-violet-700 p-5 text-white relative">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Plus size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-snug">
                Create New Assessment
              </h3>

              <p className="mt-2 text-sm text-violet-100 leading-relaxed">
                Generate AI-powered question papers instantly.
              </p>

              <Link
                href="/generate"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition-all hover:scale-[1.02]"
              >
                Start Generating
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-textPrimary">
                Admin User
              </p>

              <p className="truncate text-xs text-textSecondary">
                admin@vedaai.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}