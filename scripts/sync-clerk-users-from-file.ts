#!/usr/bin/env bun
/**
 * Sync Clerk Users to Supabase from JSON File
 * 
 * This script reads Clerk user data from a JSON file and syncs to Supabase.
 * Usage: bun run scripts/sync-clerk-users-from-file.ts <path-to-json-file>
 */

import { readFileSync } from "fs"
import { syncClerkUsersToSupabase } from "./sync-clerk-to-supabase"

async function main() {
  const filePath = process.argv[2]

  if ( !filePath ) {
    console.error( `
Usage: bun run scripts/sync-clerk-users-from-file.ts <path-to-json-file>

Example:
bun run scripts/sync-clerk-users-from-file.ts ./clerk-users.json

The JSON file should contain an array of Clerk user objects:
[
  {
    "id": "user_123",
    "emailAddresses": [{"emailAddress": "test@example.com", "id": "email_123"}],
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": 1640995200000,
    "updatedAt": 1640995200000
  }
]
    `)
    process.exit( 1 )
  }

  try {
    console.log( `📁 Reading Clerk users from: ${filePath}` )
    const fileContent = readFileSync( filePath, 'utf-8' )
    const clerkUsers = JSON.parse( fileContent )

    if ( !Array.isArray( clerkUsers ) ) {
      throw new Error( "JSON file must contain an array of user objects" )
    }

    console.log( `📋 Found ${clerkUsers.length} users in file` )

    // Run the sync
    const result = await syncClerkUsersToSupabase( clerkUsers )

    if ( result.errors === 0 ) {
      console.log( "\n🎉 Sync completed successfully!" )
    } else {
      console.log( `\n⚠️  Sync completed with ${result.errors} errors` )
      process.exit( 1 )
    }

  } catch ( error ) {
    console.error( "💥 Error reading file or syncing users:", error )
    process.exit( 1 )
  }
}

main() 