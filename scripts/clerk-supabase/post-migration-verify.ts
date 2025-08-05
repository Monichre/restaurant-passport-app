#!/usr/bin/env bun
/**
 * Post-Migration Verification
 * 
 * This script verifies that the migration was successful and that
 * all relationships are intact between Clerk and Supabase
 */

import { clerkClient } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { users } from "@/db/drizzle/schema"
import { readFileSync } from "fs"

interface MigrationUser {
  userId: string
  email: string
}

interface VerificationResult {
  success: boolean
  totalExpected: number
  clerkUsers: number
  supabaseUsers: number
  metadataMatches: number
  issues: string[]
}

async function verifyMigration(): Promise<VerificationResult> {
  console.log( "🔍 Starting post-migration verification...\n" )

  const result: VerificationResult = {
    success: true,
    totalExpected: 0,
    clerkUsers: 0,
    supabaseUsers: 0,
    metadataMatches: 0,
    issues: []
  }

  try {
    // 1. Read migration file to get expected users
    console.log( "📁 Reading migration file..." )
    const migrationData = readFileSync( "./clerk-migration-users.json", 'utf-8' )
    const expectedUsers: MigrationUser[] = JSON.parse( migrationData )
    result.totalExpected = expectedUsers.length
    console.log( `✅ Expected users: ${result.totalExpected}` )

    // 2. Get all Clerk users
    console.log( "\n🔑 Fetching Clerk users..." )
    const client = await clerkClient()
    const clerkUserList = await client.users.getUserList( { limit: 500 } )
    result.clerkUsers = clerkUserList.totalCount
    console.log( `✅ Clerk users found: ${result.clerkUsers}` )

    // 3. Get all Supabase users
    console.log( "\n🗄️  Fetching Supabase users..." )
    const supabaseUsers = await db.select().from( users )
    result.supabaseUsers = supabaseUsers.length
    console.log( `✅ Supabase users found: ${result.supabaseUsers}` )

    // 4. Create maps for verification
    const expectedMap = new Map( expectedUsers.map( u => [u.userId, u.email] ) )
    const clerkMap = new Map( clerkUserList.data.map( u => [u.id, u.emailAddresses[0]?.emailAddress] ) )
    const supabaseMap = new Map( supabaseUsers.map( u => [u.clerkId, u] ) )

    // 5. Verify each expected user
    console.log( "\n🔗 Verifying user mappings..." )
    for ( const [userId, email] of expectedMap ) {
      // Check if user exists in Clerk
      if ( !clerkMap.has( userId ) ) {
        result.issues.push( `Missing in Clerk: ${userId} (${email})` )
        result.success = false
        continue
      }

      // Check if user exists in Supabase
      const supabaseUser = supabaseMap.get( userId )
      if ( !supabaseUser ) {
        result.issues.push( `Missing in Supabase: ${userId} (${email})` )
        result.success = false
        continue
      }

      // Check metadata linkage
      const clerkUser = clerkUserList.data.find( u => u.id === userId )
      if ( clerkUser?.privateMetadata?.supabaseUserId ) {
        const metadataId = clerkUser.privateMetadata.supabaseUserId as string
        if ( metadataId === supabaseUser.id.toString() ) {
          result.metadataMatches++
        } else {
          result.issues.push( `Metadata mismatch for ${userId}: Clerk has ${metadataId}, Supabase has ${supabaseUser.id}` )
          result.success = false
        }
      } else {
        result.issues.push( `Missing Supabase metadata for ${userId}` )
        // This might be okay if the user was already in Supabase before migration
      }
    }

    // 6. Check for orphaned users
    console.log( "\n🔍 Checking for orphaned users..." )

    // Clerk users not in migration file
    for ( const [clerkId, email] of clerkMap ) {
      if ( !expectedMap.has( clerkId ) ) {
        result.issues.push( `Unexpected Clerk user: ${clerkId} (${email}) - not in migration file` )
      }
    }

    // Supabase users not in migration file
    for ( const [clerkId, user] of supabaseMap ) {
      if ( !expectedMap.has( clerkId ) ) {
        result.issues.push( `Unexpected Supabase user: ${clerkId} (${user.email}) - not in migration file` )
      }
    }

  } catch ( error ) {
    console.error( "❌ Error during verification:", error )
    result.success = false
    result.issues.push( `Verification error: ${error}` )
  }

  // Print results
  console.log( "\n📊 === VERIFICATION RESULTS ===" )
  console.log( `Expected Users: ${result.totalExpected}` )
  console.log( `Clerk Users: ${result.clerkUsers}` )
  console.log( `Supabase Users: ${result.supabaseUsers}` )
  console.log( `Metadata Matches: ${result.metadataMatches}` )
  console.log( `Success: ${result.success ? '✅ YES' : '❌ NO'}` )

  if ( result.issues.length > 0 ) {
    console.log( "\n⚠️  Issues Found:" )
    result.issues.forEach( issue => console.log( `  - ${issue}` ) )
  }

  return result
}

// Run verification and provide recommendations
async function runVerification() {
  const result = await verifyMigration()

  if ( !result.success ) {
    console.log( "\n🔧 === RECOMMENDED ACTIONS ===" )

    if ( result.clerkUsers < result.totalExpected ) {
      console.log( "• Some users failed to migrate to Clerk. Check migration-log.json" )
    }

    if ( result.supabaseUsers < result.totalExpected ) {
      console.log( "• Run the Supabase sync script to create missing users" )
    }

    if ( result.metadataMatches < result.supabaseUsers ) {
      console.log( "• Some users are missing metadata. Run the metadata update script" )
    }
  } else {
    console.log( "\n🎉 Migration completed successfully!" )
  }
}

// Run if called directly
if ( import.meta.main ) {
  runVerification()
}

export { verifyMigration }