import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AppShell } from '@/components/layout/app-shell'
import { Bricolage_Grotesque } from 'next/font/google';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Creator',
  description: 'Generate professional exam papers with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} font-sans antialiased bg-[hsl(48,20%,97%)]`}>
        {/*
          AppShell is a 'use client' component that renders:
          - Desktop: fixed 220px sidebar + topbar + scrollable main
          - Mobile: topbar + scrollable main + bottom nav
          All route segments render as {children} inside main.
        */}
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  )
}
