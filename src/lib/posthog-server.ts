import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogClient(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('PostHog: NEXT_PUBLIC_POSTHOG_KEY not found, PostHog disabled')
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    })
  }

  return posthogClient
}

export async function trackUserRegistration(userData: {
  clerkId: string
  email: string
  name: string
  internalUserId: string
}) {
  const client = getPostHogClient()
  if (!client) return

  try {
    // Track the user registration event
    client.capture({
      distinctId: userData.clerkId,
      event: 'user_registered',
      properties: {
        $set: {
          email: userData.email,
          name: userData.name,
          clerk_id: userData.clerkId,
          internal_user_id: userData.internalUserId,
          registration_source: 'webhook',
          registration_timestamp: new Date().toISOString(),
        },
        registration_method: 'clerk_oauth',
        user_type: 'customer',
      },
    })

    // Identify the user for future events
    client.identify({
      distinctId: userData.clerkId,
      properties: {
        email: userData.email,
        name: userData.name,
        clerk_id: userData.clerkId,
        internal_user_id: userData.internalUserId,
        user_type: 'customer',
      },
    })

    console.log('✅ PostHog: User registration tracked successfully')
  } catch (error) {
    console.error('❌ PostHog: Failed to track user registration:', error)
    // Non-blocking: don't throw error, just log it
  }
}

export async function trackUserMetadataUpdate(userData: {
  clerkId: string
  internalUserId: string
}) {
  const client = getPostHogClient()
  if (!client) return

  try {
    client.capture({
      distinctId: userData.clerkId,
      event: 'user_metadata_updated',
      properties: {
        $set: {
          internal_user_id: userData.internalUserId,
        },
        update_type: 'clerk_metadata',
        supabase_user_id: userData.internalUserId,
      },
    })

    console.log('✅ PostHog: User metadata update tracked successfully')
  } catch (error) {
    console.error('❌ PostHog: Failed to track metadata update:', error)
    // Non-blocking: don't throw error, just log it
  }
}

export async function flushPostHogEvents() {
  const client = getPostHogClient()
  if (!client) return

  try {
    await client.shutdown()
    console.log('✅ PostHog: Events flushed successfully')
  } catch (error) {
    console.error('❌ PostHog: Failed to flush events:', error)
  }
}