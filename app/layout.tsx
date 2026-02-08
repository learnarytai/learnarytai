import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learnary Tai',
  description: 'Learn languages with real-time translation and interactive hints',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
