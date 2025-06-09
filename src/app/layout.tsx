import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'

import {LocationProvider} from '@/context/location-context'
import {Analytics} from '@vercel/analytics/react'
import {Nav} from '@/components/nav/nav'
import {Toaster} from '@/components/ui/sonner'
import {UserProvider} from '@/context/user-context'
import './globals.css'
import {StyleWrapper} from '@/context/style-wrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Experience Maple Grove Restaurant Passport',
  description: 'Track your restaurant visits and experiences',
  // viewport:
  //   'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover',
  icons: {
    icon: [
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
    ],
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
  },
  manifest: '/site.webmanifest',
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
              {/* <StagewiseDevToolbar /> */}
              {/* <GoogleAnalytics gaId='G-SZWPFKRGP3' /> */}
              <StyleWrapper>{children}</StyleWrapper>
              <Nav />
              <Toaster />
              <Analytics />
            </body>
          </html>
        </UserProvider>
      </LocationProvider>
    </ClerkProvider>
  )
}
