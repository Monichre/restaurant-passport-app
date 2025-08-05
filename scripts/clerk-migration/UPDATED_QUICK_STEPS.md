# Clerk Migration Quick Steps (UPDATED)

## ⚠️ CRITICAL: Export with Metadata First

The dashboard export is missing Supabase IDs. You MUST do a programmatic export FROM YOUR DEV INSTANCE first.

## 🔄 Migration Flow

```
DEV Clerk Instance → Export → Transform → Import to PRODUCTION Clerk Instance
```

## 0️⃣ Export Users with Metadata FROM DEV (NEW STEP!)

```bash
# ⚠️ Use your DEV Clerk key (sk_test_)
export CLERK_SECRET_KEY=sk_test_YOUR_DEV_KEY

cd scripts/clerk-migration

# Validate you're using the correct DEV key
bun run validate-clerk-keys.ts export

# If validation passes, run the export
bun run export-clerk-users-with-metadata.ts
```

This creates:

- `clerk-users-full-export.json` (use this instead of dashboard export)
- `clerk-supabase-id-mapping.json` (shows Clerk → Supabase relationships)

## 1️⃣ Transform Data (2 min)

```bash
# Use the FULL export, not the dashboard export
bun run transform-clerk-export-with-metadata.ts ./clerk-users-full-export.json ./users.json
```

## 2️⃣ Configure Environment for PRODUCTION Import (2 min)

```bash
cd scripts
cat > .env << EOF
# ⚠️ NOW switch to PRODUCTION key (sk_live_) 
CLERK_SECRET_KEY=sk_live_YOUR_PROD_KEY
DELAY_MS=1000
RETRY_DELAY_MS=10000
IMPORT_TO_DEV_INSTANCE=false
EOF
```

## 3️⃣ Run Migration to PRODUCTION (30-60 min)

```bash
# Validate you're now using the correct PRODUCTION key
bun run clerk-migration/validate-clerk-keys.ts import

# If validation passes, run the migration
bun run demo-migration-script.ts clerk-migration/users.json
```

## 4️⃣ Verify Success

Check production Clerk dashboard for all users.

## 🔑 Key Difference: Metadata Preserved

With the full export, your migration preserves:

- Supabase user IDs in private metadata
- All other metadata fields
- Complete user relationships

This means after migration, users will still have their `privateMetadata.supabaseUserId` intact!
