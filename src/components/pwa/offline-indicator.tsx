'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/icons'

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOffline(!navigator.onLine)
    
    const handleOnline = () => {
      setIsOffline(false)
      // Show the banner for a brief moment when coming back online
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }
    
    const handleOffline = () => {
      setIsOffline(true)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner) {
    return null
  }

  return (
    <Alert 
      variant={isOffline ? "destructive" : "default"} 
      className="fixed bottom-20 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 transform"
    >
      <div className="flex items-center gap-2">
        {isOffline ? (
          <Icons.WifiOff className="h-4 w-4" />
        ) : (
          <Icons.CheckCircle className="h-4 w-4" />
        )}
        <AlertDescription>
          {isOffline 
            ? "You're offline. Some features may be limited."
            : "You're back online!"}
        </AlertDescription>
      </div>
    </Alert>
  )
}

export default OfflineIndicator