import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {Poppins, Open_Sans} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'

import {LocationProvider} from '@/context/location-context'
import {Analytics} from '@vercel/analytics/react'
import {Nav} from '@/components/nav/nav'
import {Toaster} from '@/components/ui/sonner'
import {UserProvider} from '@/context/user-context'
import './globals.css'
import {StyleWrapper} from '@/context/style-wrapper'
// import {GoogleAnalytics} from '@next/third-parties/google-analytics'
// import {GoogleAnalytics} from '@next/third-parties/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'Experience Maple Grove Restaurant Passport',
  description: 'Track your restaurant visits and experiences',
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
            <head>
              <link rel="stylesheet" href="https://use.typekit.net/dym2fcl.css" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body
              className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${openSans.variable} antialiased relative h-screen overflow-scroll bg-[#faf9f6] overflow-x-hidden font-poppins`}
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