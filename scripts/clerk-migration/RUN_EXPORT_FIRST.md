# IMPORTANT: Export Users with Metadata First

The Clerk Dashboard export doesn't include private metadata (which contains Supabase user IDs). You need to run a programmatic export FROM YOUR DEV INSTANCE first to get this crucial data.

## 🔄 Migration Flow: DEV → PRODUCTION

```
Clerk DEV Instance → Export with Metadata → Transform → Import to Clerk PRODUCTION Instance
```

## Quick Steps to Export with Metadata FROM DEV

### 1. Set DEV Environment Variable

```bash
# ⚠️ CRITICAL: Use your DEV instance secret key (starts with sk_test_)
export CLERK_SECRET_KEY=sk_test_YOUR_DEV_KEY_HERE
```

### 2. Run the Export Script

```bash
cd scripts/clerk-migration
bun run export-clerk-users-with-metadata.ts
```

This will create two files:

- `clerk-users-full-export.json` - Complete user data with all metadata
- `clerk-supabase-id-mapping.json` - Direct mapping of Clerk IDs to Supabase IDs

### 3. What You'll See

```
🚀 Starting Clerk user export with metadata...
📡 Fetching users from Clerk...
  Fetched 57 users (total: 57)
✅ Total users fetched: 57

💾 Full export saved to: ./clerk-users-full-export.json
💾 ID mapping saved to: ./clerk-supabase-id-mapping.json

📊 Export Summary:
- Total users: 57
- Users with Supabase IDs: 45  ← This is the key number
- Users without Supabase IDs: 12
```

## Why This Matters

The private metadata contains the Supabase user ID linkage:

```json
{
  "id": "user_2su5eFUSw9IPPmzZAxT6s8VFOnY",
  "private_metadata": {
    "supabaseUserId": "2"  ← This is what we need!
  }
}
```

Without this data, you'd lose the connection between Clerk and Supabase users during migration.

## Next Steps

After running the export:

1. Use `clerk-users-full-export.json` instead of the dashboard export
2. The migration will preserve these Supabase IDs in the new environment
3. You can maintain data integrity between Clerk and Supabase
