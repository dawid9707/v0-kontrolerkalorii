import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DietProvider } from '@/lib/diet-context'
import { Navigation } from '@/components/navigation'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FitTracker - Kontrola diety i kalorii',
  description: 'Aplikacja do kontroli diety, liczenia kalorii oraz monitorowania postępów zdrowotnych',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" className="bg-background">
      <body className="font-sans antialiased">
        <DietProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Navigation />
            <main className="flex-1 pb-20 md:pb-0">
              <div className="max-w-2xl mx-auto p-4">
                {children}
              </div>
            </main>
          </div>
        </DietProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
