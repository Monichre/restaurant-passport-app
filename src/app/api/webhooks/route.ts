
import { Webhook } from "svix"
import { headers } from "next/headers"
import { clerkClient } from "@clerk/nextjs/server"
import { createUser } from "@/db/models/users"
import { convertBigInts } from "@/lib/utils"

export async function POST( req: Request ) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET

	if ( !SIGNING_SECRET ) {
		throw new Error(
			"Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
		)
	}

	// Create new Svix instance with secret
	const wh = new Webhook( SIGNING_SECRET )

	// Get headers
	const headerPayload = await headers()
	const svix_id = headerPayload.get( "svix-id" )
	const svix_timestamp = headerPayload.get( "svix-timestamp" )
	const svix_signature = headerPayload.get( "svix-signature" )

	// If there are no headers, error out
	if ( !svix_id || !svix_timestamp || !svix_signature ) {
		return new Response( "Error: Missing Svix headers", {
			status: 400,
		} )
	}

	// Get body
	const payload = await req.text()
	const body = JSON.parse( payload )

	console.log( "🚀 ~ POST ~ payload:", body )

	// Verify payload with the headers
	let evt: any
	try {
		evt = wh.verify( payload, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		} )
	} catch ( err ) {
		console.error( "Error verifying webhook:", err )
		return new Response( "Error: Verification error", {
			status: 400,
		} )
	}

	try {
		const { data, type } = evt as { data: any; type: string }

		if ( type === "user.created" ) {
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

			console.log( "📝 Creating user:", { clerkId, name, email } )

			// Create user in Supabase database
			const user = await createUser( {
				clerkId,
				name,
				email,
			} )

			console.log( "✅ User created in database:", user[0] )

			// Update Clerk user's metadata with Supabase user ID
			const client = await clerkClient()
			await client.users.updateUserMetadata( clerkId, {
				privateMetadata: {
					supabaseUserId: user[0].id.toString(),
				},
			} )

			console.log( "✅ Updated Clerk user metadata with Supabase user ID:", user[0].id )

			return Response.json( {
				message: "User created and metadata updated successfully",
				data: convertBigInts( user ),
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
