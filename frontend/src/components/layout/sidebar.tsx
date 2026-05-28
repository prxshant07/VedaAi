'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  PieChart,
  Settings,
  Sparkles,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: LayoutGrid,
  },

  {
    href: '/groups',
    label: 'My Groups',
    icon: Users,
  },

  {
    href: '/assignments',
    label: 'Assignments',
    icon: FileText,
    badge: true,
  },

  {
    href: '/toolkit',
    label: "AI Teacher's Toolkit",
    icon: BookOpen,
  },

  {
    href: '/library',
    label: 'My Library',
    icon: PieChart,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }

    return pathname.startsWith(href)
  }

  return (
    <aside
      className="
        flex
        h-[756px]
        w-[304px]
        flex-col
        justify-between
        rounded-[16px]
        bg-[#F8F8F8]
        p-[24px]
      "
    >

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="flex items-center">

          {/* Fixed Logo Container */}
          <div
            className="
              flex
              h-[42px]
              w-[42px]
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <img
              src="/illustrations/logo2.png"
              alt="VedaAI"
              className="
                h-[32px]
                w-[32px]
                object-contain
              "
            />
          </div>

          {/* Text */}
          <h1
            className="
              ml-[10px]
              text-[18px]
              font-[700]
              leading-none
              tracking-[-0.04em]
              text-[#1F1F1F]
            "
          >
            VedaAI
          </h1>
        </div>

        {/* Create Assignment */}
        <div className="mt-[32px]">

          <Link
            href="/assignments/create"
            className="
              relative
              flex
              h-[48px]
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#101010]
              text-[14px]
              font-medium
              text-white
            "
          >

            {/* Orange Underglow */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-full
                shadow-[0_0_0_2px_#FF6A3D,0_0_16px_rgba(255,106,61,0.45)]
              "
            />

            <Sparkles
              size={15}
              strokeWidth={2.2}
              className="relative z-10"
            />

            <span className="relative z-10">
              Create Assignment
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-[42px] flex flex-col gap-[6px]">

          {navItems.map((item) => {
            const Icon = item.icon

            const active =
              isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                  flex
                  h-[40px]
                  items-center
                  gap-[12px]
                  rounded-[10px]
                  px-[14px]
                  text-[14px]
                  font-medium
                  transition-all
                  `,

                  active
                    ? 'bg-[#EFEFEF] text-[#1A1A1A]'
                    : 'text-[#7A7A7A] hover:bg-[#F1F1F1]'
                )}
              >

                <Icon
                  size={17}
                  strokeWidth={1.9}
                  className={cn(
                    active
                      ? 'text-[#1A1A1A]'
                      : 'text-[#8A8A8A]'
                  )}
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className="
                      flex
                      h-[22px]
                      min-w-[22px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FF5A36]
                      px-[6px]
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    6
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div>

        {/* Settings */}
        <Link
          href="/settings"
          className="
            flex
            h-[40px]
            items-center
            gap-[12px]
            rounded-[10px]
            px-[14px]
            text-[14px]
            font-medium
            text-[#7A7A7A]
            transition-all
            hover:bg-[#F1F1F1]
          "
        >

          <Settings
            size={17}
            strokeWidth={1.9}
            className="text-[#8A8A8A]"
          />

          Settings
        </Link>

        {/* School Card */}
        <div
          className="
            mt-4
            rounded-[16px]
            border
            border-[#ECECEC]
            bg-[#F6F6F6]
            p-[14px]
          "
        >

          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div
              className="
                flex
                h-[44px]
                w-[44px]
                items-center
                justify-center
                rounded-full
                bg-[#0B1736]
                text-[14px]
                font-bold
                text-[#FFD84D]
              "
            >
              DP
            </div>

            {/* Text */}
            <div>

              <p
                className="
                  text-[14px]
                  font-semibold
                  text-[#1F1F1F]
                "
              >
                Delhi Public School
              </p>

              <p
                className="
                  mt-[2px]
                  text-[12px]
                  text-[#7A7A7A]
                "
              >
                Indore, M.P.
              </p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}