'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      checkSubscriptionStatus()
    }
  }, [])

  async function checkSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setSubscription(subscription)
    } catch (error) {
      console.error('Error checking push subscription status:', error)
    }
  }

  async function subscribeToPush() {
    if (!userId) {
      toast.error('You must be logged in to subscribe to notifications')
      return
    }

    setIsPending(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidPublicKey) {
        throw new Error('VAPID public key is not configured')
      }

      // Subscribe the user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })
      
      setSubscription(subscription)
      
      // Store the subscription on the server
      import('../../../app/actions/push-notifications').then(async ({ subscribeUser }) => {
        if (userId) {
          await subscribeUser(subscription, userId)
        }
      })
      
      toast.success('Subscribed to notifications')

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      toast.error('Failed to subscribe to notifications')
    } finally {
      setIsPending(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsPending(true)
    try {
      // Unsubscribe from push manager
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
        
        // Remove the subscription on the server
        if (userId) {
          import('../../../app/actions/push-notifications').then(async ({ unsubscribeUser }) => {
            await unsubscribeUser(userId)
          })
        }
        
        toast.success('Unsubscribed from notifications')
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      toast.error('Failed to unsubscribe from notifications')
    } finally {
      setIsPending(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {subscription ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={unsubscribeFromPush}
          disabled={isPending}
        >
          {isPending ? 'Unsubscribing...' : 'Disable Notifications'}
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={subscribeToPush}
          disabled={isPending}
        >
          {isPending ? 'Subscribing...' : 'Enable Notifications'}
        </Button>
      )}
    </div>
  )
}

export default PushNotificationManager