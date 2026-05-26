'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { MobileNav } from './mobile-nav'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-dashboard">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen p-5">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex flex-col">
          <Topbar />

          <main className="flex-1 px-6 xl:px-10 py-6">
            <div className="dashboard-container fade-page">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Tablet + Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Topbar />

        <main className="flex-1 px-4 md:px-6 py-5 pb-28">
          <div className="dashboard-container fade-page">
            {children}
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  )
}