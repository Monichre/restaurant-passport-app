#!/usr/bin/env bun
/**
 * Create mapping between dev Clerk IDs and new production Clerk IDs
 * This is needed to update Supabase clerk_id fields
 */

import { readFileSync, writeFileSync } from 'fs'
import { config } from 'dotenv'

// Load production environment
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"

interface DevUser {
  id: string
  primary_email_address: string
  first_name?: string
  last_name?: string
  supabase_user_id?: string
}

interface ProductionUser {
  id: string
  emailAddresses: Array<{ emailAddress: string }>
  firstName?: string
  lastName?: string
  externalId?: string
}

interface IdMapping {
  dev_clerk_id: string
  prod_clerk_id: string
  email: string
  supabase_user_id?: string
  migrated: boolean
}

async function createIdMapping() {
  console.log( '🔄 Creating ID mapping between dev and production Clerk instances...' )

  // Validate environment
  const secretKey = process.env.CLERK_SECRET_KEY
  if ( !secretKey ) {
    throw new Error( 'CLERK_SECRET_KEY environment variable is required' )
  }

  if ( !secretKey.startsWith( 'sk_live_' ) ) {
    throw new Error( '❌ WRONG CLERK KEY! Expected production key (sk_live_), got: ' + secretKey.substring( 0, 10 ) )
  }

  console.log( '✅ Using production Clerk key' )

  // Read the merged export (original dev users)
  console.log( '📖 Reading original dev user data...' )
  const devUsers: DevUser[] = JSON.parse( readFileSync( './clerk-merged-export.json', 'utf-8' ) )
  console.log( `📊 Found ${devUsers.length} dev users` )

  // Fetch all production users
  console.log( '🌐 Fetching production users from Clerk...' )
  const prodUsers: ProductionUser[] = []
  let offset = 0
  const limit = 100

  while ( true ) {
    const response = await clerkClient.users.getUserList( {
      offset,
      limit,
      orderBy: '+created_at'
    } )

    if ( response.data.length === 0 ) break

    prodUsers.push( ...response.data )
    offset += limit

    console.log( `📥 Fetched ${prodUsers.length} production users...` )

    if ( response.data.length < limit ) break // Last page
  }

  console.log( `✅ Total production users: ${prodUsers.length}` )

  // Create mapping
  const mappings: IdMapping[] = []
  const unmatchedDev: DevUser[] = []
  const unmatchedProd: ProductionUser[] = [...prodUsers]

  for ( const devUser of devUsers ) {
    // Find matching production user by email
    const prodUserIndex = unmatchedProd.findIndex( prod =>
      prod.emailAddresses.some( email =>
        email.emailAddress.toLowerCase() === devUser.primary_email_address.toLowerCase()
      )
    )

    if ( prodUserIndex !== -1 ) {
      const prodUser = unmatchedProd[prodUserIndex]
      unmatchedProd.splice( prodUserIndex, 1 ) // Remove from unmatched

      mappings.push( {
        dev_clerk_id: devUser.id,
        prod_clerk_id: prodUser.id,
        email: devUser.primary_email_address,
        supabase_user_id: devUser.supabase_user_id,
        migrated: true
      } )
    } else {
      // Dev user didn't migrate successfully
      mappings.push( {
        dev_clerk_id: devUser.id,
        prod_clerk_id: '', // No production ID
        email: devUser.primary_email_address,
        supabase_user_id: devUser.supabase_user_id,
        migrated: false
      } )
      unmatchedDev.push( devUser )
    }
  }

  // Write mapping file
  const outputFile = './dev-to-prod-id-mapping.json'
  writeFileSync( outputFile, JSON.stringify( mappings, null, 2 ) )

  // Write summary file
  const summary = {
    total_dev_users: devUsers.length,
    total_prod_users: prodUsers.length,
    successful_migrations: mappings.filter( m => m.migrated ).length,
    failed_migrations: mappings.filter( m => !m.migrated ).length,
    unmatched_production: unmatchedProd.length,
    mappings_with_supabase_ids: mappings.filter( m => m.supabase_user_id ).length
  }

  writeFileSync( './migration-summary.json', JSON.stringify( summary, null, 2 ) )

  // Report results
  console.log( '\n✅ ID Mapping Complete!' )
  console.log( '📁 Files created:' )
  console.log( `   - ${outputFile}` )
  console.log( `   - ./migration-summary.json` )
  console.log( '\n📊 Summary:' )
  console.log( `   ✅ Successful migrations: ${summary.successful_migrations}` )
  console.log( `   ❌ Failed migrations: ${summary.failed_migrations}` )
  console.log( `   🗄️  Users with Supabase IDs: ${summary.mappings_with_supabase_ids}` )
  console.log( `   🔗 Production users unmatched: ${summary.unmatched_production}` )

  if ( unmatchedDev.length > 0 ) {
    console.log( `\n⚠️  Failed to migrate ${unmatchedDev.length} users:` )
    unmatchedDev.slice( 0, 5 ).forEach( user =>
      console.log( `   - ${user.primary_email_address} (${user.id})` )
    )
    if ( unmatchedDev.length > 5 ) {
      console.log( `   ... and ${unmatchedDev.length - 5} more` )
    }
  }

  return summary
}

// Main execution
if ( require.main === module ) {
  createIdMapping()
    .then( ( summary ) => {
      console.log( `\n🎉 Ready for Supabase update! ${summary.mappings_with_supabase_ids} users need clerk_id updates.` )
    } )
    .catch( ( error ) => {
      console.error( '❌ Error creating ID mapping:', error )
      process.exit( 1 )
    } )
}