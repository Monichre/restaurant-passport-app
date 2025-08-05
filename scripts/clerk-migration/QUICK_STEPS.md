# Clerk Migration Quick Steps

## 1️⃣ Transform Data (2 min)

```bash
cd scripts/clerk-migration
bun run transform-clerk-export.ts ../../clerk-dev-users.json ./users.json
```

## 2️⃣ Configure Environment (2 min)

```bash
cd scripts
cat > .env << EOF
CLERK_SECRET_KEY=sk_live_YOUR_PROD_KEY
DELAY_MS=1000
RETRY_DELAY_MS=10000
IMPORT_TO_DEV_INSTANCE=false
EOF
```

## 3️⃣ Run Migration (30-60 min)

```bash
bun run demo-migration-script.ts users.json
```

## 4️⃣ Verify Success

Check production Clerk dashboard for 57 users.

## ⚠️ Important: User ID Changes

- **Dev ID**: `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`
- **Becomes**: New production ID + dev ID stored as `externalId`
- **Supabase**: Will need updating with new production IDs

## ✅ Success Indicators

- Script shows "57 users migrated"
- Users visible in production Clerk dashboard
- Each user has `externalId` = their dev Clerk ID

## ❌ If Something Goes Wrong

- Check `migration-log-{timestamp}.json`
- You can safely re-run - it skips existing users
- Use `bun` if you get TypeScript errors
