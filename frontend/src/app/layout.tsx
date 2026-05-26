import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Examify - AI Assessment Creator',
  description: 'Generate professional exam papers with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-zinc-50">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
