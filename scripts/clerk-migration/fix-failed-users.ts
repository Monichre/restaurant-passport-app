#!/usr/bin/env bun
/**
 * Fix and retry failed user migrations
 * Handles users with missing first_name/last_name requirements
 */

import { readFileSync, writeFileSync } from 'fs'
import { config } from 'dotenv'

// Load production environment
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"
import ora from "ora"

interface FailedUser {
  userId: string
  status: number
  errors: Array<{
    code: string
    message: string
    longMessage: string
  }>
}

interface User {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  password?: string
  passwordHasher?: string
  private_metadata?: Record<string, any>
  public_metadata?: Record<string, any>
  unsafe_metadata?: Record<string, any>
}

function createUserWithFallbacks( userData: User ) {
  // Handle empty/missing names by providing fallbacks
  const firstName = userData.firstName && userData.firstName.trim()
    ? userData.firstName.trim()
    : undefined  // Let Clerk handle missing names

  const lastName = userData.lastName && userData.lastName.trim()
    ? userData.lastName.trim()
    : undefined  // Let Clerk handle missing names

  const createUserData = {
    externalId: userData.userId,
    emailAddress: [userData.email],
    ...( firstName && { firstName } ),  // Only include if we have a real value
    ...( lastName && { lastName } ),    // Only include if we have a real value
    privateMetadata: userData.private_metadata,
    publicMetadata: userData.public_metadata,
    unsafeMetadata: userData.unsafe_metadata,
  }

  if ( userData.password ) {
    return clerkClient.users.createUser( {
      ...createUserData,
      passwordDigest: userData.password,
      passwordHasher: userData.passwordHasher,
    } )
  } else {
    return clerkClient.users.createUser( {
      ...createUserData,
      skipPasswordRequirement: true,
    } )
  }
}

async function retryFailedUsers() {
  console.log( '🔄 Fixing and retrying failed user migrations...' )

  // Validate environment
  const secretKey = process.env.CLERK_SECRET_KEY
  if ( !secretKey || !secretKey.startsWith( 'sk_live_' ) ) {
    throw new Error( '❌ Production Clerk key required' )
  }

  // Read the failed users from migration log
  const logFile = '../../migration-log-2025-08-05T05:04:27.json'
  const logContent = readFileSync( logFile, 'utf-8' )

  // Parse the JSON objects (they're not in an array, just separate objects)
  const logEntries = logContent
    .split( '\n' )
    .filter( line => line.trim() )
    .map( line => {
      try {
        return JSON.parse( line )
      } catch {
        return null
      }
    } )
    .filter( entry => entry && entry.userId )

  console.log( `📋 Found ${logEntries.length} failed users` )

  // Read the original user data
  const allUsers: User[] = JSON.parse( readFileSync( './users-for-migration.json', 'utf-8' ) )

  // Find the failed users in the original data
  const failedUsers = logEntries.map( logEntry => {
    const userData = allUsers.find( user => user.userId === logEntry.userId )
    return { logEntry, userData }
  } ).filter( item => item.userData )

  console.log( `🎯 Ready to retry ${failedUsers.length} users` )

  // Stats
  let successful = 0
  let stillFailed = 0

  const spinner = ora( 'Retrying failed users...' ).start()

  for ( let i = 0; i < failedUsers.length; i++ ) {
    const { logEntry, userData } = failedUsers[i]

    spinner.text = `Retrying user ${i + 1}/${failedUsers.length}: ${userData!.email}`

    try {
      await createUserWithFallbacks( userData! )
      successful++
      spinner.text = `✅ ${userData!.email} - SUCCESS`

      // Small delay to avoid rate limits
      await new Promise( resolve => setTimeout( resolve, 500 ) )

    } catch ( error: any ) {
      stillFailed++
      console.log( `\n❌ Still failed: ${userData!.email}` )
      console.log( `   Error: ${error.message || error}` )

      // Log the continued failure
      writeFileSync(
        `./retry-failed-${userData!.userId}.json`,
        JSON.stringify( { userId: userData!.userId, retryError: error }, null, 2 )
      )
    }
  }

  spinner.succeed( 'Retry complete!' )

  console.log( '\n📊 Retry Results:' )
  console.log( `✅ Successfully migrated: ${successful}` )
  console.log( `❌ Still failed: ${stillFailed}` )
  console.log( `📈 New success rate: ${successful}/${failedUsers.length} (${Math.round( successful / failedUsers.length * 100 )}%)` )

  // Check final user count
  const finalUsers = await clerkClient.users.getUserList( { limit: 1 } )
  console.log( `🎯 Total users in production: ${finalUsers.totalCount}` )

  return { successful, stillFailed, totalRetried: failedUsers.length }
}

// Main execution
if ( require.main === module ) {
  retryFailedUsers()
    .then( ( { successful, stillFailed, totalRetried } ) => {
      console.log( `\n🎉 Retry complete! ${successful}/${totalRetried} users recovered.` )
      if ( stillFailed === 0 ) {
        console.log( '✅ All users successfully migrated!' )
      }
    } )
    .catch( ( error ) => {
      console.error( '❌ Error during retry:', error )
      process.exit( 1 )
    } )
}