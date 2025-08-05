#!/usr/bin/env bun
/**
 * Simple retry for the 15 failed users after disabling name requirements
 */

import { config } from 'dotenv'
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"
import { readFileSync } from 'fs'
import ora from "ora"

// The 15 failed user IDs from the migration log
const failedUserIds = [
  "user_2vja5y7KIBQzwkU99uVmfz9amYe",
  "user_2ymPkBb3cKjz5VVDfIjxKI2zRga",
  "user_2ypJttKoHpkR07MmybmOMNhKjQq",
  "user_2ypkgSVigbMLHM6TRf3e1uuhqYR",
  "user_2ys3Qup3qGz1G09kXBZPpuciuJR",
  "user_2ysYwp2q97M4QfkMz4Ds9qYFjbw",
  "user_2yxjmK8hWImgspugopsBOg8aOac",
  "user_2z4fJneFM7ZcA94ma4srnVM7goW",
  "user_2z8Uqvb2EWr11wpC6AjE1cOCL0x",
  "user_2z9X0fkEjpDSVmQXvLfNWDcxEnu",
  "user_2zK9bQDX5Tr11VXQMgBO8rm5Ztm",
  "user_3038Zkc2XB6FfLohIAP4c3AvlQP",
  "user_30FOmlA3iNFJBPf09MAj101Q0Bd",
  "user_30J0i73lPeKqor2zppQtBuvh76y",
  "user_30LJEL5fDafGim6n7PSFTKYXqEF"
]

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

function createUser( userData: User ) {
  const createUserData = {
    externalId: userData.userId,
    emailAddress: [userData.email],
    firstName: userData.firstName || "",  // Now empty strings should be OK
    lastName: userData.lastName || "",    // Now empty strings should be OK
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
  console.log( '🔄 Retrying 15 failed users...' )

  // Validate environment  
  const secretKey = process.env.CLERK_SECRET_KEY
  if ( !secretKey || !secretKey.startsWith( 'sk_live_' ) ) {
    throw new Error( '❌ Production Clerk key required' )
  }

  // Read the original user data
  const allUsers: User[] = JSON.parse( readFileSync( './users-for-migration.json', 'utf-8' ) )

  // Filter to just the failed users
  const failedUsers = allUsers.filter( user => failedUserIds.includes( user.userId ) )

  console.log( `🎯 Found ${failedUsers.length} failed users to retry` )

  // Check current count
  const beforeCount = await clerkClient.users.getUserList( { limit: 1 } )
  console.log( `📊 Current users in production: ${beforeCount.totalCount}` )

  let successful = 0
  let stillFailed = 0

  const spinner = ora( 'Retrying failed users...' ).start()

  for ( let i = 0; i < failedUsers.length; i++ ) {
    const userData = failedUsers[i]

    spinner.text = `Retrying ${i + 1}/${failedUsers.length}: ${userData.email}`

    try {
      await createUser( userData )
      successful++
      console.log( `\n✅ ${userData.email} - SUCCESS` )

      // Small delay to avoid rate limits
      await new Promise( resolve => setTimeout( resolve, 300 ) )

    } catch ( error: any ) {
      stillFailed++
      console.log( `\n❌ ${userData.email} - FAILED: ${error.message}` )
    }
  }

  spinner.succeed( 'Retry complete!' )

  // Check final count
  const afterCount = await clerkClient.users.getUserList( { limit: 1 } )

  console.log( '\n📊 Final Results:' )
  console.log( `✅ Successfully migrated: ${successful}/15` )
  console.log( `❌ Still failed: ${stillFailed}/15` )
  console.log( `📈 Production users: ${beforeCount.totalCount} → ${afterCount.totalCount}` )
  console.log( `🎯 Total migration: ${afterCount.totalCount}/58 users (${Math.round( afterCount.totalCount / 58 * 100 )}%)` )

  return { successful, stillFailed, finalCount: afterCount.totalCount }
}

// Main execution
retryFailedUsers()
  .then( ( { successful, stillFailed, finalCount } ) => {
    if ( stillFailed === 0 ) {
      console.log( '\n🎉 PERFECT! All 58 users successfully migrated!' )
    } else {
      console.log( `\n✅ Progress made: ${successful} more users migrated` )
    }
    console.log( `\n🚀 Ready for Supabase update with ${finalCount} users` )
  } )
  .catch( ( error ) => {
    console.error( '❌ Error during retry:', error )
    process.exit( 1 )
  } )