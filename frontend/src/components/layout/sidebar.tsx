'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  FileText,
  BookOpen,
  Heart,
  Settings,
  Plus,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText, badge: true },
  { href: '/toolkit', label: "All Teachers' Toolkit", icon: BookOpen },
  { href: '/library', label: 'My Library', icon: Heart },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-full p-3">
      <div className="flex h-full w-[304px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

        {/* Top Section */}
        <div>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/illustrations/logo2.png"
              alt="VedaAI Logo"
              className="h-11 w-11 rounded-[15px] object-cover"
            />

            <span className="text-[28px] font-bold tracking-[-0.06em] text-zinc-900">
              VedaAI
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/assignments/create"
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#0B1736]
                px-5
                text-[14px]
                font-semibold
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Assignment
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex h-11 items-center gap-3 rounded-xl px-4 text-[14px] font-medium transition-all duration-150',
                    active
                      ? 'bg-[#F5F5F5] text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      active
                        ? 'text-zinc-900'
                        : 'text-zinc-400 group-hover:text-zinc-900'
                    )}
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF5A36] px-1.5 text-[10px] font-semibold text-white">
                      6
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">

          {/* Settings */}
          <div>
            {bottomItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex h-11 items-center gap-3 rounded-xl px-4 text-[14px] font-medium transition-all duration-150',
                    active
                      ? 'bg-[#F5F5F5] text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      active
                        ? 'text-zinc-900'
                        : 'text-zinc-400'
                    )}
                  />

                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* School Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1736] text-[13px] font-bold text-[#FFD84D]">
                DP
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-zinc-900">
                  Delhi Public School
                </p>

                <p className="truncate text-[12px] text-zinc-500">
                  Bokaro, Bihar City
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}