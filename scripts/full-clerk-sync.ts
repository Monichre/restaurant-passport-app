#!/usr/bin/env bun
/**
 * Complete Clerk to Supabase User Sync
 * 
 * This script exports all users from Clerk and immediately syncs them to Supabase.
 * It combines the export and sync operations into a single workflow.
 */

import { exportClerkUsers } from "./export-clerk-users"
import { syncClerkUsersToSupabase } from "./sync-clerk-to-supabase"

interface FullSyncOptions {
  includeMetadata?: boolean
  limit?: number
  verbose?: boolean
  saveFile?: boolean
  outputFile?: string
}

/**
 * Perform complete sync from Clerk to Supabase
 */
export async function fullClerkSync( options: FullSyncOptions = {} ) {
  const {
    includeMetadata = false,
    limit,
    verbose = true,
    saveFile = true,
    outputFile
  } = options

  try {
    console.log( "🚀 Starting complete Clerk to Supabase sync..." )

    // Step 1: Export users from Clerk
    console.log( "\n📤 === STEP 1: EXPORT FROM CLERK ===" )
    const clerkUsers = await exportClerkUsers( {
      outputFile: saveFile ? outputFile : undefined,
      includeMetadata,
      limit,
      verbose
    } )

    if ( clerkUsers.length === 0 ) {
      console.log( "⚠️  No users found in Clerk, nothing to sync" )
      return {
        exported: 0,
        processed: 0,
        created: 0,
        skipped: 0,
        errors: 0
      }
    }

    // Step 2: Sync to Supabase
    console.log( "\n📥 === STEP 2: SYNC TO SUPABASE ===" )
    const syncResult = await syncClerkUsersToSupabase( clerkUsers )

    // Final summary
    console.log( "\n🎯 === FINAL SUMMARY ===" )
    console.log( `📤 Exported from Clerk: ${clerkUsers.length} users` )
    console.log( `📥 Processed for Supabase: ${syncResult.processed} users` )
    console.log( `✅ Created in Supabase: ${syncResult.created} users` )
    console.log( `⏭️  Skipped (already exist): ${syncResult.skipped} users` )
    console.log( `❌ Errors: ${syncResult.errors} users` )

    if ( saveFile && outputFile ) {
      console.log( `📁 Export saved to: ${outputFile}` )
    }

    const success = syncResult.errors === 0
    console.log( success ? "\n🎉 Complete sync successful!" : `\n⚠️  Sync completed with ${syncResult.errors} errors` )

    return {
      exported: clerkUsers.length,
      processed: syncResult.processed,
      created: syncResult.created,
      skipped: syncResult.skipped,
      errors: syncResult.errors
    }

  } catch ( error ) {
    console.error( "💥 Fatal error during complete sync:", error )
    throw error
  }
}

// CLI usage - only run if this script is executed directly
if ( typeof process !== 'undefined' && process.argv[1]?.includes( 'full-clerk-sync.ts' ) ) {
  const args = process.argv.slice( 2 )
  const options: FullSyncOptions = {}

  // Parse command line arguments
  for ( let i = 0; i < args.length; i++ ) {
    const arg = args[i]

    switch ( arg ) {
      case '--output':
      case '-o':
        options.outputFile = args[++i]
        break
      case '--metadata':
      case '-m':
        options.includeMetadata = true
        break
      case '--limit':
      case '-l':
        options.limit = parseInt( args[++i] )
        break
      case '--no-file':
        options.saveFile = false
        break
      case '--quiet':
      case '-q':
        options.verbose = false
        break
      case '--help':
      case '-h':
        console.log( `
Usage: bun run scripts/full-clerk-sync.ts [options]

This script exports all users from Clerk and syncs them to Supabase in one operation.

Options:
  -o, --output <file>     Output file path for backup (default: auto-generated)
  -m, --metadata          Include user metadata in export
  -l, --limit <number>    Limit number of users to process
  --no-file               Don't save export file (direct sync only)
  -q, --quiet             Suppress verbose output
  -h, --help              Show this help message

Examples:
  bun run scripts/full-clerk-sync.ts
  bun run scripts/full-clerk-sync.ts --output backup-users.json
  bun run scripts/full-clerk-sync.ts --no-file --limit 50
  bun run scripts/full-clerk-sync.ts --metadata --quiet
        `)
        process.exit( 0 )
        break
      default:
        if ( arg.startsWith( '-' ) ) {
          console.error( `Unknown option: ${arg}` )
          process.exit( 1 )
        }
    }
  }

  // Run the complete sync
  fullClerkSync( options ).catch( error => {
    console.error( "Complete sync failed:", error )
    process.exit( 1 )
  } )
} 