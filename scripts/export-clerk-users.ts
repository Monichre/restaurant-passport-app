#!/usr/bin/env bun
/**
 * Export All Users from Clerk
 * 
 * This script fetches all users from Clerk using pagination and saves them
 * to a JSON file for processing or backup purposes.
 */

import { clerkClient } from "@clerk/nextjs/server"
import { writeFileSync } from "fs"
import { resolve } from "path"

interface ClerkUserExport {
  id: string
  emailAddresses: Array<{
    emailAddress: string
    id: string
    verification?: any
  }>
  phoneNumbers?: Array<{
    phoneNumber: string
    id: string
  }>
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string
  hasImage?: boolean
  username?: string | null
  createdAt: number
  updatedAt: number
  lastSignInAt?: number | null
  publicMetadata?: Record<string, any>
  privateMetadata?: Record<string, any>
  unsafeMetadata?: Record<string, any>
}

interface ExportOptions {
  outputFile?: string
  includeMetadata?: boolean
  limit?: number
  verbose?: boolean
}

/**
 * Fetch all users from Clerk with pagination
 */
async function fetchAllClerkUsers( options: ExportOptions = {} ): Promise<ClerkUserExport[]> {
  const { limit, verbose = true } = options
  const allUsers: ClerkUserExport[] = []
  const client = await clerkClient()

  let offset = 0
  const pageSize = 100 // Clerk's max page size
  let hasMore = true

  console.log( "🔄 Fetching users from Clerk..." )

  while ( hasMore ) {
    try {
      if ( verbose ) {
        console.log( `📄 Fetching page ${Math.floor( offset / pageSize ) + 1} (offset: ${offset})` )
      }

      const response = await client.users.getUserList( {
        limit: pageSize,
        offset: offset,
        orderBy: "-created_at" // Most recent first
      } )

      const users = response.data

      if ( users.length === 0 ) {
        hasMore = false
        break
      }

      // Transform and filter user data
      const transformedUsers: ClerkUserExport[] = users.map( user => ( {
        id: user.id,
        emailAddresses: user.emailAddresses.map( email => ( {
          emailAddress: email.emailAddress,
          id: email.id,
          verification: email.verification
        } ) ),
        phoneNumbers: user.phoneNumbers?.map( phone => ( {
          phoneNumber: phone.phoneNumber,
          id: phone.id
        } ) ),
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        hasImage: user.hasImage,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastSignInAt: user.lastSignInAt,
        ...( options.includeMetadata && {
          publicMetadata: user.publicMetadata,
          privateMetadata: user.privateMetadata,
          unsafeMetadata: user.unsafeMetadata
        } )
      } ) )

      allUsers.push( ...transformedUsers )

      if ( verbose ) {
        console.log( `✅ Fetched ${users.length} users (total: ${allUsers.length})` )
      }

      // Check if we've hit the limit
      if ( limit && allUsers.length >= limit ) {
        allUsers.splice( limit ) // Trim to exact limit
        hasMore = false
        break
      }

      // Check if we've reached the end
      if ( users.length < pageSize ) {
        hasMore = false
      } else {
        offset += pageSize
      }

      // Add a small delay to avoid rate limiting
      await new Promise( resolve => setTimeout( resolve, 100 ) )

    } catch ( error ) {
      console.error( `❌ Error fetching users at offset ${offset}:`, error )
      throw error
    }
  }

  console.log( `📊 Total users fetched: ${allUsers.length}` )
  return allUsers
}

/**
 * Save users to JSON file
 */
function saveUsersToFile( users: ClerkUserExport[], outputFile: string ): void {
  try {
    const filePath = resolve( outputFile )
    const jsonData = JSON.stringify( users, null, 2 )

    writeFileSync( filePath, jsonData, 'utf-8' )
    console.log( `💾 Saved ${users.length} users to: ${filePath}` )
    console.log( `📁 File size: ${Math.round( jsonData.length / 1024 )} KB` )
  } catch ( error ) {
    console.error( "❌ Error saving file:", error )
    throw error
  }
}

/**
 * Print user statistics
 */
