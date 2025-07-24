
import { Webhook } from "svix"
import { headers } from "next/headers"
import { clerkClient } from "@clerk/nextjs/server"
import { createUser, getUserByClerkId, getUserByEmail } from "@/db/models/users"
import { convertBigInts } from "@/lib/utils"
import { ClerkWebhookEvent, isUserCreatedEvent } from "@/types/clerk-webhook"
import type { User } from "@/types"
import { trackUserRegistration, trackUserMetadataUpdate } from "@/lib/posthog-server"

export async function POST( req: Request ) {

	// console.log( "🚀 ~ POST ~ req:", req )

	// const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.CLERK_WEBHOOK_SECRET

	// console.log( "🚀 ~ POST ~ WEBHOOK_SECRET:", WEBHOOK_SECRET )


	// if ( !WEBHOOK_SECRET ) {
	// 	throw new Error(
	// 		"Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
	// 	)
	// }

	// // Create new Svix instance with secret
	// const wh = new Webhook( WEBHOOK_SECRET )

	// console.log( "🚀 ~ POST ~ wh:", wh )


	// // Get headers
	// const headerPayload = await headers()

	// console.log( "🚀 ~ POST ~ headerPayload:", headerPayload )

	// const svix_id = headerPayload.get( "svix-id" )

	// console.log( "🚀 ~ POST ~ svix_id:", svix_id )

	// const svix_timestamp = headerPayload.get( "svix-timestamp" )

	// console.log( "🚀 ~ POST ~ svix_timestamp:", svix_timestamp )

	// const svix_signature = headerPayload.get( "svix-signature" )

	// console.log( "🚀 ~ POST ~ svix_signature:", svix_signature )


	// If there are no headers, error out
	// if ( !svix_id || !svix_timestamp || !svix_signature ) {
	// 	return new Response( "Error: Missing Svix headers", {
	// 		status: 400,
	// 	} )
	// }

	// Get body
	const payload = await req.text()

	console.log( "🚀 ~ POST ~ payload:", payload )

	const body = JSON.parse( payload )

	console.log( "🚀 ~ POST ~ payload:", body )

	// Verify payload with the headers
	let evt: ClerkWebhookEvent = body
	// try {
	// 	evt = wh.verify( payload, {
	// 		"svix-id": svix_id,
	// 		"svix-timestamp": svix_timestamp,
	// 		"svix-signature": svix_signature,
	// 	} ) as ClerkWebhookEvent
	// } catch ( err ) {
	// 	console.error( "Error verifying webhook:", err )
	// 	return new Response( "Error: Verification error", {
	// 		status: 400,
	// 	} )
	// }

	try {
		const { data, type } = evt
		const newUserSignUp = isUserCreatedEvent( evt )

		console.log( "🚀 ~ POST ~ newUserSignUp:", newUserSignUp )

		if ( newUserSignUp ) {
			console.log( "🚀 ~ POST ~ data:", data )
			const { id: clerkId, email_addresses, first_name, last_name } = data



			// Validate required fields
			if ( !clerkId || !email_addresses || email_addresses.length === 0 ) {
				console.error( "Missing required user data:", { clerkId, email_addresses } )
				return new Response( "Error: Missing required user data", {
					status: 400,
				} )
			}

			const email = email_addresses[0].email_address
			const name = `${first_name || ''} ${last_name || ''}`.trim() || email.split( '@' )[0]

			console.log( "📝 Checking for existing user (first using clerkId):", { clerkId, name, email } )

			// Check for existing user by clerkId or email
			let existingUser = await getUserByClerkId( clerkId )

			console.log( "🚀 ~ POST ~ existingUser by clerkId:", existingUser )

			if ( !existingUser ) {
				console.log( "📝 Checking for existing user by email:", { email } )
				existingUser = await getUserByEmail( email )

				console.log( "🚀 ~ POST ~ existingUser by email:", existingUser )

			}

			let user
			const isExistingUser = !!existingUser

			if ( existingUser ) {
				console.log( "✅ User already exists:", existingUser.id )
				user = existingUser

				// If user exists but has different clerkId, update it
				if ( existingUser.clerkId !== clerkId ) {
					console.log( "🔄 Updating existing user's clerkId from", existingUser.clerkId, "to", clerkId )
					// Note: This would be a rare edge case where email exists with different clerkId
					// Consider if this scenario should be handled differently based on business logic
				}
			} else {
				console.log( "📝 Creating new user:", { clerkId, name, email } )

				// Create user in Supabase database
				const [newUser] = await createUser( {
					clerkId,
					name,
					email,
				} )
				user = newUser
			}

			console.log( "🚀 ~ POST ~ user:", user )


			console.log( "🚀 ~ POST ~ user created in database:", user )

			// Track user registration in PostHog (non-blocking) - only for new users
			if ( !isExistingUser ) {
				trackUserRegistration( {
					clerkId,
					email,
					name,
					internalUserId: user.id.toString(),
				} ).catch( error => console.error( 'PostHog tracking error:', error ) )
			}

			// Update Clerk user's metadata with Supabase user ID
			const client = await clerkClient()
			await client.users.updateUserMetadata( clerkId, {
				privateMetadata: {
					supabaseUserId: user.id.toString(),
					databaseId: user.id.toString(),
				},
			} )

			console.log( "✅ Updated Clerk user metadata with Supabase user ID:", user.id )

			// Track metadata update in PostHog (non-blocking)
			await trackUserMetadataUpdate( {
				clerkId,
				internalUserId: user.id.toString(),
			} ).catch( error => console.error( 'PostHog metadata tracking error:', error ) )

			return Response.json( {
				message: isExistingUser ? "Existing user processed and metadata updated successfully" : "User created and metadata updated successfully",
				data: convertBigInts( user ),
				userStatus: isExistingUser ? "existing" : "created"
			} )
		}

		// Handle other webhook types if needed
		console.log( "ℹ️ Unhandled webhook type:", type )
		return Response.json( { message: "Webhook received but not processed", type } )

	} catch ( err ) {
		console.error( "Error processing webhook:", err )
		return new Response( `Error: ${err instanceof Error ? err.message : 'Unknown error'}`, {
			status: 500,
		} )
	}
}
