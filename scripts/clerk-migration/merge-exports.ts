#!/usr/bin/env bun
/**
 * Merge Dashboard Export with API Export
 * 
 * This script combines the dashboard export (which has passwords) with the 
 * API export (which has metadata) to create the complete migration data
 */

import { readFileSync, writeFileSync } from "fs"

interface DashboardUser {
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

interface APIUser {
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

interface MergedUser extends APIUser {
  // This will have password data from dashboard + metadata from API
}

function mergeExports( dashboardPath: string, apiPath: string, outputPath: string ) {
  console.log( "🔄 Merging Dashboard export with API export...\n" )

  // Read both exports
  console.log( "📁 Reading dashboard export..." )
  const dashboardData = readFileSync( dashboardPath, 'utf-8' )
  const dashboardUsers: DashboardUser[] = JSON.parse( dashboardData )
  console.log( `✅ Found ${dashboardUsers.length} users in dashboard export` )

  console.log( "\n📁 Reading API export..." )
  const apiData = readFileSync( apiPath, 'utf-8' )
  const apiUsers: APIUser[] = JSON.parse( apiData )
  console.log( `✅ Found ${apiUsers.length} users in API export` )

  // Create maps for efficient lookup
  const dashboardMap = new Map( dashboardUsers.map( u => [u.id, u] ) )
  const apiMap = new Map( apiUsers.map( u => [u.id, u] ) )

  // Start with API users (has metadata) and overlay dashboard data (has passwords)
  const mergedUsers: MergedUser[] = []
  const stats = {
    total: 0,
    withPasswords: 0,
    withMetadata: 0,
    withBoth: 0,
    apiOnly: 0,
    dashboardOnly: 0
  }

  console.log( "\n🔗 Merging user data..." )

  // Process all unique user IDs from both sources
  const allUserIds = new Set( [...dashboardMap.keys(), ...apiMap.keys()] )

  for ( const userId of allUserIds ) {
    const dashboardUser = dashboardMap.get( userId )
    const apiUser = apiMap.get( userId )

    stats.total++

    if ( apiUser && dashboardUser ) {
      // Perfect match - merge both
      const mergedUser: MergedUser = {
        ...apiUser, // Start with API data (has metadata)
        // Overlay dashboard password data
        password_digest: dashboardUser.password_digest || "",
        password_hasher: dashboardUser.password_hasher || "",
        // Keep other dashboard fields that might be more accurate
        verified_email_addresses: dashboardUser.verified_email_addresses,
        unverified_email_addresses: dashboardUser.unverified_email_addresses,
        verified_phone_numbers: dashboardUser.verified_phone_numbers,
        unverified_phone_numbers: dashboardUser.unverified_phone_numbers,
      }

      mergedUsers.push( mergedUser )

      if ( dashboardUser.password_digest ) stats.withPasswords++
      if ( Object.keys( apiUser.private_metadata || {} ).length > 0 ) stats.withMetadata++
      if ( dashboardUser.password_digest && Object.keys( apiUser.private_metadata || {} ).length > 0 ) stats.withBoth++

    } else if ( apiUser ) {
      // API only - keep as is (no password but has metadata)
      mergedUsers.push( apiUser )
      stats.apiOnly++
      if ( Object.keys( apiUser.private_metadata || {} ).length > 0 ) stats.withMetadata++

    } else if ( dashboardUser ) {
      // Dashboard only - convert to merged format
      const mergedUser: MergedUser = {
        id: dashboardUser.id,
        first_name: dashboardUser.first_name,
        last_name: dashboardUser.last_name,
        username: dashboardUser.username,
        primary_email_address: dashboardUser.primary_email_address,
        primary_phone_number: dashboardUser.primary_phone_number,
        verified_email_addresses: dashboardUser.verified_email_addresses,
        unverified_email_addresses: dashboardUser.unverified_email_addresses,
        verified_phone_numbers: dashboardUser.verified_phone_numbers,
        unverified_phone_numbers: dashboardUser.unverified_phone_numbers,
        totp_secret: dashboardUser.totp_secret,
        password_digest: dashboardUser.password_digest,
        password_hasher: dashboardUser.password_hasher,
        external_id: null,
        created_at: 0, // Not available from dashboard
        updated_at: 0,
        last_sign_in_at: null,
        private_metadata: {},
        public_metadata: {},
        unsafe_metadata: {},
        supabase_user_id: null
      }

      mergedUsers.push( mergedUser )
      stats.dashboardOnly++
      if ( dashboardUser.password_digest ) stats.withPasswords++
    }
  }

  // Sort by user ID for consistency
  mergedUsers.sort( ( a, b ) => a.id.localeCompare( b.id ) )

  // Save merged export
  writeFileSync( outputPath, JSON.stringify( mergedUsers, null, 2 ) )
  console.log( `\n💾 Merged export saved to: ${outputPath}` )

  // Print detailed statistics
  console.log( "\n📊 === MERGE RESULTS ===" )
  console.log( `Total users: ${stats.total}` )
  console.log( `Users with passwords: ${stats.withPasswords}` )
  console.log( `Users with metadata: ${stats.withMetadata}` )
  console.log( `Users with BOTH: ${stats.withBoth}` )
  console.log( `API only (no password): ${stats.apiOnly}` )
  console.log( `Dashboard only (no metadata): ${stats.dashboardOnly}` )

  // Show password coverage
  const passwordCoverage = ( ( stats.withPasswords / stats.total ) * 100 ).toFixed( 1 )
  const metadataCoverage = ( ( stats.withMetadata / stats.total ) * 100 ).toFixed( 1 )

  console.log( `\n📈 Coverage:` )
  console.log( `Password coverage: ${passwordCoverage}%` )
  console.log( `Metadata coverage: ${metadataCoverage}%` )

  if ( stats.withBoth > 0 ) {
    console.log( `\n🎉 ${stats.withBoth} users have BOTH passwords AND metadata!` )
  }

  if ( stats.apiOnly > 0 ) {
    console.log( `\n⚠️  ${stats.apiOnly} users from API only (no passwords - they'll need to reset)` )
  }

  if ( stats.dashboardOnly > 0 ) {
    console.log( `\n⚠️  ${stats.dashboardOnly} users from dashboard only (no metadata - won't have Supabase links)` )
  }

  return mergedUsers
}

// Run if called directly
if ( import.meta.main ) {
  const dashboardPath = process.argv[2] || "../../clerk-dev-users.json"
  const apiPath = process.argv[3] || "./clerk-users-full-export.json"
  const outputPath = process.argv[4] || "./clerk-merged-export.json"

  try {
    mergeExports( dashboardPath, apiPath, outputPath )
    console.log( "\n✅ Merge completed successfully!" )
  } catch ( error ) {
    console.error( "💥 Error during merge:", error )
    process.exit( 1 )
  }
}

export { mergeExports }