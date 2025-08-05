#!/usr/bin/env bun
/**
 * Simple ID mapping between dev and production Clerk IDs
 */

import { config } from 'dotenv'
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"
import { readFileSync, writeFileSync } from 'fs'

async function createSimpleIdMapping() {
  console.log( '🔄 Creating dev-to-prod ID mapping...' )

  // Read the merged export (original dev users)
  const devUsers = JSON.parse( readFileSync( './clerk-merged-export.json', 'utf-8' ) )
  console.log( `📖 Dev users: ${devUsers.length}` )

  // Fetch all production users
  console.log( '🌐 Fetching production users...' )
  const prodUsers = []
  let offset = 0

  while ( true ) {
    const response = await clerkClient.users.getUserList( {
      offset,
      limit: 100,
      orderBy: '+created_at'
    } )

    if ( response.data.length === 0 ) break
    prodUsers.push( ...response.data )
    offset += 100

    if ( response.data.length < 100 ) break
  }

  console.log( `📥 Production users: ${prodUsers.length}` )

  // Create simple mapping
  const mappings = []

  for ( const devUser of devUsers ) {
    const email = devUser.primary_email_address

    // Find matching production user
    const prodUser = prodUsers.find( p =>
      p.emailAddresses.some( e =>
        e.emailAddress.toLowerCase() === email.toLowerCase()
      )
    )

    if ( prodUser ) {
      mappings.push( {
        dev_clerk_id: devUser.id,
        prod_clerk_id: prodUser.id,
        email: email,
        supabase_user_id: devUser.supabase_user_id || null,
        migrated: true
      } )
    } else {
      mappings.push( {
        dev_clerk_id: devUser.id,
        prod_clerk_id: null,
        email: email,
        supabase_user_id: devUser.supabase_user_id || null,
        migrated: false
      } )
    }
  }

  // Write mapping
  writeFileSync( './dev-to-prod-mapping.json', JSON.stringify( mappings, null, 2 ) )

  // Stats
  const successful = mappings.filter( m => m.migrated ).length
  const failed = mappings.filter( m => !m.migrated ).length
  const withSupabase = mappings.filter( m => m.supabase_user_id ).length

  console.log( '\n✅ Mapping complete!' )
  console.log( `📁 File: ./dev-to-prod-mapping.json` )
  console.log( `✅ Successful mappings: ${successful}` )
  console.log( `❌ Failed mappings: ${failed}` )
  console.log( `🗄️  Users with Supabase IDs: ${withSupabase}` )

  return mappings
}

createSimpleIdMapping()
  .then( ( mappings ) => {
    console.log( `\n🎉 Ready for Supabase update!` )
  } )
  .catch( ( error ) => {
    console.error( '❌ Error:', error )
    process.exit( 1 )
  } )