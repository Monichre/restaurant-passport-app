#!/usr/bin/env bun
/**
 * Sync Clerk Users to Supabase Database
 * 
 * This script takes Clerk user data and ensures all users are properly synced
 * to the Supabase database with correct metadata linking.
 */

import { clerkClient } from "@clerk/nextjs/server"
import { createUser, getUserByClerkId, getUsers } from "@/db/models/users"
import { convertBigInts } from "@/lib/utils"
import { db } from "@/db/db"

// Types for Clerk user data
interface ClerkUser {
  id: string
  emailAddresses: Array<{ emailAddress: string; id: string }>
  firstName?: string | null
  lastName?: string | null
  createdAt: number
  updatedAt: number
}

interface SyncResult {
  processed: number
  created: number
  skipped: number
  errors: number
  details: Array<{
    clerkId: string
    action: 'created' | 'skipped' | 'error'
    message: string
    supabaseUserId?: string
  }>
}

/**
 * Main sync function
 */
export async function syncClerkUsersToSupabase( clerkUsers: ClerkUser[] ): Promise<SyncResult> {
  console.log( `🚀 Starting sync of ${clerkUsers.length} Clerk users to Supabase...` )

  const result: SyncResult = {
    processed: 0,
    created: 0,
    skipped: 0,
    errors: 0,
    details: []
  }

  // Get existing Supabase users to avoid duplicates
  console.log( "📋 Fetching existing Supabase users..." )
  const existingUsers = await getUsers()
  const existingClerkIds = new Set( existingUsers.map( user => user.clerkId ) )
  console.log( `📊 Found ${existingUsers.length} existing users in Supabase` )

  const client = await clerkClient()

  // Process each Clerk user
  for ( const clerkUser of clerkUsers ) {
    result.processed++

    try {
      const { id: clerkId, emailAddresses, firstName, lastName } = clerkUser

      console.log( `\n🔄 Processing user ${result.processed}/${clerkUsers.length}: ${clerkId}` )

      // Validate required data
      if ( !clerkId || !emailAddresses || emailAddresses.length === 0 ) {
        console.log( `⚠️  Missing required data for user ${clerkId}` )
        result.errors++
        result.details.push( {
          clerkId,
          action: 'error',
          message: 'Missing required user data (clerkId or email)'
        } )
        continue
      }

      // Check if user already exists in Supabase
      if ( existingClerkIds.has( clerkId ) ) {
        console.log( `✅ User ${clerkId} already exists in Supabase, skipping...` )
        result.skipped++
        result.details.push( {
          clerkId,
          action: 'skipped',
          message: 'User already exists in Supabase'
        } )
        continue
      }

      // Prepare user data
      const email = emailAddresses[0].emailAddress
      const name = `${firstName || ''} ${lastName || ''}`.trim() || email.split( '@' )[0]

      console.log( `📝 Creating user: ${name} (${email})` )

      // Create user in Supabase
      const newUser = await createUser( {
        clerkId,
        name,
        email,
      } )

      const supabaseUserId = newUser[0].id.toString()
      console.log( `✅ Created user in Supabase with ID: ${supabaseUserId}` )

      // Update Clerk user's metadata with Supabase user ID
      try {
        await client.users.updateUserMetadata( clerkId, {
          privateMetadata: {
            supabaseUserId,
          },
        } )
        console.log( `✅ Updated Clerk metadata for user ${clerkId}` )
      } catch ( metadataError ) {
        console.warn( `⚠️  Failed to update Clerk metadata for ${clerkId}:`, metadataError )
        // Don't fail the whole operation for metadata errors
      }

      result.created++
      result.details.push( {
        clerkId,
        action: 'created',
        message: `Successfully created user: ${name}`,
        supabaseUserId
      } )

      // Add a small delay to avoid overwhelming the database
      await new Promise( resolve => setTimeout( resolve, 100 ) )

    } catch ( error ) {
      console.error( `❌ Error processing user ${clerkUser.id}:`, error )
      result.errors++
      result.details.push( {
        clerkId: clerkUser.id,
        action: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      } )
    }
  }

  return result
}

