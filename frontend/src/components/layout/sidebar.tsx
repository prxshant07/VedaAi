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
    <aside className="h-full p-4">

      <div
        className="
          flex
          h-full
          w-[220px]
          flex-col
          justify-between
          rounded-[18px]
          bg-[#FAFAFA]
          px-[18px]
          py-[18px]
          shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        "
      >

        {/* Top */}
        <div>

          {/* Logo */}
          <div className="flex items-center gap-[10px]">

            <img
              src="/illustrations/logo2.png"
              alt="VedaAI"
              className="
                h-[42px]
                w-[42px]
                object-contain
              "
            />

            <h1
              className="
                text-[18px]
                font-[700]
                tracking-[-0.04em]
                text-[#1F1F1F]
              "
            >
              VedaAI
            </h1>
          </div>

          {/* CTA */}
          <div className="mt-[26px]">

            <Link
              href="/assignments/create"
              className="
                relative
                flex
                h-[42px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#1A1A1A]
                text-[13px]
                font-medium
                text-white
              "
            >

              {/* Orange Glow */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  shadow-[0_0_0_2px_#FF6A3D,0_0_18px_rgba(255,106,61,0.55)]
                "
              />

              <Sparkles
                size={14}
                strokeWidth={2.2}
                className="relative z-10"
              />

              <span className="relative z-10">
                Create Assignment
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="mt-[34px] flex flex-col gap-[6px]">

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
                    h-[38px]
                    items-center
                    gap-[12px]
                    rounded-[10px]
                    px-[12px]
                    text-[13px]
                    font-medium
                    transition-all
                    `,

                    active
                      ? 'bg-[#EFEFEF] text-[#1A1A1A]'
                      : 'text-[#7A7A7A] hover:bg-[#F1F1F1]'
                  )}
                >

                  <Icon
                    size={16}
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
                        h-[20px]
                        min-w-[20px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FF5A36]
                        px-[5px]
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
              h-[38px]
              items-center
              gap-[12px]
              rounded-[10px]
              px-[12px]
              text-[13px]
              font-medium
              text-[#7A7A7A]
              transition-all
              hover:bg-[#F1F1F1]
            "
          >

            <Settings
              size={16}
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
              bg-[#F1F1F1]
              p-[12px]
            "
          >

            <div className="flex items-center gap-3">

              {/* Avatar */}
              <img
                src="/illustrations/avatar.png"
                alt="School"
                className="
                  h-[44px]
                  w-[44px]
                  rounded-full
                  object-cover
                "
              />

              {/* Text */}
              <div>

                <p
                  className="
                    text-[13px]
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
                  Bokaro Steel City
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}