function printUserStats( users: ClerkUserExport[] ): void {
  console.log( "\n📊 === USER STATISTICS ===" )
  console.log( `👥 Total Users: ${users.length}` )

  // Count users with/without email
  const usersWithEmail = users.filter( u => u.emailAddresses.length > 0 )
  const usersWithoutEmail = users.filter( u => u.emailAddresses.length === 0 )
  console.log( `📧 Users with email: ${usersWithEmail.length}` )
  console.log( `❌ Users without email: ${usersWithoutEmail.length}` )

  // Count users with names
  const usersWithFirstName = users.filter( u => u.firstName )
  const usersWithLastName = users.filter( u => u.lastName )
  const usersWithBothNames = users.filter( u => u.firstName && u.lastName )
  console.log( `👤 Users with first name: ${usersWithFirstName.length}` )
  console.log( `👤 Users with last name: ${usersWithLastName.length}` )
  console.log( `👤 Users with both names: ${usersWithBothNames.length}` )

  // Recent activity
  const now = Date.now()
  const last30Days = users.filter( u => u.lastSignInAt && ( now - u.lastSignInAt ) < ( 30 * 24 * 60 * 60 * 1000 ) )
  const last7Days = users.filter( u => u.lastSignInAt && ( now - u.lastSignInAt ) < ( 7 * 24 * 60 * 60 * 1000 ) )
  console.log( `🕐 Active in last 30 days: ${last30Days.length}` )
  console.log( `🕐 Active in last 7 days: ${last7Days.length}` )

  // Creation dates
  const last30DaysCreated = users.filter( u => ( now - u.createdAt ) < ( 30 * 24 * 60 * 60 * 1000 ) )
  console.log( `🆕 Created in last 30 days: ${last30DaysCreated.length}` )
}

/**
 * Validate environment
 */
async function validateEnvironment(): Promise<void> {
  if ( !process.env.CLERK_SECRET_KEY ) {
    throw new Error( "Missing CLERK_SECRET_KEY environment variable" )
  }

  try {
    const client = await clerkClient()
    await client.users.getUserList( { limit: 1 } )
    console.log( "✅ Clerk connection successful" )
  } catch ( error ) {
    throw new Error( `Clerk connection failed: ${error}` )
  }
}

/**
 * Main export function
 */
export async function exportClerkUsers( options: ExportOptions = {} ): Promise<ClerkUserExport[]> {
  const {
    outputFile = `clerk-users-export-${new Date().toISOString().split( 'T' )[0]}.json`,
    includeMetadata = false,
    limit,
    verbose = true
  } = options

  try {
    console.log( "🚀 Starting Clerk user export..." )

    // Validate environment
    await validateEnvironment()

    // Fetch all users
    const users = await fetchAllClerkUsers( { limit, verbose, includeMetadata } )

    if ( users.length === 0 ) {
      console.log( "⚠️  No users found in Clerk" )
      return users
    }

    // Save to file
    saveUsersToFile( users, outputFile )

    // Print statistics
    if ( verbose ) {
      printUserStats( users )
    }

    console.log( "\n🎉 Export completed successfully!" )
    console.log( `📁 Output file: ${resolve( outputFile )}` )

    return users

  } catch ( error ) {
    console.error( "💥 Fatal error during export:", error )
    throw error
  }
}

// CLI usage - only run if this script is executed directly
if ( typeof process !== 'undefined' && process.argv[1]?.includes( 'export-clerk-users.ts' ) ) {
  const args = process.argv.slice( 2 )
  const options: ExportOptions = {}

  // Parse command line arguments
  for ( let i = 0; i < args.length; i++ ) {
    const arg = args[i]

    switch ( arg ) {
      case '--output':
      case '-o':
        options.outputFile = args[++i]
        break
      case '--metadata':
      case '-m':
        options.includeMetadata = true
        break
      case '--limit':
      case '-l':
        options.limit = parseInt( args[++i] )
        break
      case '--quiet':
      case '-q':
        options.verbose = false
        break
      case '--help':
      case '-h':
        console.log( `
Usage: bun run scripts/export-clerk-users.ts [options]

Options:
  -o, --output <file>     Output file path (default: clerk-users-export-YYYY-MM-DD.json)
  -m, --metadata          Include user metadata in export
  -l, --limit <number>    Limit number of users to export
  -q, --quiet             Suppress verbose output
  -h, --help              Show this help message

Examples:
  bun run scripts/export-clerk-users.ts
  bun run scripts/export-clerk-users.ts --output my-users.json
  bun run scripts/export-clerk-users.ts --metadata --limit 100
        `)
        process.exit( 0 )
        break
      default:
        if ( arg.startsWith( '-' ) ) {
          console.error( `Unknown option: ${arg}` )
          process.exit( 1 )
        }
    }
  }

  // Run the export
  exportClerkUsers( options ).catch( error => {
    console.error( "Export failed:", error )
    process.exit( 1 )
  } )
} 