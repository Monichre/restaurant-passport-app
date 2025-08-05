#!/usr/bin/env bun
/**
 * Export Clerk Users with Full Metadata
 * 
 * This script exports all users from Clerk including their private metadata
 * which contains the Supabase user IDs
 */

import { clerkClient } from "@clerk/nextjs/server"
import { writeFileSync } from "fs"

interface ClerkUserExport {
  id: string
  firstName: string | null
  lastName: string | null
  username: string | null
  primaryEmailAddress: string | null
  primaryPhoneNumber: string | null
  emailAddresses: Array<{
    id: string
    emailAddress: string
    verification: any
  }>
  phoneNumbers: Array<{
    id: string
    phoneNumber: string
    verification: any
  }>
  passwordEnabled: boolean
  twoFactorEnabled: boolean
  externalId: string | null
  createdAt: number
  updatedAt: number
  lastSignInAt: number | null
  privateMetadata: Record<string, any>
  publicMetadata: Record<string, any>
  unsafeMetadata: Record<string, any>
}

async function exportClerkUsers() {
  console.log( "🚀 Starting Clerk DEV instance user export with metadata...\n" )

  // Validate we're connecting to DEV instance
  const secretKey = process.env.CLERK_SECRET_KEY
  if ( !secretKey ) {
    throw new Error( "CLERK_SECRET_KEY environment variable is required" )
  }

  if ( !secretKey.startsWith( 'sk_test_' ) ) {
    throw new Error( `
❌ WRONG CLERK KEY! 
Expected: DEV instance key (starts with 'sk_test_')
Got: ${secretKey.substring( 0, 10 )}...

Make sure you're using your DEV instance secret key, not production!
    ` )
  }

  console.log( "✅ Confirmed: Using DEV instance key" )

  try {
    const client = await clerkClient()
    const allUsers: ClerkUserExport[] = []
    let hasMore = true
    let offset = 0
    const limit = 100 // Max allowed by Clerk API

    console.log( "📡 Fetching users from Clerk..." )

    while ( hasMore ) {
      const response = await client.users.getUserList( {
        limit,
        offset,
        orderBy: 'created_at'
      } )

      allUsers.push( ...response.data as any )
      console.log( `  Fetched ${response.data.length} users (total: ${allUsers.length})` )

      hasMore = response.data.length === limit
      offset += limit

      // Small delay to avoid rate limits
      if ( hasMore ) {
        await new Promise( resolve => setTimeout( resolve, 100 ) )
      }
    }

    console.log( `\n✅ Total users fetched: ${allUsers.length}` )

    // Create a simplified export format similar to the dashboard export
    // but with metadata included
    const exportData = allUsers.map( user => ( {
      // Core fields matching dashboard export
      id: user.id,
      first_name: user.firstName || '',
      last_name: user.lastName || '',
      username: user.username || '',
      primary_email_address: user.emailAddresses[0]?.emailAddress || '',
      primary_phone_number: user.phoneNumbers[0]?.phoneNumber || '',
      verified_email_addresses: user.emailAddresses
        .filter( e => e.verification?.status === 'verified' )
        .map( e => e.emailAddress )
        .join( ',' ),
      unverified_email_addresses: user.emailAddresses
        .filter( e => e.verification?.status !== 'verified' )
        .map( e => e.emailAddress )
        .join( ',' ),
      verified_phone_numbers: user.phoneNumbers
        .filter( p => p.verification?.status === 'verified' )
        .map( p => p.phoneNumber )
        .join( ',' ),
      unverified_phone_numbers: user.phoneNumbers
        .filter( p => p.verification?.status !== 'verified' )
        .map( p => p.phoneNumber )
        .join( ',' ),
      totp_secret: user.twoFactorEnabled ? 'enabled' : '',
      password_digest: '', // Not available via API
      password_hasher: '', // Not available via API

      // Additional metadata fields
      external_id: user.externalId,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      last_sign_in_at: user.lastSignInAt,
      private_metadata: user.privateMetadata,
      public_metadata: user.publicMetadata,
      unsafe_metadata: user.unsafeMetadata,

      // Specifically extract Supabase ID if present
      supabase_user_id: user.privateMetadata?.supabaseUserId || null
    } ) )

    // Save full export
    const fullExportPath = './clerk-users-full-export.json'
    writeFileSync( fullExportPath, JSON.stringify( exportData, null, 2 ) )
    console.log( `\n💾 Full export saved to: ${fullExportPath}` )

    // Create ID mapping file
    const idMapping = exportData
      .filter( user => user.supabase_user_id )
      .map( user => ( {
        clerk_id: user.id,
        email: user.primary_email_address,
        supabase_user_id: user.supabase_user_id,
        name: `${user.first_name} ${user.last_name}`.trim() || user.primary_email_address
      } ) )

    const mappingPath = './clerk-supabase-id-mapping.json'
    writeFileSync( mappingPath, JSON.stringify( idMapping, null, 2 ) )
    console.log( `💾 ID mapping saved to: ${mappingPath}` )

    // Print summary
    console.log( "\n📊 Export Summary:" )
    console.log( `- Total users: ${exportData.length}` )
    console.log( `- Users with Supabase IDs: ${idMapping.length}` )
    console.log( `- Users without Supabase IDs: ${exportData.length - idMapping.length}` )

    // Show sample of users with Supabase IDs
    if ( idMapping.length > 0 ) {
      console.log( "\n🔗 Sample users with Supabase IDs:" )
      idMapping.slice( 0, 3 ).forEach( user => {
        console.log( `  - ${user.email}: Clerk ${user.clerk_id} → Supabase ${user.supabase_user_id}` )
      } )
    }

    // Check for users in your original export (if it exists)
    console.log( "\n🔍 Checking against original export..." )
    try {
      const originalExport = require( '../../clerk-dev-users.json' )
      const originalIds = new Set( originalExport.map( ( u: any ) => u.id ) )
      const currentIds = new Set( exportData.map( u => u.id ) )

      const missingFromCurrent = [...originalIds].filter( id => !currentIds.has( id ) )
      const newInCurrent = [...currentIds].filter( id => !originalIds.has( id ) )

      if ( missingFromCurrent.length > 0 ) {
        console.log( `\n⚠️  Users in original export but not current: ${missingFromCurrent.length}` )
        missingFromCurrent.forEach( id => {
          const user = originalExport.find( ( u: any ) => u.id === id )
          console.log( `  - ${id} (${user?.primary_email_address})` )
        } )
      }

      if ( newInCurrent.length > 0 ) {
        console.log( `\n📌 New users since original export: ${newInCurrent.length}` )
      }

      if ( missingFromCurrent.length === 0 && newInCurrent.length === 0 ) {
        console.log( "✅ User list matches original export exactly" )
      }
    } catch ( error ) {
      console.log( "📋 Original export file not found - using live data as source of truth" )
      console.log( `✅ Exported ${exportData.length} users from current DEV instance` )
    }

  } catch ( error ) {
    console.error( "❌ Error exporting users:", error )
    console.error( "\n💡 Make sure you have:" )
    console.error( "  - CLERK_SECRET_KEY environment variable set" )
    console.error( "  - The key is for your dev instance" )
    console.error( "  - Network access to Clerk API" )
  }
}

// Run if called directly
if ( import.meta.main ) {
  exportClerkUsers()
}

export { exportClerkUsers }