'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { MobileNav } from './mobile-nav'
import { usePathname } from 'next/navigation'

interface AppShellProps {
  children: ReactNode
}

function getPageMeta(pathname: string): { title: string; subtitle: string } {
  if (pathname === '/') return { title: 'Dashboard', subtitle: 'Manage your AI assessments' }
  if (pathname === '/assignments') return { title: 'Assignments', subtitle: 'Create and manage assignments for your classes' }
  if (pathname === '/assignments/create') return { title: 'Create Assignment', subtitle: 'Configure and generate an AI-powered assessment' }
  if (pathname.startsWith('/assessments')) return { title: 'Assessment Viewer', subtitle: 'Review and manage generated assessments' }
  return { title: 'VedaAI', subtitle: '' }
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { title, subtitle } = getPageMeta(pathname)

  return (
    <div className="min-h-screen bg-[hsl(48,20%,97%)]">

      {/* Desktop */}
      <div className="hidden lg:flex lg:h-screen lg:overflow-hidden">

        {/* Sidebar — fixed width */}
        <div className="w-[220px] flex-shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Topbar pageTitle={title} pageSubtitle={subtitle} />
          <main className="flex-1 overflow-y-auto px-6 xl:px-8 py-5">
            <div className="dashboard-container fade-page">
              {children}
            </div>
          </main>
        </div>

      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Topbar pageTitle={title} />
        <main className="flex-1 px-4 py-4 pb-28">
          <div className="fade-page">{children}</div>
        </main>
        <MobileNav />
      </div>

    </div>
  )
}
