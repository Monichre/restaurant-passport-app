'use client'

import { useEffect, useState } from 'react'
import { ServiceWorkerRegistration } from './service-worker-registration'
import dynamic from 'next/dynamic'

// Dynamically import PWA components to avoid SSR issues
const InstallPrompt = dynamic(() => import('./install-prompt'), { ssr: false })
const PushNotificationManager = dynamic(() => import('./push-notification-manager'), { ssr: false })
const OfflineIndicator = dynamic(() => import('./offline-indicator'), { ssr: false })

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render PWA components during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <ServiceWorkerRegistration />
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
        <InstallPrompt />
        <PushNotificationManager />
      </div>
      <OfflineIndicator />
    </>
  )
}

export default PWAProvider