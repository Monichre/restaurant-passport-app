#!/usr/bin/env bun
/**
 * Update Supabase users.clerk_id using production Clerk privateMetadata.supabaseUserId
 * This is much more reliable than email matching!
 */

import { config } from 'dotenv'
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"
import { createClient } from '@supabase/supabase-js'

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient( supabaseUrl, supabaseServiceKey )

interface UpdateRecord {
  supabase_user_id: string
  new_clerk_id: string
  email: string
}

async function updateSupabaseClerkIds() {
  console.log( '🔄 Updating Supabase clerk_id fields using Clerk metadata...' )

  // Validate environment
  const clerkKey = process.env.CLERK_SECRET_KEY
  if ( !clerkKey || !clerkKey.startsWith( 'sk_live_' ) ) {
    throw new Error( '❌ Production Clerk key required' )
  }

  if ( !supabaseUrl || !supabaseServiceKey ) {
    throw new Error( '❌ Supabase credentials required' )
  }

  console.log( '✅ Using production Clerk key' )
  console.log( '✅ Connected to Supabase' )

  // Fetch all production Clerk users
  console.log( '🌐 Fetching all production Clerk users...' )
  const allUsers = []
  let offset = 0

  while ( true ) {
    const response = await clerkClient.users.getUserList( {
      offset,
      limit: 100,
      orderBy: '+created_at'
    } )

    if ( response.data.length === 0 ) break
    allUsers.push( ...response.data )
    offset += 100
    console.log( `   Fetched ${allUsers.length} users...` )

    if ( response.data.length < 100 ) break
  }

  console.log( `📥 Total production users: ${allUsers.length}` )

  // Extract users with supabaseUserId metadata
  const usersWithSupabaseIds: UpdateRecord[] = []

  for ( const user of allUsers ) {
    const supabaseUserId = user.privateMetadata?.supabaseUserId || user.privateMetadata?.databaseId

    if ( supabaseUserId ) {
      usersWithSupabaseIds.push( {
        supabase_user_id: supabaseUserId.toString(),
        new_clerk_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || 'no-email'
      } )
    }
  }

  console.log( `\n🎯 Found ${usersWithSupabaseIds.length} users with Supabase IDs` )

  if ( usersWithSupabaseIds.length === 0 ) {
    console.log( '❌ No users with supabaseUserId metadata found!' )
    return
  }

  // Show first few for verification
  console.log( '\n📋 Sample updates:' )
  usersWithSupabaseIds.slice( 0, 3 ).forEach( ( record, i ) => {
    console.log( `${i + 1}. User ID ${record.supabase_user_id} → Clerk ID ${record.new_clerk_id} (${record.email})` )
  } )

  // Update Supabase in batches
  console.log( `\n🔄 Updating ${usersWithSupabaseIds.length} Supabase records...` )

  let successful = 0
  let failed = 0

  for ( const record of usersWithSupabaseIds ) {
    try {
      const { error } = await supabase
        .from( 'users' )
        .update( { clerk_id: record.new_clerk_id } )
        .eq( 'id', parseInt( record.supabase_user_id ) )

      if ( error ) {
        console.log( `❌ Failed to update user ${record.supabase_user_id}: ${error.message}` )
        failed++
      } else {
        successful++
        if ( successful % 10 === 0 ) {
          console.log( `   Updated ${successful}/${usersWithSupabaseIds.length} records...` )
        }
      }

    } catch ( error ) {
      console.log( `❌ Error updating user ${record.supabase_user_id}: ${error}` )
      failed++
    }
  }

  console.log( '\n✅ Supabase update complete!' )
  console.log( `✅ Successfully updated: ${successful}` )
  console.log( `❌ Failed updates: ${failed}` )
  console.log( `📊 Success rate: ${Math.round( successful / usersWithSupabaseIds.length * 100 )}%` )

  // Verify a few updates
  console.log( '\n🔍 Verification - checking first 3 updates:' )
  for ( let i = 0; i < Math.min( 3, usersWithSupabaseIds.length ); i++ ) {
    const record = usersWithSupabaseIds[i]

    const { data, error } = await supabase
      .from( 'users' )
      .select( 'id, clerk_id, email' )
      .eq( 'id', parseInt( record.supabase_user_id ) )
      .single()

    if ( data ) {
      const isCorrect = data.clerk_id === record.new_clerk_id
      console.log( `${isCorrect ? '✅' : '❌'} User ${data.id}: ${data.clerk_id} (${data.email})` )
    }
  }

  return { successful, failed, total: usersWithSupabaseIds.length }
}

// Main execution
updateSupabaseClerkIds()
  .then( ( { successful, failed, total } ) => {
    if ( failed === 0 ) {
      console.log( '\n🎉 PERFECT! All Supabase records updated successfully!' )
      console.log( '✅ Migration complete - users can now sign in with production Clerk!' )
    } else {
      console.log( `\n⚠️  ${successful}/${total} records updated. ${failed} failed.` )
    }
  } )
  .catch( ( error ) => {
    console.error( '❌ Error during Supabase update:', error )
    process.exit( 1 )
  } )