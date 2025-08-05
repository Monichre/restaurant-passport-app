# Clerk to Supabase User Sync Scripts

This directory contains scripts to export users from Clerk and sync them to your Supabase database. Perfect for migrating existing users who weren't properly synced due to webhook issues.

## 🚀 Quick Start

### Complete Sync (Recommended)

Export all Clerk users and sync them to Supabase in one command:

```bash
bun run scripts/full-clerk-sync.ts
```

This will:

1. ✅ Export all users from Clerk
2. ✅ Create missing users in Supabase
3. ✅ Update Clerk metadata with Supabase user IDs
4. ✅ Save a backup JSON file
5. ✅ Show detailed statistics

## 📋 Individual Scripts

### 1. Export Users from Clerk

```bash
# Export all users
bun run scripts/export-clerk-users.ts

# Export with options
bun run scripts/export-clerk-users.ts --output my-users.json --metadata --limit 100
```

**Options:**

- `-o, --output <file>` - Output file path
- `-m, --metadata` - Include user metadata
- `-l, --limit <number>` - Limit number of users
- `-q, --quiet` - Suppress verbose output

### 2. Sync Users to Supabase

```bash
# From JSON file
bun run scripts/sync-clerk-users-from-file.ts ./clerk-users.json

# From JSON string (direct)
bun run scripts/sync-clerk-to-supabase.ts '[{"id":"user_123",...}]'
```

## 🔧 Prerequisites

### Environment Variables

Make sure these are set in your `.env` file:

```bash
# Clerk
CLERK_SECRET_KEY=sk_test_...

# Supabase
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Dependencies

The scripts use your existing project dependencies. No additional installation needed.

## 📊 What Gets Synced

### From Clerk

- ✅ User ID (Clerk ID)
- ✅ Email address
- ✅ First and last name
- ✅ Creation/update timestamps
- ✅ Last sign-in time
- ⚠️ Metadata (optional)

### To Supabase

- ✅ Creates user record in `users` table
- ✅ Updates Clerk `privateMetadata` with Supabase user ID
- ✅ Handles duplicate prevention
- ✅ Maintains data integrity

## 🛡️ Safety Features

### Duplicate Prevention

- ✅ Checks existing users before creating
- ✅ Skips users already in Supabase
- ✅ Reports detailed results

### Error Handling

- ✅ Graceful error recovery
- ✅ Detailed error logging
- ✅ Partial success support
- ✅ Rate limiting protection

### Data Validation

- ✅ Validates required fields
- ✅ Handles missing email/names
- ✅ Environment validation
- ✅ Connection testing

## 📈 Example Output

```bash
🚀 Starting complete Clerk to Supabase sync...

📤 === STEP 1: EXPORT FROM CLERK ===
🔄 Fetching users from Clerk...
📄 Fetching page 1 (offset: 0)
✅ Fetched 100 users (total: 100)
📄 Fetching page 2 (offset: 100)
✅ Fetched 50 users (total: 150)
📊 Total users fetched: 150
💾 Saved 150 users to: clerk-users-export-2025-01-26.json

📊 === USER STATISTICS ===
👥 Total Users: 150
📧 Users with email: 150
👤 Users with both names: 120
🕐 Active in last 30 days: 85

📥 === STEP 2: SYNC TO SUPABASE ===
🚀 Starting sync of 150 Clerk users to Supabase...
📋 Fetching existing Supabase users...
📊 Found 25 existing users in Supabase

🔄 Processing user 1/150: user_abc123
📝 Creating user: John Doe (john@example.com)
✅ Created user in Supabase with ID: 26
✅ Updated Clerk metadata for user user_abc123

📊 === SYNC RESULTS ===
📈 Total Processed: 150
✅ Created: 125
⏭️  Skipped: 25
❌ Errors: 0

🎯 === FINAL SUMMARY ===
📤 Exported from Clerk: 150 users
📥 Processed for Supabase: 150 users
✅ Created in Supabase: 125 users
⏭️  Skipped (already exist): 25 users
❌ Errors: 0 users

🎉 Complete sync successful!
```

## 🔍 Troubleshooting

### Common Issues

**Missing Environment Variables**

```bash
Error: Missing CLERK_SECRET_KEY environment variable
```

**Solution:** Check your `.env` file has all required variables.

**Clerk Connection Failed**

```bash
Error: Clerk connection failed
```

**Solution:** Verify `CLERK_SECRET_KEY` is correct and has sufficient permissions.

**Database Connection Failed**

```bash
Error: Database connection failed
```

**Solution:** Check `DATABASE_URL` and ensure database is accessible.

### Permissions

- ✅ Clerk secret key needs user read access
- ✅ Database user needs insert/update permissions
- ✅ Supabase service key may be needed for metadata updates

## ⚡ Performance Tips

### Large User Bases

```bash
# Process in batches
bun run scripts/full-clerk-sync.ts --limit 500

# Save bandwidth, skip metadata
bun run scripts/full-clerk-sync.ts --no-metadata
```

### Network Issues

- The scripts include automatic rate limiting
- Add delays between API calls
- Retry logic for transient failures

## 🧪 Testing

### Dry Run (Export Only)

```bash
# Just export, don't sync
bun run scripts/export-clerk-users.ts --limit 10
```

### Small Batch Test

```bash
# Test with limited users
bun run scripts/full-clerk-sync.ts --limit 5
```

## 📝 Notes

- **Idempotent**: Safe to run multiple times
- **Non-destructive**: Never deletes existing data  
- **Resumable**: Can continue after interruption
- **Logged**: All operations are logged for audit

## 🆘 Support

If you encounter issues:

1. Check the detailed error logs
2. Verify environment variables
3. Test database/Clerk connectivity
4. Review the troubleshooting section above
