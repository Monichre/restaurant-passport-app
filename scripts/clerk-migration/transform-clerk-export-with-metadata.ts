#!/usr/bin/env bun
/**
 * Transform Clerk Export (with Metadata) to Migration Script Format
 * 
 * This script converts the full Clerk export (including metadata) to the format
 * expected by the demo migration script, while preserving Supabase relationships
 */

import { readFileSync, writeFileSync } from "fs"

interface ClerkFullExport {
  id: string
  first_name: string
  last_name: string
  username: string
  primary_email_address: string
  primary_phone_number: string
  verified_email_addresses: string
  unverified_email_addresses: string
  verified_phone_numbers: string
  unverified_phone_numbers: string
  totp_secret: string
  password_digest: string
  password_hasher: string
  external_id: string | null
  created_at: number
  updated_at: number
  last_sign_in_at: number | null
  private_metadata: Record<string, any>
  public_metadata: Record<string, any>
  unsafe_metadata: Record<string, any>
  supabase_user_id: string | null
}

interface ClerkMigrationUser {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  password?: string
  passwordHasher?: string
  phoneNumber?: string
  username?: string
  private_metadata?: Record<string, any>
  public_metadata?: Record<string, any>
  unsafe_metadata?: Record<string, any>
}

function transformUsersWithMetadata( inputPath: string, outputPath: string ) {
  console.log( "📁 Reading Clerk full export with metadata..." )
  const fileContent = readFileSync( inputPath, 'utf-8' )
  const fullExportUsers: ClerkFullExport[] = JSON.parse( fileContent )

  console.log( `📋 Found ${fullExportUsers.length} users to transform` )

  const migrationUsers: ClerkMigrationUser[] = fullExportUsers.map( user => {
    const migrationUser: ClerkMigrationUser = {
      // CRITICAL: Preserve the exact user ID from dev
      userId: user.id,
      email: user.primary_email_address,
    }

    // Add optional fields if they exist
    if ( user.first_name ) migrationUser.firstName = user.first_name
    if ( user.last_name ) migrationUser.lastName = user.last_name
    if ( user.username ) migrationUser.username = user.username
    if ( user.primary_phone_number ) migrationUser.phoneNumber = user.primary_phone_number

    // Handle password data (from dashboard export format)
    if ( user.password_digest && user.password_hasher ) {
      migrationUser.password = user.password_digest
      migrationUser.passwordHasher = user.password_hasher as any
    }

    // IMPORTANT: Preserve metadata including Supabase user ID
    if ( user.private_metadata && Object.keys( user.private_metadata ).length > 0 ) {
      migrationUser.private_metadata = user.private_metadata
    }
    if ( user.public_metadata && Object.keys( user.public_metadata ).length > 0 ) {
      migrationUser.public_metadata = user.public_metadata
    }
    if ( user.unsafe_metadata && Object.keys( user.unsafe_metadata ).length > 0 ) {
      migrationUser.unsafe_metadata = user.unsafe_metadata
    }

    return migrationUser
  } )

  // Write the transformed data
  writeFileSync( outputPath, JSON.stringify( migrationUsers, null, 2 ) )
  console.log( `✅ Transformed data written to: ${outputPath}` )

  // Print summary
  console.log( "\n📊 Transformation Summary:" )
  console.log( `- Total users: ${migrationUsers.length}` )
  console.log( `- Users with passwords: ${migrationUsers.filter( u => u.password ).length}` )
  console.log( `- Users with phone numbers: ${migrationUsers.filter( u => u.phoneNumber ).length}` )
  console.log( `- Users with usernames: ${migrationUsers.filter( u => u.username ).length}` )
  console.log( `- Users with Supabase IDs: ${migrationUsers.filter( u => u.private_metadata?.supabaseUserId ).length}` )

  // Show sample of users with Supabase IDs
  const usersWithSupabase = migrationUsers.filter( u => u.private_metadata?.supabaseUserId )
  if ( usersWithSupabase.length > 0 ) {
    console.log( "\n🔗 Sample users with Supabase IDs:" )
    usersWithSupabase.slice( 0, 3 ).forEach( user => {
      console.log( `  - ${user.email}: Supabase ID ${user.private_metadata?.supabaseUserId}` )
    } )
  }

  // Warning if missing Supabase IDs
  const missingSupabaseIds = migrationUsers.filter( u => !u.private_metadata?.supabaseUserId )
  if ( missingSupabaseIds.length > 0 ) {
    console.log( `\n⚠️  WARNING: ${missingSupabaseIds.length} users don't have Supabase IDs` )
    console.log( "These users might not exist in Supabase yet or were created outside the normal flow" )
  }
}

// Run if called directly
if ( import.meta.main ) {
  const inputPath = process.argv[2] || "./clerk-users-full-export.json"
  const outputPath = process.argv[3] || "./users.json"

  transformUsersWithMetadata( inputPath, outputPath )
}

export { transformUsersWithMetadata }