#!/usr/bin/env bun
/**
 * Transform Clerk Dev Export to Migration Script Format
 * 
 * This script converts the Clerk dev export format to the format
 * expected by the official Clerk migration script
 */

import { readFileSync, writeFileSync } from "fs"

interface ClerkDevExport {
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
}

function transformUsers( inputPath: string, outputPath: string ) {
  console.log( "📁 Reading Clerk dev export..." )
  const fileContent = readFileSync( inputPath, 'utf-8' )
  const devUsers: ClerkDevExport[] = JSON.parse( fileContent )

  console.log( `📋 Found ${devUsers.length} users to transform` )

  const migrationUsers: ClerkMigrationUser[] = devUsers.map( user => {
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

    // Handle password data
    if ( user.password_digest && user.password_hasher ) {
      migrationUser.password = user.password_digest
      migrationUser.passwordHasher = user.password_hasher as any
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
}

// Run if called directly
if ( import.meta.main ) {
  const inputPath = process.argv[2] || "./clerk-dev-users.json"
  const outputPath = process.argv[3] || "./clerk-migration-users.json"

  transformUsers( inputPath, outputPath )
}

export { transformUsers }