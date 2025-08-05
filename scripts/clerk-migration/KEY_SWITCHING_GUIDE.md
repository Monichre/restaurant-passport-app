# Critical: Clerk Key Switching Guide

## 🔐 Two Different Keys Required

You need to switch between TWO different Clerk secret keys during this migration:

### Phase 1: Export (Use DEV Key)

```bash
export CLERK_SECRET_KEY=sk_test_YOUR_DEV_KEY
```

- **Purpose**: Export users FROM your development instance
- **Key Type**: `sk_test_...` (Development)
- **Validation**: Run `bun run validate-clerk-keys.ts export`

### Phase 2: Import (Use PRODUCTION Key)

```bash
export CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
```

- **Purpose**: Import users TO your production instance  
- **Key Type**: `sk_live_...` (Production)
- **Validation**: Run `bun run validate-clerk-keys.ts import`

## ⚠️ Common Mistakes

1. **Using production key for export** - You'll export from the wrong instance
2. **Using dev key for import** - You'll import to the wrong instance
3. **Forgetting to switch keys** - Migration will fail or go to wrong place

## 🔄 Migration Flow with Key Switching

```
Step 1: Set DEV key → Export from DEV instance
        ↓
Step 2: Transform exported data
        ↓
Step 3: Set PRODUCTION key → Import to PRODUCTION instance
```

## 🔍 Validation Commands

Always validate before each major step:

```bash
# Before export (should show DEV instance)
export CLERK_SECRET_KEY=sk_test_YOUR_DEV_KEY
bun run validate-clerk-keys.ts export

# Before import (should show PRODUCTION instance)  
export CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
bun run validate-clerk-keys.ts import
```

## ✅ Success Indicators

**Export Validation:**

```
✅ Successfully connected to DEV instance
📊 Instance has 57 total users
✅ Ready to export users from DEV instance
```

**Import Validation:**

```
✅ Successfully connected to PRODUCTION instance  
📊 Instance has 0 total users (before migration)
✅ Ready to import users to PRODUCTION instance
```
