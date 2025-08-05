# 🚨 CRITICAL: Password Migration Fix

## The Problem

**The API export doesn't include password hashes!** This means users would lose their passwords during migration.

- **Dashboard Export**: Has passwords ✅ but no metadata ❌
- **API Export**: Has metadata ✅ but no passwords ❌

## The Solution: Merge Both Exports

You need BOTH exports to get complete data:

### Step 1: Use Your Dashboard Export

You already have `clerk-dev-users-incomple.json` from the dashboard - this has the crucial password data.

### Step 2: Merge with API Export

```bash
cd scripts/clerk-migration
bun run merge-exports.ts ../../clerk-dev-users-incomple.json ./clerk-users-full-export.json ./clerk-merged-export.json
```

This creates `clerk-merged-export.json` with:

- ✅ Passwords from dashboard export
- ✅ Metadata from API export  
- ✅ Complete user data for migration

### Step 3: Use Merged Export for Migration

```bash
# Transform the merged export (not the individual ones)
bun run transform-clerk-export-with-metadata.ts ./clerk-merged-export.json ./users.json
```

## What You'll See

Expected merge output:

```
📊 === MERGE RESULTS ===
Total users: 58
Users with passwords: 25 (example)
Users with metadata: 51  
Users with BOTH: 23 (these are perfect!)
```

## Why This Happened

Clerk's security design:

- **API**: Never exposes password hashes (security)
- **Dashboard**: Only way to get password data
- **Result**: Need both sources for complete migration

## Updated Migration Flow

```
1. Dashboard Export (passwords) + API Export (metadata)
                    ↓
2. Merge exports → Complete data  
                    ↓
3. Transform → Migration format
                    ↓
4. Import to production
```

This ensures migrated users can log in with their existing passwords! 🔑
