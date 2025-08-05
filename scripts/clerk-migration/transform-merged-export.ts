#!/usr/bin/env bun
/**
 * Transform the merged Clerk export (clerk-merged-export.json) 
 * to the format expected by demo-migration-script.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Type definitions for the merged export format
interface MergedClerkUser {
  id: string
  first_name: string
  last_name: string
  username?: string
  primary_email_address: string
  password_digest?: string
  password_hasher?: string
  private_metadata?: Record<string, any>
  public_metadata?: Record<string, any>
  unsafe_metadata?: Record<string, any>
  supabase_user_id?: string
}

// Type definitions for demo-migration-script format
interface MigrationUser {
  userId: string           // Will use original Clerk ID as externalId
  email: string
  firstName?: string
  lastName?: string
  password?: string        // password_digest
  passwordHasher?: string
  private_metadata?: Record<string, any>
  public_metadata?: Record<string, any>
  unsafe_metadata?: Record<string, any>
}

function transformMergedExport( inputFile: string, outputFile: string ) {
  console.log( `🔄 Reading merged export from: ${inputFile}` )

  // Read the merged export
  const mergedData: MergedClerkUser[] = JSON.parse( readFileSync( inputFile, 'utf-8' ) )
  console.log( `📊 Found ${mergedData.length} users in merged export` )

  const migrationUsers: MigrationUser[] = []
  let passwordCount = 0
  let metadataCount = 0

  for ( const user of mergedData ) {
    // Skip users without email (shouldn't happen but safety check)
    if ( !user.primary_email_address ) {
      console.warn( `⚠️  Skipping user ${user.id} - no email address` )
      continue
    }

    const migrationUser: MigrationUser = {
      // Use original Clerk ID as externalId for tracking
      userId: user.id,
      email: user.primary_email_address,
      firstName: user.first_name || undefined,
      lastName: user.last_name || undefined
    }

    // Add password if available
    if ( user.password_digest && user.password_hasher ) {
      migrationUser.password = user.password_digest
      migrationUser.passwordHasher = user.password_hasher
      passwordCount++
    }

    // Preserve all metadata
    if ( user.private_metadata && Object.keys( user.private_metadata ).length > 0 ) {
      migrationUser.private_metadata = user.private_metadata
      metadataCount++
    }

    if ( user.public_metadata && Object.keys( user.public_metadata ).length > 0 ) {
      migrationUser.public_metadata = user.public_metadata
    }

    if ( user.unsafe_metadata && Object.keys( user.unsafe_metadata ).length > 0 ) {
      migrationUser.unsafe_metadata = user.unsafe_metadata
    }

    migrationUsers.push( migrationUser )
  }

  // Write the migration file
  writeFileSync( outputFile, JSON.stringify( migrationUsers, null, 2 ) )

  // Stats
  console.log( `\n✅ Transformation Complete!` )
  console.log( `📁 Output file: ${outputFile}` )
  console.log( `👥 Total users: ${migrationUsers.length}` )
  console.log( `🔑 Users with passwords: ${passwordCount}` )
  console.log( `🏷️  Users with metadata: ${metadataCount}` )

  // Check for users without passwords
  const withoutPasswords = migrationUsers.filter( u => !u.password )
  if ( withoutPasswords.length > 0 ) {
    console.log( `\n⚠️  ${withoutPasswords.length} users without passwords (will use skipPasswordRequirement):` )
    withoutPasswords.slice( 0, 5 ).forEach( u => console.log( `   - ${u.email}` ) )
    if ( withoutPasswords.length > 5 ) {
      console.log( `   ... and ${withoutPasswords.length - 5} more` )
    }
  }

  // Check for users with Supabase IDs
  const withSupabaseIds = migrationUsers.filter( u => u.private_metadata?.supabaseUserId )
  console.log( `🗄️  Users with Supabase IDs: ${withSupabaseIds.length}` )

  return migrationUsers.length
}

// Main execution
const args = process.argv.slice( 2 )

if ( args.length !== 2 ) {
  console.error( 'Usage: bun run transform-merged-export.ts <input-file> <output-file>' )
  console.error( 'Example: bun run transform-merged-export.ts ./clerk-merged-export.json ./users-for-migration.json' )
  process.exit( 1 )
}

const [inputFile, outputFile] = args

try {
  transformMergedExport( inputFile, outputFile )
  console.log( `\n🎉 Ready for migration! Run the demo-migration-script.ts with: ${outputFile}` )
} catch ( error ) {
  console.error( '❌ Transformation failed:', error )
  process.exit( 1 )
}