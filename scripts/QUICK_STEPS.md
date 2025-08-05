# Clerk Migration Quick Steps

## 1️⃣ Transform Data (2 min)

```bash
cd scripts/clerk-migration
bun run transform-clerk-export.ts ../../clerk-dev-users.json ./clerk-migration-users.json
```

## 2️⃣ Setup Migration Tool (5 min)

```bash
# In a new directory outside your project
cd ~/Desktop
git clone https://github.com/clerk/migration-script.git clerk-prod-migration
cd clerk-prod-migration
npm install

# Create .env
echo "CLERK_SECRET_KEY=sk_live_YOUR_PROD_KEY" > .env
echo "DELAY_MS=1000" >> .env
```

## 3️⃣ Run Migration (30-60 min)

```bash
# Copy your data
cp ~/Desktop/restaurant-passport-app/scripts/clerk-migration/clerk-migration-users.json ./users.json

# Run it!
npm start
```

## 4️⃣ Verify Success (2 min)

```bash
# Back in your project
cd ~/Desktop/restaurant-passport-app/scripts/clerk-migration
bun run verify-clerk-migration.ts
```

Then check production Clerk dashboard for 48 users.

## ✅ Success Indicators

- Script shows "48 users migrated"
- No errors in migration log (or only 422 "already exists" errors)
- Users visible in production Clerk dashboard
- User IDs match dev (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)

## ❌ If Something Goes Wrong

- Check `migration-log-{timestamp}.json` for errors
- You can safely re-run - it skips existing users
- Increase DELAY_MS if hitting rate limits
