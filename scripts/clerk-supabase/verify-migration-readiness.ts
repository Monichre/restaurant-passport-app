#!/usr/bin/env bun
/**
 * Verify Migration Readiness
 * 
 * This script checks that all prerequisites are met before migration
 * and that Supabase relationships will be preserved
 */

import { readFileSync } from "fs"
import { db } from "@/db/db"
import { users } from "@/db/drizzle/schema"
import { eq } from "drizzle-orm"

interface ClerkUser {
  userId: string
  email: string
}

async function verifyMigrationReadiness( migrationFilePath: string ) {
  console.log( "🔍 Verifying migration readiness...\n" )

  // 1. Check migration file
  console.log( "📁 Checking migration file..." )
  const fileContent = readFileSync( migrationFilePath, 'utf-8' )
  const clerkUsers: ClerkUser[] = JSON.parse( fileContent )
  console.log( `✅ Found ${clerkUsers.length} users in migration file` )

  // 2. Check for duplicate emails
  console.log( "\n📧 Checking for duplicate emails..." )
  const emails = clerkUsers.map( u => u.email.toLowerCase() )
  const uniqueEmails = new Set( emails )
  if ( emails.length !== uniqueEmails.size ) {
    console.error( "❌ Duplicate emails found in migration file!" )
    const duplicates = emails.filter( ( email, index ) => emails.indexOf( email ) !== index )
    console.error( "Duplicates:", [...new Set( duplicates )] )
    return false
  }
  console.log( "✅ No duplicate emails found" )

  // 3. Check Supabase users
  console.log( "\n🗄️  Checking Supabase database..." )
  const supabaseUsers = await db.select().from( users )
  console.log( `📊 Found ${supabaseUsers.length} users in Supabase` )

  // 4. Match Clerk IDs with Supabase
  console.log( "\n🔗 Checking Clerk ID mappings..." )
  const clerkIdMap = new Map( clerkUsers.map( u => [u.userId, u.email] ) )
  const supabaseClerkIds = new Set( supabaseUsers.map( u => u.clerkId ) )

  let matchCount = 0
  let missingCount = 0
  const missingUsers: string[] = []

  for ( const [clerkId, email] of clerkIdMap ) {
    if ( supabaseClerkIds.has( clerkId ) ) {
      matchCount++
    } else {
      missingCount++
      missingUsers.push( `${clerkId} (${email})` )
    }
  }

  console.log( `✅ Matched: ${matchCount} users` )
  console.log( `⚠️  Not in Supabase: ${missingCount} users` )

  if ( missingUsers.length > 0 ) {
    console.log( "\n📋 Users not found in Supabase:" )
    missingUsers.forEach( user => console.log( `  - ${user}` ) )
  }

  // 5. Environment check
  console.log( "\n🔧 Checking environment variables..." )
  const requiredEnvVars = {
    CLERK_SECRET_KEY: "Production Clerk Secret Key",
    DATABASE_URL: "Production Database URL",
    NEXT_PUBLIC_SUPABASE_URL: "Production Supabase URL",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "Production Supabase Anon Key"
  }

  const missingEnvVars: string[] = []
  for ( const [key, description] of Object.entries( requiredEnvVars ) ) {
    if ( !process.env[key] ) {
      missingEnvVars.push( `${key} (${description})` )
    }
  }

  if ( missingEnvVars.length > 0 ) {
    console.error( "❌ Missing environment variables:" )
    missingEnvVars.forEach( v => console.error( `  - ${v}` ) )
    return false
  }
  console.log( "✅ All environment variables present" )

  // 6. Summary
  console.log( "\n📊 === MIGRATION READINESS SUMMARY ===" )
  console.log( `Total users to migrate: ${clerkUsers.length}` )
  console.log( `Users already in Supabase: ${matchCount}` )
  console.log( `New users for Supabase: ${missingCount}` )
  console.log( `\n✅ Ready for migration!` )

  return true
}

// Run if called directly
if ( import.meta.main ) {
  const migrationFilePath = process.argv[2] || "./clerk-migration-users.json"
  verifyMigrationReadiness( migrationFilePath )
}