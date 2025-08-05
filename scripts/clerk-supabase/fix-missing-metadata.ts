#!/usr/bin/env bun
/**
 * Fix Missing Metadata
 * 
 * This script updates Clerk users with missing Supabase metadata
 * Use this after migration if some users are missing the linkage
 */

import { clerkClient } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { users } from "@/db/drizzle/schema"
import { eq } from "drizzle-orm"

async function fixMissingMetadata() {
  console.log( "🔧 Starting metadata fix process...\n" )

  const client = await clerkClient()
  let fixed = 0
  let errors = 0

  try {
    // Get all Supabase users
    console.log( "🗄️  Fetching all Supabase users..." )
    const supabaseUsers = await db.select().from( users )
    console.log( `✅ Found ${supabaseUsers.length} users in Supabase` )

    // Get all Clerk users
    console.log( "\n🔑 Fetching all Clerk users..." )
    const clerkUsers = await client.users.getUserList( { limit: 500 } )
    console.log( `✅ Found ${clerkUsers.totalCount} users in Clerk` )

    // Create a map for quick lookup
    const clerkMap = new Map( clerkUsers.data.map( u => [u.id, u] ) )

    console.log( "\n🔍 Checking for missing metadata..." )

    for ( const supabaseUser of supabaseUsers ) {
      const clerkUser = clerkMap.get( supabaseUser.clerkId )

      if ( !clerkUser ) {
        console.error( `❌ Clerk user not found for Supabase user: ${supabaseUser.clerkId}` )
        errors++
        continue
      }

      const currentMetadataId = clerkUser.privateMetadata?.supabaseUserId as string | undefined
      const expectedId = supabaseUser.id.toString()

      if ( !currentMetadataId || currentMetadataId !== expectedId ) {
        console.log( `🔄 Updating metadata for ${clerkUser.id} (${clerkUser.emailAddresses[0]?.emailAddress})` )
        console.log( `   Current: ${currentMetadataId || 'none'}, Expected: ${expectedId}` )

        try {
          await client.users.updateUserMetadata( clerkUser.id, {
            privateMetadata: {
              ...clerkUser.privateMetadata,
              supabaseUserId: expectedId
            }
          } )

          fixed++
          console.log( `   ✅ Updated successfully` )

          // Rate limit protection
          await new Promise( resolve => setTimeout( resolve, 100 ) )
        } catch ( error ) {
          console.error( `   ❌ Failed to update: ${error}` )
          errors++
        }
      }
    }

    console.log( "\n📊 === METADATA FIX RESULTS ===" )
    console.log( `✅ Fixed: ${fixed} users` )
    console.log( `❌ Errors: ${errors}` )

    if ( errors > 0 ) {
      console.log( "\n⚠️  Some users could not be fixed. Check the logs above." )
    } else if ( fixed === 0 ) {
      console.log( "\n✨ All users already have correct metadata!" )
    } else {
      console.log( "\n🎉 Metadata fix completed successfully!" )
    }

  } catch ( error ) {
    console.error( "💥 Fatal error:", error )
  }
}

// Run if called directly
if ( import.meta.main ) {
  fixMissingMetadata()
}

export { fixMissingMetadata }