'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Plus, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Assignments', href: '/assignments', icon: FileText },
  { label: 'Create', href: '/assignments/create', icon: Plus, primary: true },
  { label: 'Toolkit', href: '/toolkit', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="absolute inset-0 border-t border-border bg-white/95 backdrop-blur-xl" />
      <div className="relative flex items-end justify-around px-2 pb-5 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          if (item.primary) {
            return (
              <Link key={item.label} href={item.href} className="-mt-8 flex flex-col items-center">
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
                  isActive ? 'bg-[hsl(222,47%,8%)] scale-105' : 'bg-[hsl(222,47%,11%)]'
                )}>
                  <Icon size={22} className="text-[hsl(45,100%,54%)]" />
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-[hsl(222,47%,11%)]">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link key={item.label} href={item.href} className="flex min-w-[58px] flex-col items-center gap-1 px-1 py-1">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                isActive ? 'bg-[hsl(45,100%,54%)]/15 text-[hsl(222,47%,11%)]' : 'text-[hsl(215,16%,55%)]'
              )}>
                <Icon size={20} />
              </div>
              <span className={cn(
                'text-[11px] font-medium',
                isActive ? 'text-[hsl(222,47%,11%)]' : 'text-[hsl(215,16%,55%)]'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom)' }} />
    </div>
  )
}
