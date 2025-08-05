# Clerk Dev → Production Migration Checklist

## 🚀 Quick Steps

### 1. Prepare Data (5 minutes)

```bash
# Transform export format
cd scripts/clerk-supabase
bun run transform-clerk-export.ts ../../clerk-dev-users.json ../../clerk-migration-users.json

# Verify readiness
bun run verify-migration-readiness.ts ../../clerk-migration-users.json
```

### 2. Run Clerk Migration (30-60 minutes)

```bash
# Clone official migration script
cd ~/Desktop  # or wherever you prefer
git clone https://github.com/clerk/migration-script.git clerk-migration
cd clerk-migration
npm install

# Configure
echo "CLERK_SECRET_KEY=your-production-clerk-secret" > .env
cp ~/Desktop/restaurant-passport-app/clerk-migration-users.json ./users.json

# Run migration
npm start
```

### 3. Sync to Supabase (10-20 minutes)

```bash
# Back in your app
cd ~/Desktop/restaurant-passport-app/scripts/clerk-supabase

# Run sync (only creates missing users)
bun run sync-clerk-users-from-file-to-supabase.ts ../../clerk-migration-users.json
```

### 4. Verify Success (5 minutes)

```bash
# Run verification
bun run post-migration-verify.ts

# If any metadata is missing, fix it
bun run fix-missing-metadata.ts
```

## ⚠️ Critical Points

1. **User IDs are Preserved**: The migration maintains exact user IDs from dev (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)

2. **Passwords Migrate**: Users with bcrypt passwords will retain them

3. **No Supabase Disruption**: The sync script only creates missing users, won't duplicate or modify existing ones

4. **Metadata Linking**: Each Clerk user gets `privateMetadata.supabaseUserId` for the relationship

5. **Safe to Re-run**: All scripts are idempotent - running twice won't cause issues

## 📋 Pre-Flight Checklist

- [ ] Backup Supabase production database
- [ ] Have production Clerk secret key ready
- [ ] Verify production environment variables set
- [ ] Confirm no active users during migration window
- [ ] Test with 1-2 users first if desired

## 🚨 Rollback Plan

If issues occur:

1. Delete new users from Clerk dashboard
2. Supabase users can be removed if needed (but shouldn't be necessary)
3. Re-run with fixes

## 📞 Support Resources

- Clerk Migration Docs: <https://clerk.com/docs/deployments/migrate-overview>
- Official Migration Script: <https://github.com/clerk/migration-script>
- Check `migration-log.json` for any errors during Clerk import
