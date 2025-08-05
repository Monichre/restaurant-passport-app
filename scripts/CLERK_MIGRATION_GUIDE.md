# Clerk Dev → Production Migration Guide

This guide migrates users from your Clerk development instance to production, preserving user IDs and passwords.

## Prerequisites

1. Your `clerk-dev-users.json` file
2. Production Clerk Secret Key
3. Node.js and npm installed

## Migration Steps

### Step 1: Transform Your Export Data

The Clerk migration script expects a different format than your export provides. Transform it:

```bash
cd scripts/clerk-migration
bun run transform-clerk-export.ts ../../clerk-dev-users.json ./clerk-migration-users.json
```

This will:

- Convert `id` → `userId` (preserving exact IDs like `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)
- Map field names to expected format
- Preserve password hashes and hashers

### Step 2: Set Up the Official Migration Script

```bash
# In a separate directory (not in your project)
cd ~/Desktop  # or wherever you prefer
git clone https://github.com/clerk/migration-script.git clerk-prod-migration
cd clerk-prod-migration
npm install
```

### Step 3: Configure for Production

Create `.env` file in the migration directory:

```env
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY_HERE
DELAY_MS=1000
RETRY_DELAY_MS=10000
```

⚠️ Make sure your key starts with `sk_live_` for production!

### Step 4: Copy Your Transformed Data

```bash
cp ~/Desktop/restaurant-passport-app/scripts/clerk-migration/clerk-migration-users.json ./users.json
```

### Step 5: Run the Migration

```bash
npm start
```

The script will:

- Create each user in production with their dev instance ID
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
48 users migrated
0 users failed to upload
```

### Step 6: Verify Migration

1. Log into your production Clerk dashboard
2. Check Users section - you should see all 48 users
3. Verify a few users have:
   - Correct email addresses
   - External ID matching their dev ID
   - Names and usernames preserved

## Important Notes

1. **User IDs are preserved**: Users keep their exact IDs from dev (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)

2. **Passwords work**: Bcrypt hashes are migrated, so users can log in with existing passwords

3. **Safe to re-run**: If migration fails partway, you can run it again - it skips existing users

4. **Rate limits**: The script handles rate limits automatically with delays

## Troubleshooting

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

## Next Steps

After successful migration:

1. Test login with a few migrated users
2. Update your app to use production Clerk keys
3. Plan for Supabase sync (separate process)

## Data Preserved

✅ User IDs (exact match from dev)
✅ Email addresses  
✅ Names (first and last)
✅ Usernames
✅ Phone numbers
✅ Password hashes (bcrypt)

## Data NOT Migrated

❌ Email/phone verification status
❌ User metadata
❌ Session data
❌ OAuth connections
❌ TOTP/2FA settings
