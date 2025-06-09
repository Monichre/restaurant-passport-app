'use client'

import {useSession} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

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
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
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

export const TriggerSignUp = ({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string
  restaurantName: string
}) => {
  const {isLoaded, isSignedIn} = useSession()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    // Only show modal if not signed in and direct entry (likely QR scan)
    if (
      !isSignedIn &&
      typeof window !== 'undefined' &&
      window.history.length === 1
    ) {
      setShowModal(true)
      // Store context for onboarding reward after signup
      localStorage.setItem('qr_onboarding_restaurant_id', restaurantId)
      localStorage.setItem('qr_onboarding_restaurant_name', restaurantName)
      // Optionally, log scan event here (POST /api/qr/scan)
    }
  }, [isLoaded, isSignedIn, restaurantId, restaurantName])

  // Handler for Clerk sign up
  const handleSignUp = () => {
    // Redirect to sign up page, preserving context
    router.push(`/sign-up?qr=1&restaurantId=${restaurantId}`)
  }
  // Handler for Clerk sign in
  const handleSignIn = () => {
    router.push(`/sign-in?qr=1&restaurantId=${restaurantId}`)
  }

  // If signed in, render nothing
  if (isSignedIn) return null

  // Only show modal if triggered
  return showModal ? (
    <QrOnboardingModal
      restaurantName={restaurantName}
      onSignUp={handleSignUp}
      onSignIn={handleSignIn}
    />
  ) : null
}
