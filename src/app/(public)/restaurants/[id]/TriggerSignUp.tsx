'use client'

import {useSession} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {clientCookies} from '@/lib/cookies'
import {usePostHog} from 'posthog-js/react'
import {processQrScan} from '@/app/actions/scan-actions'

// Simple modal/banner component
const QrOnboardingModal = ({
  restaurantName,
  onSignUp,
  onSignIn,
}: {
  restaurantName: string
  onSignUp: () => void
  onSignIn: () => void
}) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center'>
      <h2 className='text-xl font-bold mb-2'>Welcome!</h2>
      <p className='mb-4'>
        You scanned a code for{' '}
        <span className='font-semibold'>{restaurantName}</span>.<br />
        Sign up to start earning rewards at this restaurant.
      </p>
      <div className='flex flex-col gap-2'>
        <button
          className='bg-green-700 text-white rounded px-4 py-2 font-semibold hover:bg-green-800 transition'
          onClick={onSignUp}
        >
          Sign Up
        </button>
        <button
          className='bg-gray-200 text-gray-800 rounded px-4 py-2 font-semibold hover:bg-gray-300 transition'
          onClick={onSignIn}
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
)

// Processing indicator for existing users
const QrProcessingIndicator = ({restaurantName}: {restaurantName: string}) => (
  <div className='fixed top-4 right-4 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2'>
    <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
    <span className='text-sm'>Processing QR scan for {restaurantName}...</span>
  </div>
)

export const TriggerSignUp = ({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string
  restaurantName: string
}) => {
  const {isLoaded, isSignedIn, session} = useSession()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isProcessingQR, setIsProcessingQR] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    if (!isLoaded || !posthog) return

    // Check if this is a first-time visitor using cookie
    const isFirstTime = clientCookies.isFirstTimeVisitor()
    const hasDirectEntry =
      typeof window !== 'undefined' && window.history.length === 1
    const firstVisitTimestamp = clientCookies.getFirstVisitTimestamp()

    // Track restaurant page view with visitor context
    posthog.capture('restaurant_page_viewed', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      is_first_time_visitor: isFirstTime,
      has_direct_entry: hasDirectEntry,
      first_visit_timestamp: firstVisitTimestamp,
      is_signed_in: isSignedIn,
      user_agent:
        typeof window !== 'undefined' ? window.navigator.userAgent : null,
    })

    // Track first-time visitor event specifically
    if (isFirstTime) {
      posthog.capture('first_time_visitor_detected', {
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        entry_method: hasDirectEntry ? 'direct_entry' : 'navigation',
        timestamp: new Date().toISOString(),
      })
    }

    // Track potential QR scan
    if (hasDirectEntry) {
      posthog.capture('potential_qr_scan', {
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        is_first_time_visitor: isFirstTime,
        timestamp: new Date().toISOString(),
      })
    }

    // Only show modal if not signed in and either first-time visitor or direct entry (QR scan)
    if (!isSignedIn && (isFirstTime || hasDirectEntry)) {
      setShowModal(true)

      // Track signup modal shown
      posthog.capture('signup_modal_shown', {
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        trigger_reason: isFirstTime ? 'first_time_visitor' : 'qr_scan',
        is_first_time_visitor: isFirstTime,
        has_direct_entry: hasDirectEntry,
      })

      // Store context for onboarding reward after signup
      localStorage.setItem('qr_onboarding_restaurant_id', restaurantId)
      localStorage.setItem('qr_onboarding_restaurant_name', restaurantName)

      // Store first-time visitor info for analytics
      if (isFirstTime) {
        localStorage.setItem('first_time_visitor', 'true')
        localStorage.setItem('first_restaurant_visited', restaurantId)
      }
    }
  }, [isLoaded, isSignedIn, restaurantId, restaurantName, posthog])

  // Handle existing users who scan QR codes
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !session?.user?.id || isProcessingQR) return

    const hasDirectEntry =
      typeof window !== 'undefined' && window.history.length === 1

    // Only process if this appears to be a direct entry (QR scan)
    if (hasDirectEntry) {
      setIsProcessingQR(true)

      // Track existing user QR scan
      posthog?.capture('existing_user_qr_scan', {
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        user_id: session.user.id,
        timestamp: new Date().toISOString(),
      })

      // Process the QR scan for the existing user
      const processExistingUserScan = async () => {
        try {
          // Create a mock QR data URL since we know they arrived via QR
          const qrData = `https://experiencemaplegrove.app/restaurants/${restaurantId}`

          const result = await processQrScan({
            qrData,
            userId: session.user.id,
          })

          if (result.error) {
            console.error('Error processing QR scan:', result.error)
            posthog?.capture('qr_scan_error', {
              restaurant_id: restaurantId,
              restaurant_name: restaurantName,
              user_id: session.user.id,
              error: result.error,
              message: result.message,
            })
          } else {
            // Track successful scan
            posthog?.capture('qr_scan_success', {
              restaurant_id: restaurantId,
              restaurant_name: restaurantName,
              user_id: session.user.id,
              message: result.message,
              is_existing_card: result.isExisting,
            })

            // Show success toast or notification
            // You might want to add a toast notification here
          }
        } catch (error) {
          console.error('Error processing existing user QR scan:', error)
          posthog?.capture('qr_scan_error', {
            restaurant_id: restaurantId,
            restaurant_name: restaurantName,
            user_id: session.user.id,
            error: 'Processing failed',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        } finally {
          setIsProcessingQR(false)
        }
      }

      processExistingUserScan()
    }
  }, [
    isLoaded,
    isSignedIn,
    session?.user?.id,
    restaurantId,
    restaurantName,
    posthog,
    isProcessingQR,
  ])

  // Handler for Clerk sign up
  const handleSignUp = () => {
    const isFirstTime = clientCookies.isFirstTimeVisitor()

    // Track signup button clicked
    posthog?.capture('signup_button_clicked', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      is_first_time_visitor: isFirstTime,
      context: 'restaurant_modal',
      timestamp: new Date().toISOString(),
    })

    // Redirect to sign up page, preserving context
    router.push(`/sign-up?qr=1&restaurantId=${restaurantId}`)
  }

  // Handler for Clerk sign in
  const handleSignIn = () => {
    const isFirstTime = clientCookies.isFirstTimeVisitor()

    // Track signin button clicked
    posthog?.capture('signin_button_clicked', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      is_first_time_visitor: isFirstTime,
      context: 'restaurant_modal',
      timestamp: new Date().toISOString(),
    })

    router.push(`/sign-in?qr=1&restaurantId=${restaurantId}`)
  }

  // If signed in, only show processing indicator if needed
  if (isSignedIn) {
    return isProcessingQR ? (
      <QrProcessingIndicator restaurantName={restaurantName} />
    ) : null
  }

  // For non-signed-in users, show modal if triggered
  return showModal ? (
    <QrOnboardingModal
      restaurantName={restaurantName}
      onSignUp={handleSignUp}
      onSignIn={handleSignIn}
    />
  ) : null
}
