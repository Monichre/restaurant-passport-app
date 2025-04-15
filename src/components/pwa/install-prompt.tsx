'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if the app is already installed (in standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Listen for the beforeinstallprompt event
    // This only works on Chrome, Edge, etc. - not Safari
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom install button
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check for standalone mode changes
    const mediaQueryList = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches)
    }
    mediaQueryList.addEventListener('change', handleChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [])

  // Don't show the install button if already installed
  if (isInstalled) {
    return null
  }

  // Handle the install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) {
      return // No installation prompt available
    }

    if (deferredPrompt) {
      // Show the browser install prompt (Chrome, Edge, etc.)
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      // We no longer need the prompt
      setDeferredPrompt(null)
      // Hide our button 
      setIsVisible(false)
    }
  }

  // Default installation instructions for iOS
  if (isIOS) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Icons.Plus className="h-4 w-4" />
            <span>Add to Home Screen</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Install Restaurant Passport</SheetTitle>
            <SheetDescription>
              Get the full app experience by adding to your home screen
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">For iPhone and iPad:</h3>
              <ol className="space-y-2 pl-5">
                <li>1. Tap the Share button <span className="inline-block px-2">⎋</span> at the bottom of the screen</li>
                <li>2. Scroll down and tap "Add to Home Screen" <span className="inline-block px-2">➕</span></li>
                <li>3. Tap "Add" in the top right corner</li>
              </ol>
              <div className="mt-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  After installation, you'll be able to use the app offline and receive notifications.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // For other browsers (Chrome, Edge, etc.)
  if (isVisible && deferredPrompt) {
    return (
      <Button variant="outline" size="sm" className="gap-2" onClick={handleInstallClick}>
        <Icons.Plus className="h-4 w-4" />
        <span>Install App</span>
      </Button>
    )
  }

  // Don't show anything if we can't install
  return null
}

export default InstallPrompt