/**
 * Print detailed results
 */
function printResults( result: SyncResult ) {
  console.log( `\n📊 === SYNC RESULTS ===` )
  console.log( `📈 Total Processed: ${result.processed}` )
  console.log( `✅ Created: ${result.created}` )
  console.log( `⏭️  Skipped: ${result.skipped}` )
  console.log( `❌ Errors: ${result.errors}` )

  if ( result.details.length > 0 ) {
    console.log( `\n📋 === DETAILED RESULTS ===` )
    result.details.forEach( ( detail, index ) => {
      const icon = detail.action === 'created' ? '✅' :
        detail.action === 'skipped' ? '⏭️' : '❌'
      console.log( `${icon} ${index + 1}. ${detail.clerkId}: ${detail.message}` )
      if ( detail.supabaseUserId ) {
        console.log( `   └── Supabase ID: ${detail.supabaseUserId}` )
      }
    } )
  }

  if ( result.errors > 0 ) {
    console.log( `\n⚠️  ${result.errors} errors occurred. Check the logs above for details.` )
  }
}

/**
 * Validate environment and dependencies
 */
async function validateEnvironment() {
  console.log( "🔧 Validating environment..." )

  // Check environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = requiredEnvVars.filter( varName => !process.env[varName] )
  if ( missing.length > 0 ) {
    throw new Error( `Missing required environment variables: ${missing.join( ', ' )}` )
  }

  // Test database connection
  try {
    await db.query.users.findFirst()
    console.log( "✅ Database connection successful" )
  } catch ( error ) {
    throw new Error( `Database connection failed: ${error}` )
  }

  // Test Clerk connection
  try {
    const client = await clerkClient()
    // Try to fetch user count to test connection
    await client.users.getUserList( { limit: 1 } )
    console.log( "✅ Clerk connection successful" )
  } catch ( error ) {
    throw new Error( `Clerk connection failed: ${error}` )
  }
}

/**
 * Main execution function for direct usage
 */
export async function runSync( clerkUsersJson: string ) {
  try {
    console.log( "🔄 Starting Clerk to Supabase user sync..." )

    // Validate environment
    await validateEnvironment()

    // Parse Clerk users data
    let clerkUsers: ClerkUser[]
    try {
      clerkUsers = JSON.parse( clerkUsersJson )
      if ( !Array.isArray( clerkUsers ) ) {
        throw new Error( "Clerk users data must be an array" )
      }
    } catch ( error ) {
      throw new Error( `Failed to parse Clerk users JSON: ${error}` )
    }

    console.log( `📋 Parsed ${clerkUsers.length} Clerk users from input` )

    // Run the sync
    const result = await syncClerkUsersToSupabase( clerkUsers )

    // Print results
    printResults( result )

    if ( result.errors === 0 ) {
      console.log( "\n🎉 Sync completed successfully!" )
    } else {
      console.log( `\n⚠️  Sync completed with ${result.errors} errors` )
      process.exit( 1 )
    }

  } catch ( error ) {
    console.error( "💥 Fatal error during sync:", error )
    process.exit( 1 )
  }
}

// If running directly, expect JSON input as command line argument
if ( typeof process !== 'undefined' && process.argv.length > 2 && process.argv[1]?.includes( 'sync-clerk-to-supabase.ts' ) ) {
  const clerkUsersJson = process.argv[2]

  if ( !clerkUsersJson ) {
    console.error( `
Usage: bun run scripts/sync-clerk-to-supabase.ts '<clerk_users_json>'

Example:
bun run scripts/sync-clerk-to-supabase.ts '[{"id":"user_123","emailAddresses":[{"emailAddress":"test@example.com"}],"firstName":"John","lastName":"Doe"}]'

Or use it programmatically by importing the functions.
    `)
    process.exit( 1 )
  }

  runSync( clerkUsersJson )
} 