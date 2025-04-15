'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isOnline ? 'You\'re back online!' : 'You\'re offline'}
          </CardTitle>
          <CardDescription className="text-center">
            {isOnline 
              ? 'Your connection has been restored.' 
              : 'No internet connection detected.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-4">
          {isOnline ? (
            <Icons.CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <Icons.WifiOff className="h-16 w-16 text-gray-400" />
          )}
          
          {!isOnline && (
            <p className="text-center text-sm text-muted-foreground">
              Don't worry! Some features of Restaurant Passport are available offline.
              Your punch cards and restaurant information are saved locally.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          {isOnline ? (
            <Button onClick={() => window.history.back()}>
              Continue Browsing
            </Button>
          ) : (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}