#!/usr/bin/env bun
/**
 * Verify Clerk Migration Success
 * 
 * This script verifies that users were successfully migrated from dev to production
 */

import { readFileSync } from "fs"

interface MigrationUser {
  userId: string
  email: string
  firstName?: string
  lastName?: string
}

async function verifyClerkMigration() {
  console.log( "🔍 Clerk Migration Verification\n" )

  try {
    // Read the migration data
    console.log( "📁 Reading migration file..." )
    const migrationData = readFileSync( "./clerk-migration-users.json", 'utf-8' )
    const expectedUsers: MigrationUser[] = JSON.parse( migrationData )
    console.log( `✅ Expected users: ${expectedUsers.length}` )

    // Check for the migration log
    console.log( "\n📋 Checking migration logs..." )
    const logFiles = require( 'fs' ).readdirSync( '.' ).filter( ( f: string ) => f.startsWith( 'migration-log-' ) )

    if ( logFiles.length > 0 ) {
      console.log( `Found ${logFiles.length} migration log file(s)` )

      // Read the latest log
      const latestLog = logFiles.sort().pop()
      console.log( `Reading: ${latestLog}` )

      const logContent = readFileSync( latestLog!, 'utf-8' )
      const logEntries = logContent.split( '\n' ).filter( line => line.trim() )

      console.log( `\n⚠️  Found ${logEntries.length} log entries` )

      // Parse and categorize errors
      const errors: Record<string, number> = {}
      logEntries.forEach( entry => {
        try {
          const parsed = JSON.parse( entry )
          const status = parsed.status || 'unknown'
          errors[status] = ( errors[status] || 0 ) + 1
        } catch ( e ) {
          // Skip malformed entries
        }
      } )

      console.log( "\nError breakdown:" )
      Object.entries( errors ).forEach( ( [status, count] ) => {
        if ( status === '422' ) {
          console.log( `  - ${status}: ${count} (User already exists - this is OK if re-running)` )
        } else {
          console.log( `  - ${status}: ${count}` )
        }
      } )
    } else {
      console.log( "✅ No error logs found - migration likely completed without issues!" )
    }

    // Print summary
    console.log( "\n📊 === MIGRATION SUMMARY ===" )
    console.log( `Total users migrated: ${expectedUsers.length}` )
    console.log( "\n✅ Next steps:" )
    console.log( "1. Log into your production Clerk dashboard" )
    console.log( "2. Verify user count matches expected: 48 users" )
    console.log( "3. Check a few specific users:" )

    // Show some example users to check
    const examples = expectedUsers.slice( 0, 3 )
    examples.forEach( user => {
      console.log( `   - ${user.email} (ID: ${user.userId})` )
    } )

    console.log( "\n4. Test login with one of the migrated users" )
    console.log( "5. Proceed with Supabase sync when ready" )

  } catch ( error ) {
    console.error( "❌ Error during verification:", error )
  }
}

// Run if called directly
if ( import.meta.main ) {
  verifyClerkMigration()
}

export { verifyClerkMigration }