#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs'

console.log( "🚀 Starting transformation test..." )

try {
  const data = readFileSync( './clerk-merged-export.json', 'utf-8' )
  console.log( `📁 Successfully read file, size: ${data.length} characters` )

  const parsed = JSON.parse( data )
  console.log( `📊 Parsed ${parsed.length} users` )

  // Simple transformation
  const migrated = parsed.map( ( user: any ) => ( {
    userId: user.id,
    email: user.primary_email_address,
    firstName: user.first_name || undefined,
    lastName: user.last_name || undefined,
    password: user.password_digest || undefined,
    passwordHasher: user.password_hasher || undefined,
    private_metadata: user.private_metadata || undefined,
    public_metadata: user.public_metadata || undefined,
    unsafe_metadata: user.unsafe_metadata || undefined
  } ) )

  writeFileSync( './users-for-migration.json', JSON.stringify( migrated, null, 2 ) )
  console.log( `✅ Created users-for-migration.json with ${migrated.length} users` )

} catch ( error ) {
  console.error( '❌ Error:', error )
}