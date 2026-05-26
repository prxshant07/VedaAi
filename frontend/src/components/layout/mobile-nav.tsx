'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
} from 'lucide-react'

const navItems = [
  {
    label: 'Home',
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
    primary: true,
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

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background */}
      <div className="absolute inset-0 border-t border-border bg-white/90 backdrop-blur-xl" />

      {/* Navigation */}
      <div className="relative flex items-end justify-around px-2 pb-5 pt-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          // Floating Generate Button
          if (item.primary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="-mt-10 flex flex-col items-center"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full shadow-floating transition-all duration-300 ${
                    isActive
                      ? 'bg-violet-700 scale-105'
                      : 'bg-violet-600'
                  }`}
                >
                  <Icon
                    size={26}
                    className="text-white"
                  />
                </div>

                <span className="mt-2 text-[11px] font-medium text-violet-700">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-all"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-textSecondary'
                }`}
              >
                <Icon size={22} />
              </div>

              <span
                className={`text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-violet-700'
                    : 'text-textSecondary'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe Area */}
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </div>
  )
}