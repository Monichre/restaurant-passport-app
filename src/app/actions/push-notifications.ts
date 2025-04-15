'use server'

import webpush from 'web-push'

// Set up web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:admin@experiencemaplegrove.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// In-memory storage for subscriptions (for development only)
// In production, you should use a database to store these
const subscriptionStore: Record<string, string> = {}

// Store a push subscription
export async function subscribeUser(subscription: PushSubscription, userId: string) {
  if (!subscription || !userId) {
    throw new Error('Missing subscription or user ID')
  }

  try {
    // Convert subscription to a JSON string for storage
    const serializedSubscription = JSON.stringify(subscription)
    
    // Store in memory (for development)
    // In production, you would store this in a database
    subscriptionStore[userId] = serializedSubscription

    return { success: true }
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return { success: false, error: 'Failed to save subscription' }
  }
}

// Remove a user's push subscription
export async function unsubscribeUser(userId: string) {
  if (!userId) {
    throw new Error('Missing user ID')
  }

  try {
    // Delete from in-memory store
    // In production, you would delete this from a database
    delete subscriptionStore[userId]
    
    return { success: true }
  } catch (error) {
    console.error('Error removing push subscription:', error)
    return { success: false, error: 'Failed to remove subscription' }
  }
}

// Send a notification to a specific user
export async function sendNotificationToUser(userId: string, message: string, title: string = 'Restaurant Passport') {
  if (!userId || !message) {
    throw new Error('Missing user ID or message')
  }

  try {
    // Get the user's subscription from the in-memory store
    const serializedSubscription = subscriptionStore[userId]
    
    if (!serializedSubscription) {
      return { success: false, error: 'No subscription found for user' }
    }

    // Parse the subscription
    const subscription = JSON.parse(serializedSubscription)

    // Send the notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body: message,
        icon: '/icons/icon-192x192.png',
        url: '/',
      })
    )

    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    
    // Handle expired subscriptions
    if (error instanceof webpush.WebPushError && error.statusCode === 410) {
      // Subscription has expired or is invalid - remove it
      delete subscriptionStore[userId]
    }
    
    return { success: false, error: 'Failed to send notification' }
  }
}

// Send a notification to all subscribers
export async function sendNotificationToAll(message: string, title: string = 'Restaurant Passport') {
  if (!message) {
    throw new Error('Missing message')
  }

  try {
    // Get all subscriptions from the in-memory store
    const userIds = Object.keys(subscriptionStore)
    
    if (userIds.length === 0) {
      return { success: false, error: 'No active subscriptions found' }
    }

    // Send notifications to all subscribers
    const results = await Promise.allSettled(
      userIds.map(async (userId) => {
        try {
          const subscription = JSON.parse(subscriptionStore[userId])
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title,
              body: message,
              icon: '/icons/icon-192x192.png',
              url: '/',
            })
          )
          return { success: true, userId }
        } catch (error) {
          // Handle expired subscriptions
          if (error instanceof webpush.WebPushError && error.statusCode === 410) {
            // Remove expired subscription
            delete subscriptionStore[userId]
          }
          return { success: false, userId, error }
        }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length
    const failed = results.length - successful

    return {
      success: true,
      stats: {
        total: results.length,
        successful,
        failed
      }
    }
  } catch (error) {
    console.error('Error sending push notifications:', error)
    return { success: false, error: 'Failed to send notifications' }
  }
}