#!/usr/bin/env bun
/**
 * Validate Clerk Keys for Migration
 * 
 * This script helps ensure you're using the correct Clerk keys
 * for each phase of the migration process
 */

import { clerkClient } from "@clerk/nextjs/server"

interface KeyValidation {
  isDev: boolean
  isProd: boolean
  keyType: string
  instanceType: string
}

async function validateClerkKey( purpose: 'export' | 'import' ): Promise<KeyValidation> {
  const secretKey = process.env.CLERK_SECRET_KEY

  if ( !secretKey ) {
    throw new Error( "CLERK_SECRET_KEY environment variable is required" )
  }

  const isDev = secretKey.startsWith( 'sk_test_' )
  const isProd = secretKey.startsWith( 'sk_live_' )

  if ( !isDev && !isProd ) {
    throw new Error( "Invalid Clerk secret key format" )
  }

  const validation: KeyValidation = {
    isDev,
    isProd,
    keyType: secretKey.substring( 0, 10 ) + "...",
    instanceType: isDev ? 'DEV' : 'PRODUCTION'
  }

  // Test connection
  try {
    const client = await clerkClient()
    const response = await client.users.getUserList( { limit: 1 } )
    console.log( `✅ Successfully connected to ${validation.instanceType} instance` )
    console.log( `📊 Instance has ${response.totalCount} total users` )
  } catch ( error ) {
    throw new Error( `Failed to connect to Clerk: ${error}` )
  }

  return validation
}

async function validateForExport() {
  console.log( "🔍 Validating Clerk key for EXPORT (from DEV)...\n" )

  const validation = await validateClerkKey( 'export' )

  if ( !validation.isDev ) {
    console.error( "❌ WRONG KEY FOR EXPORT!" )
    console.error( "Expected: DEV instance key (sk_test_...)" )
    console.error( `Got: ${validation.keyType} (${validation.instanceType})` )
    console.error( "\n💡 For export, you need your DEV instance key" )
    process.exit( 1 )
  }

  console.log( "✅ Correct key for export phase" )
  console.log( `✅ Using ${validation.instanceType} instance (${validation.keyType})` )
  console.log( "\n📤 Ready to export users from DEV instance" )
}

async function validateForImport() {
  console.log( "🔍 Validating Clerk key for IMPORT (to PRODUCTION)...\n" )

  const validation = await validateClerkKey( 'import' )

  if ( !validation.isProd ) {
    console.error( "❌ WRONG KEY FOR IMPORT!" )
    console.error( "Expected: PRODUCTION instance key (sk_live_...)" )
    console.error( `Got: ${validation.keyType} (${validation.instanceType})` )
    console.error( "\n💡 For import, you need your PRODUCTION instance key" )
    process.exit( 1 )
  }

  console.log( "✅ Correct key for import phase" )
  console.log( `✅ Using ${validation.instanceType} instance (${validation.keyType})` )
  console.log( "\n📥 Ready to import users to PRODUCTION instance" )
}

// Run based on command line argument
if ( import.meta.main ) {
  const phase = process.argv[2]

  if ( !phase || !['export', 'import'].includes( phase ) ) {
    console.error( `
Usage: bun run validate-clerk-keys.ts <export|import>

Examples:
  bun run validate-clerk-keys.ts export   # Validate DEV key for exporting
  bun run validate-clerk-keys.ts import   # Validate PROD key for importing
    ` )
    process.exit( 1 )
  }

  try {
    if ( phase === 'export' ) {
      await validateForExport()
    } else {
      await validateForImport()
    }
  } catch ( error ) {
    console.error( "❌ Validation failed:", error.message )
    process.exit( 1 )
  }
}

export { validateForExport, validateForImport }