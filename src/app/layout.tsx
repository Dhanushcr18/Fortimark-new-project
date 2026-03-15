import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Jesko Jets - Elevate Your Horizons',
  description:
    'The pinnacle of electric aviation with cinematic storytelling, silent performance, and uncompromising luxury.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
