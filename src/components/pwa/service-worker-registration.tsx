'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })

        // Handle service worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          if (!installingWorker) return

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, prompt user to reload
                toast.info('App update available', {
                  description: 'Refresh to update to the latest version',
                  action: {
                    label: 'Refresh',
                    onClick: () => window.location.reload(),
                  },
                })
              } else {
                // Initial install complete
                setIsRegistered(true)
                toast.success('App ready for offline use', {
                  description: 'Content cached for offline access',
                })
              }
            }
          }
        }

        // Check for existing registrations
        const existingRegistration = await navigator.serviceWorker.ready
        if (existingRegistration) {
          setIsRegistered(true)
        }
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    registerServiceWorker()

    // Clean up
    return () => {
      // Nothing to clean up for service worker registration
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

export default ServiceWorkerRegistration