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
    <aside className="h-full">
      <div className="flex h-full flex-col bg-white border-r border-border">

        {/* Logo Section */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border w-[251px] h-[72px]">

          {/* Logo Icon */}
          <div className="flex items-center gap-2">

            <img
            src="\illustrations\logo2.png"
            alt="VedaAI Logo"
            className="[w-40] [h-40] [rounded-15px] object-contain"
            />

            <span className="text-[28px] font-bold tracking-[-0.06em] text-zinc-900">
            VedaAI
            </span>
          </div>
        </div>

        {/* Create Assignment CTA */}
        <div className="px-4 py-3">
          <Link
            href="/assignments/create"
            className="flex items-center gap-2 w-full rounded-xl bg-[hsl(222,47%,11%)] text-white px-4 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={15} strokeWidth={2.5} />
            Create Assignment
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 border-l-[2.5px]',
                  active
                    ? 'bg-[hsl(45,100%,54%)]/12 text-[hsl(222,47%,11%)] border-[hsl(45,100%,54%)]'
                    : 'text-[hsl(215,16%,47%)] hover:bg-[hsl(48,20%,96%)] hover:text-[hsl(222,47%,11%)] border-transparent'
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    active ? 'text-[hsl(222,47%,11%)]' : 'text-[hsl(215,16%,55%)] group-hover:text-[hsl(222,47%,11%)]'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-semibold bg-[hsl(14,100%,50%)] text-white px-1.5 py-0.5 rounded-full leading-tight">
                    6
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 py-2 space-y-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 border-l-[2.5px]',
                  active
                    ? 'bg-[hsl(45,100%,54%)]/12 text-[hsl(222,47%,11%)] border-[hsl(45,100%,54%)]'
                    : 'text-[hsl(215,16%,47%)] hover:bg-[hsl(48,20%,96%)] hover:text-[hsl(222,47%,11%)] border-transparent'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* School card */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 rounded-xl bg-[hsl(48,20%,96%)] border border-border px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(222,47%,11%)] text-[hsl(45,100%,54%)] text-[11px] font-bold flex-shrink-0">
              DP
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-[hsl(222,47%,11%)] truncate">Delhi Public School</p>
              <p className="text-[11px] text-[hsl(215,16%,55%)] truncate">Bokaro, Bihar City</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}
