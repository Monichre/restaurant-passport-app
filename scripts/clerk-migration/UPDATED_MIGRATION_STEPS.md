# Clerk Migration Steps (FIXED for Passwords)

## 🚨 Critical Discovery: Need Both Exports

API export has metadata but **NO passwords**. Dashboard export has passwords but **NO metadata**. You need both!

## Step-by-Step Process

### 1️⃣ Merge Your Exports (CRITICAL)

```bash
cd scripts/clerk-migration
bun run merge-exports.ts ../../clerk-dev-users-incomple.json ./clerk-users-full-export.json ./clerk-merged-export.json
```

Expected output:

```
📊 === MERGE RESULTS ===
Total users: 58
Users with passwords: ~25-30 (from dashboard)
Users with metadata: 51 (from API)  
Users with BOTH: ~20-25 (complete data!)
```

### 2️⃣ Transform Merged Data

```bash
# Use the MERGED export - not individual ones!
bun run transform-clerk-export-with-metadata.ts ./clerk-merged-export.json ./users.json
```

### 3️⃣ Switch to Production Key

```bash
cd scripts
cat > .env << EOF
# ⚠️ NOW use PRODUCTION key (sk_live_)
CLERK_SECRET_KEY=sk_live_YOUR_PROD_KEY
DELAY_MS=1000
RETRY_DELAY_MS=10000
IMPORT_TO_DEV_INSTANCE=false
EOF
```

### 4️⃣ Validate Production Connection

```bash
bun run clerk-migration/validate-clerk-keys.ts import
```

### 5️⃣ Run Migration

```bash
bun run demo-migration-script.ts clerk-migration/users.json
```

## What's Different Now?

### ❌ Old Process (Broken)

```
API Export → Transform → Import
(No passwords - users can't log in!)
```

### ✅ New Process (Fixed)

```
Dashboard Export (passwords) + API Export (metadata)
                    ↓
            Merge → Complete data
                    ↓  
            Transform → Import
            (Users keep passwords!)
```

## Critical Benefits

1. **Passwords Preserved**: Users can log in with existing passwords
2. **Metadata Preserved**: Supabase relationships intact  
3. **Complete Migration**: Nothing lost in the process

## Files You'll Have

- `clerk-dev-users-incomple.json` - Dashboard export (passwords)
- `clerk-users-full-export.json` - API export (metadata)  
- `clerk-merged-export.json` - **Use this for migration!**
- `users.json` - Final migration format

The merge script will show you exactly how many users have complete data vs missing pieces.
