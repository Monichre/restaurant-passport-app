// app/providers.jsx
'use client'

import posthog from 'posthog-js'
import {PostHogProvider as PHProvider} from 'posthog-js/react'
import {useEffect} from 'react'
import {LocationProvider} from './location-context'
import {UserProvider} from './user-context'
// import {PostHog} from 'posthog-node'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  })
}

function PostHogProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_pageview: 'history_change',
      capture_pageleave: true, // Enable pageleave capture
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking
      debug: process.env.NODE_ENV === 'development',
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export const AppProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <PostHogProvider>
      <LocationProvider>
        <UserProvider>{children}</UserProvider>
      </LocationProvider>
    </PostHogProvider>
  )
}
