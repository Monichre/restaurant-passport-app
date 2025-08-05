# Clerk Dev → Production Migration Guide

This guide migrates users from your Clerk development instance to production, preserving user IDs and passwords.

## Prerequisites

1. Your `clerk-dev-users.json` file (57 users)
2. Production Clerk Secret Key
3. Node.js/Bun installed

## Important Note on User IDs

The demo migration script uses `externalId` to preserve your dev Clerk IDs. This means:

- Users will get NEW Clerk IDs in production (e.g., `user_prod_xxxxx`)
- But their `externalId` will be their original dev ID (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)
- Supabase already has a `dev_clerk_id` field to maintain this mapping

## Migration Steps

### Step 1: Transform Your Export Data

The demo migration script expects a different format than your export provides. Transform it:

```bash
cd scripts/clerk-migration
bun run transform-clerk-export.ts ../../clerk-dev-users.json ./users.json
```

This creates `users.json` in the format expected by the migration script.

### Step 2: Configure Environment

Create `.env` file in the scripts directory:

```env
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY_HERE
DELAY_MS=1000
RETRY_DELAY_MS=10000
IMPORT_TO_DEV_INSTANCE=false
```

⚠️ Make sure:

- Your key starts with `sk_live_` for production
- `IMPORT_TO_DEV_INSTANCE` is set to `false`

### Step 3: Fix TypeScript Errors (Optional)

The demo script has some TypeScript errors. You can either:

1. Run with bun which is more forgiving: `bun run demo-migration-script.ts`
2. Or fix the errors first (see below)

To fix errors, update these lines in `demo-migration-script.ts`:

```typescript
// Line 115 - Add type guard
if ((error as any).status === 422) {

// Line 116 - Cast error properly
appendLog({ userId: userData.userId, ...(error as any) })

// Line 122 - Add type guard
if ((error as any).status === 429) {

// Line 129 - Cast error properly
appendLog({ userId: userData.userId, ...(error as any) })
```

### Step 4: Run the Migration

```bash
cd scripts
bun run demo-migration-script.ts users.json
```

Or if you prefer npm/node:

```bash
npm install dotenv zod @clerk/clerk-sdk-node ora
node demo-migration-script.js users.json
```

The script will:

- Create each user in production with their dev instance ID as `externalId`
- Generate NEW production Clerk IDs
- Preserve bcrypt password hashes
- Skip users that already exist (by email)
- Log any errors to `migration-log-{timestamp}.json`
- Respect rate limits automatically

Expected output:

```
Clerk User Migration Utility
Fetching users from users.json
users.json found and parsed, attempting migration with an offset of 0
✔ Migration complete
57 users migrated
0 users failed to upload
```

### Step 5: Verify Migration

1. Log into your production Clerk dashboard
2. Check Users section - you should see all 57 users
3. Note that users have:
   - NEW production Clerk IDs (different from dev)
   - Original dev IDs stored as `externalId`
   - Correct email addresses
   - Names and usernames preserved

## Post-Migration: Update Supabase

After Clerk migration succeeds, you'll need to:

1. Update Supabase users with new production Clerk IDs
2. The `clerk_id` field should be updated to the new production IDs
3. The `dev_clerk_id` field already contains the original dev IDs for reference

Example mapping:

- Dev Clerk ID: `user_2su5eFUSw9IPPmzZAxT6s8VFOnY` (stored as externalId and dev_clerk_id)
- New Prod Clerk ID: `user_prod_xxxxx` (new clerk_id in Supabase)

## Important Notes

1. **User IDs change**: Production will assign NEW Clerk IDs, but dev IDs are preserved as externalId

2. **Passwords work**: Bcrypt hashes are migrated, so users can log in with existing passwords

3. **Safe to re-run**: If migration fails partway, you can run it again - it skips existing users

4. **Rate limits**: The script handles rate limits automatically with delays

## Troubleshooting

### TypeScript Errors

- Use `bun` instead of `node` for more forgiving execution
- Or fix the error handling as shown in Step 3

### "422 errors" in migration log

- User already exists with that email
- This is normal if re-running the migration

### Rate limit errors

- Increase `DELAY_MS` in .env to 2000 or higher
- The script auto-retries but slower is safer

### Missing users

- Check `migration-log-{timestamp}.json` for specific errors
- Verify email addresses are valid
- Ensure no duplicate emails in your data

## Data Preserved

✅ User IDs (as externalId)
✅ Email addresses  
✅ Names (first and last)
✅ Usernames
✅ Phone numbers (Note: script doesn't handle these, may need manual update)
✅ Password hashes (bcrypt)

## Data NOT Migrated

❌ Email/phone verification status
❌ User metadata
❌ Session data
❌ OAuth connections
❌ TOTP/2FA settings
