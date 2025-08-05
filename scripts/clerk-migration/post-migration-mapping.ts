#!/usr/bin/env bun
/**
 * Post-Migration ID Mapping
 * 
 * After migrating to production Clerk, this script helps create a mapping
 * between dev Clerk IDs and new production Clerk IDs
 */

import { readFileSync, writeFileSync } from "fs"

interface SupabaseUser {
  id: number
  clerk_id: string
  dev_clerk_id: string
  email: string
}

interface MigrationUser {
  userId: string  // This is the dev ID
  email: string
}

interface IdMapping {
  dev_clerk_id: string
  email: string
  new_prod_clerk_id: string | null
  supabase_id: number | null
}

async function createIdMapping() {
  console.log( "🔍 Creating ID mapping for post-migration update...\n" )

  try {
    // 1. Read Supabase export
    console.log( "📁 Reading Supabase export..." )
    const supabaseData = readFileSync( "../../supabase-users-export.json", 'utf-8' )
    const supabaseUsers: SupabaseUser[] = JSON.parse( supabaseData )
    console.log( `✅ Found ${supabaseUsers.length} users in Supabase` )

    // 2. Read migration data
    console.log( "\n📁 Reading migration data..." )
    const migrationData = readFileSync( "./users.json", 'utf-8' )
    const migrationUsers: MigrationUser[] = JSON.parse( migrationData )
    console.log( `✅ Found ${migrationUsers.length} users in migration file` )

    // 3. Create email-based maps
    const supabaseByEmail = new Map(
      supabaseUsers.map( u => [u.email.toLowerCase(), u] )
    )
    const migrationByEmail = new Map(
      migrationUsers.map( u => [u.email.toLowerCase(), u] )
    )

    // 4. Build the mapping
    console.log( "\n🔗 Building ID mapping..." )
    const mappings: IdMapping[] = []

    for ( const [email, migrationUser] of migrationByEmail ) {
      const supabaseUser = supabaseByEmail.get( email )

      mappings.push( {
        dev_clerk_id: migrationUser.userId,
        email: email,
        new_prod_clerk_id: null, // To be filled after checking Clerk
        supabase_id: supabaseUser?.id || null
      } )
    }

    // 5. Save mapping file
    const outputPath = "./clerk-id-mapping.json"
    writeFileSync( outputPath, JSON.stringify( mappings, null, 2 ) )
    console.log( `\n✅ Mapping saved to: ${outputPath}` )

    // 6. Print summary
    console.log( "\n📊 Mapping Summary:" )
    console.log( `- Total mappings: ${mappings.length}` )
    console.log( `- Matched with Supabase: ${mappings.filter( m => m.supabase_id ).length}` )
    console.log( `- Not in Supabase: ${mappings.filter( m => !m.supabase_id ).length}` )

    // 7. Show instructions
    console.log( "\n📝 Next Steps:" )
    console.log( "1. After Clerk migration completes, use Clerk API to find new production IDs" )
    console.log( "2. Update the 'new_prod_clerk_id' field in the mapping file" )
    console.log( "3. Use the mapping to update Supabase clerk_id fields" )
    console.log( "\nExample Clerk API call to find user by externalId:" )
    console.log( `
const client = await clerkClient()
const users = await client.users.getUserList({ 
  externalId: ['user_2su5eFUSw9IPPmzZAxT6s8VFOnY'] 
})
const newProdId = users.data[0]?.id
`)

  } catch ( error ) {
    console.error( "❌ Error creating mapping:", error )
  }
}

// Run if called directly
if ( import.meta.main ) {
  createIdMapping()
}

export { createIdMapping }