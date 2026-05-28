'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { MobileNav } from './mobile-nav'

interface AppShellProps {
  children: ReactNode
}

function getPageMeta(
  pathname: string
): {
  title: string
  subtitle: string
} {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      subtitle: 'Manage your AI assessments',
    }
  }

  if (pathname === '/assignments') {
    return {
      title: 'Assignments',
      subtitle:
        'Create and manage assignments for your classes',
    }
  }

  if (pathname === '/assignments/create') {
    return {
      title: 'Create Assignment',
      subtitle:
        'Configure and generate an AI-powered assessment',
    }
  }

  if (pathname.startsWith('/assessments')) {
    return {
      title: 'Assessment Viewer',
      subtitle:
        'Review and manage generated assessments',
    }
  }

  if (pathname === '/groups') {
    return {
      title: 'Groups',
      subtitle:
        'Manage classrooms and student groups',
    }
  }

  if (pathname === '/library') {
    return {
      title: 'Library',
      subtitle:
        'Access saved materials and resources',
    }
  }

  if (pathname === '/toolkit') {
    return {
      title: 'Toolkit',
      subtitle:
        'Explore AI tools for educators',
    }
  }

  if (pathname === '/settings') {
    return {
      title: 'Settings',
      subtitle:
        'Manage your account preferences',
    }
  }

  return {
    title: 'VedaAI',
    subtitle: '',
  }
}

export function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname()

  const { title, subtitle } =
    getPageMeta(pathname)

  return (
    <div 
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)',
      }}
    >

      {/* Desktop */}
      <div className="hidden h-screen overflow-hidden lg:flex">

        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 flex-col overflow-hidden p-3 pl-0">

          {/* Workspace Shell */}
          <div className="flex h-full flex-col gap-3">

            {/* Topbar */}
            <Topbar
              pageTitle={title}
              pageSubtitle={subtitle}
            />

            {/* Main Content Surface */}
            <main
              className="
                flex-1
                overflow-y-auto
              "
            >
              <div className="mx-auto h-full max-w-[1100px]">
                <div className="fade-page h-full">
                  {children}
                </div>
              </div>
            </main>

          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex min-h-screen flex-col lg:hidden">

        {/* Mobile Topbar */}
        <div className="border-b border-zinc-200 bg-white px-4 py-3">
          <Topbar pageTitle={title} />
        </div>

        {/* Mobile Content */}
        <main className="flex-1 px-4 py-5 pb-28">
          <div className="fade-page">
            {children}
          </div>
        </main>

        {/* Bottom Nav */}
        <MobileNav />
      </div>
    </div>
  )
}