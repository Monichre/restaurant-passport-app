# Clerk Dev → Production Migration

This directory contains scripts to migrate 57 users from Clerk dev to production.

## Key Points

1. **User IDs Change**: Production Clerk will assign NEW user IDs, but dev IDs are preserved as `externalId`
2. **Supabase Continuity**: The `supabase-users-export.json` has `dev_clerk_id` field to maintain mapping
3. **Passwords Preserved**: Bcrypt hashes migrate so users can log in

## Files in this Directory

- `transform-clerk-export.ts` - Converts Clerk export format to migration format
- `QUICK_STEPS.md` - Quick reference for the migration process
- `MIGRATION_GUIDE.md` - Detailed guide with troubleshooting
- `post-migration-mapping.ts` - Helper to create ID mappings for Supabase update

## Migration Process

1. **Transform data**: Convert Clerk export to expected format
2. **Configure**: Set production Clerk key in .env
3. **Run migration**: Execute demo-migration-script.ts
4. **Verify**: Check production Clerk dashboard
5. **Update Supabase**: Map new production IDs (separate process)

## Example ID Changes

Before (Dev):

```
Clerk ID: user_2su5eFUSw9IPPmzZAxT6s8VFOnY
```

After (Production):

```
Clerk ID: user_prod_xxxxxxxxxxxxx (NEW)
External ID: user_2su5eFUSw9IPPmzZAxT6s8VFOnY (preserved)
```

Supabase will need updating:

```
clerk_id: user_prod_xxxxxxxxxxxxx (update to new)
dev_clerk_id: user_2su5eFUSw9IPPmzZAxT6s8VFOnY (already stored)
```

## Quick Start

```bash
# 1. Transform data
bun run transform-clerk-export.ts ../../clerk-dev-users.json ./users.json

# 2. Configure
echo "CLERK_SECRET_KEY=sk_live_xxx" > ../.env

# 3. Run migration
cd ..
bun run demo-migration-script.ts clerk-migration/users.json
```

See `QUICK_STEPS.md` for the complete quick reference.
