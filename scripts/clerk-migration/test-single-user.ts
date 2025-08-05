#!/usr/bin/env bun
/**
 * Test fixing a single failed user to verify the approach works
 */

import { config } from 'dotenv'
config( { path: '../../.env.production' } )

import { clerkClient } from "@clerk/clerk-sdk-node"

// Test user: user_2vja5y7KIBQzwkU99uVmfz9amYe (dev@ultraterrestrial.app)
// This user failed because first_name and last_name are empty strings

async function testSingleUser() {
  console.log( '🧪 Testing single user fix...' )

  const testUser = {
    userId: "user_2vja5y7KIBQzwkU99uVmfz9amYe",
    email: "dev@ultraterrestrial.app",
    firstName: "", // This is the problem - empty string
    lastName: "",  // This is the problem - empty string
    password: "$2a$10$LP/bHW9111G0RdVvKzSY7OHNSQRIc7G7t4JoUBG3K1.Q8LM5B99TC",
    passwordHasher: "bcrypt",
    private_metadata: {},
    public_metadata: {
      "role": "user",
      "databaseUserId": 42
    },
    unsafe_metadata: {}
  }

  console.log( 'Original data:', {
    firstName: `"${testUser.firstName}"`,
    lastName: `"${testUser.lastName}"`
  } )

  // Method 1: Skip empty names entirely
  console.log( '\n🔧 Method 1: Skip empty name fields entirely' )

  const createUserData: any = {
    externalId: testUser.userId,
    emailAddress: [testUser.email],
    passwordDigest: testUser.password,
    passwordHasher: testUser.passwordHasher,
    privateMetadata: testUser.private_metadata,
    publicMetadata: testUser.public_metadata,
    unsafeMetadata: testUser.unsafe_metadata,
  }

  // Only include name fields if they have actual content
  if ( testUser.firstName && testUser.firstName.trim() ) {
    createUserData.firstName = testUser.firstName.trim()
  }
  if ( testUser.lastName && testUser.lastName.trim() ) {
    createUserData.lastName = testUser.lastName.trim()
  }

  console.log( 'Cleaned data for Clerk:', createUserData )

  try {
    const result = await clerkClient.users.createUser( createUserData )
    console.log( '✅ SUCCESS! User created:', result.id )
    console.log( '📧 Email:', result.emailAddresses[0]?.emailAddress )
    return true
  } catch ( error: any ) {
    console.log( '❌ FAILED:', error.status, error.message )
    console.log( 'Error details:', error.errors || error )
    return false
  }
}

// Run test
testSingleUser()
  .then( ( success ) => {
    if ( success ) {
      console.log( '\n🎉 Fix confirmed! The approach works.' )
      console.log( 'Now we can apply this to all 15 failed users.' )
    } else {
      console.log( '\n😞 Fix didn\'t work. Need to investigate further.' )
    }
  } )
  .catch( ( error ) => {
    console.error( '❌ Test error:', error )
  } )