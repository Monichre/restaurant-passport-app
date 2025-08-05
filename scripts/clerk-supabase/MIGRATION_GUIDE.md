# Clerk Dev → Production Migration Guide

This guide ensures a safe migration of users from Clerk dev to production while maintaining Supabase database integrity.

## Prerequisites

1. **Production Environment Variables**
   - `CLERK_SECRET_KEY` (Production Clerk)
   - `DATABASE_URL` (Production Supabase)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Dev Environment Backup**
   - Keep a copy of `clerk-dev-users.json`
   - Export current Supabase data as backup

## Migration Steps

### Phase 1: Data Preparation

1. **Transform the Clerk Export Data**

   ```bash
   cd scripts/clerk-supabase
   bun run transform-clerk-export.ts ../../clerk-dev-users.json ../../clerk-migration-users.json
   ```

2. **Verify Migration Readiness**

   ```bash
   # Set production environment variables
   export CLERK_SECRET_KEY="your-production-clerk-secret"
   export DATABASE_URL="your-production-db-url"
   # ... other env vars

   bun run verify-migration-readiness.ts ../../clerk-migration-users.json
   ```

### Phase 2: Clerk Migration

1. **Set Up Clerk Migration Script**

   ```bash
   # In a separate directory
   git clone https://github.com/clerk/migration-script.git clerk-migration
   cd clerk-migration
   npm install
   ```

2. **Configure Migration Script**
   Create `.env` file in the migration directory:

   ```env
   CLERK_SECRET_KEY=your-production-clerk-secret
   DELAY_MS=1000
   RETRY_DELAY_MS=10000
   ```

3. **Copy Migration Data**

   ```bash
   cp ../restaurant-passport-app/clerk-migration-users.json ./users.json
   ```

4. **Run the Migration**

   ```bash
   npm start
   ```

   The script will:
   - Create users in production Clerk with the SAME user IDs from dev
   - Respect rate limits
   - Log any errors to `migration-log.json`
   - Skip users that already exist (using email as unique key)

### Phase 3: Supabase Sync

After Clerk migration completes:

1. **Sync New Users to Supabase**

   ```bash
   # Back in your app directory
   cd scripts/clerk-supabase
   
   # This will sync any users that don't exist in Supabase
   bun run sync-clerk-users-from-file-to-supabase.ts ../../clerk-migration-users.json
   ```

   This script will:
   - Check for existing users by Clerk ID
   - Create missing users in Supabase
   - Update Clerk privateMetadata with Supabase user IDs
   - Preserve all existing relationships

### Phase 4: Verification

1. **Run Post-Migration Verification**

   ```bash
   bun run post-migration-verify.ts
   ```

2. **Manual Checks**
   - Log into production Clerk dashboard
   - Verify user count matches dev
   - Check a few users have correct metadata
   - Test authentication flow
   - Verify Supabase relationships intact

## Important Notes

1. **User ID Preservation**: The migration preserves exact user IDs from dev (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)

2. **Password Migration**: Users with passwords will have them migrated (bcrypt hashes)

3. **Metadata Preservation**: The Supabase sync will update privateMetadata for all users

4. **Rate Limiting**: The migration script respects Clerk's rate limits

5. **Idempotency**: You can safely re-run the migration - existing users won't be duplicated

## Rollback Plan

If issues occur:

1. **Clerk Rollback**: Delete newly created users via Clerk dashboard or API
2. **Supabase Rollback**: Restore from backup if needed
3. **Verify**: Check that existing users weren't affected

## Troubleshooting

1. **Rate Limit Errors**: Increase `DELAY_MS` in migration script
2. **Duplicate Email Errors**: Check `migration-log.json` for details
3. **Supabase Sync Failures**: Check user already exists or connection issues
4. **Missing Metadata**: Manually update via Clerk dashboard or API

## Post-Migration Tasks

1. **Update Environment**: Switch app to use production Clerk
2. **Test Authentication**: Verify users can log in
3. **Monitor Logs**: Watch for any sync issues
4. **Clean Up**: Remove migration scripts and temporary files
