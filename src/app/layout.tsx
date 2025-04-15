import type {Metadata, Viewport} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'

import {LocationProvider} from '@/context/location-context'
import {Analytics} from '@vercel/analytics/react'
import {Nav} from '@/components/nav/nav'
import {Toaster} from '@/components/ui/sonner'
import {UserProvider} from '@/context/user-context'
import './globals.css'
import {StyleWrapper} from '@/context/style-wrapper'
import dynamic from 'next/dynamic'

// Dynamically import PWA provider to avoid SSR issues
const PWAProvider = dynamic(() => import('@/components/pwa/pwa-provider'), { ssr: false })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#35AAD2',
}

export const metadata: Metadata = {
  title: 'Experience Maple Grove Restaurant Passport',
  description: 'Track your restaurant visits and earn rewards in Maple Grove',
  applicationName: 'Restaurant Passport',
  appleWebApp: {
    capable: true,
    title: 'Restaurant Passport',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <LocationProvider>
        <UserProvider>
          <html lang='en' suppressHydrationWarning>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased relative h-screen overflow-scroll bg-[#faf9f6] overflow-x-hidden`}
            >
              <PWAProvider>
                <StyleWrapper>{children}</StyleWrapper>

                <Nav />
                <Toaster />

                <Analytics />
              </PWAProvider>
            </body>
          </html>
        </UserProvider>
      </LocationProvider>
    </ClerkProvider>
  )
}
