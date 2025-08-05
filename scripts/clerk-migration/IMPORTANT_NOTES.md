# Important Migration Notes

## User Count Discrepancy

- **Clerk Dev Export**: 57 users
- **Supabase Export**: 61 users

This means 4 users exist in Supabase but not in the Clerk export. These could be:

- Deleted Clerk users that remain in Supabase
- Manually created test users
- Users from before Clerk integration

## What Happens to User IDs

The demo migration script uses `externalId` to preserve dev IDs:

```javascript
clerkClient.users.createUser({
  externalId: userData.userId,  // Your dev ID goes here
  emailAddress: [userData.email],
  // ... other fields
})
```

This means:

1. Clerk assigns a NEW production ID (e.g., `user_prod_xxxxx`)
2. Your dev ID is stored as `externalId` (e.g., `user_2su5eFUSw9IPPmzZAxT6s8VFOnY`)
3. You can query users by their `externalId` to find them

## Dependencies to Install

Before running the migration, install in the scripts directory:

```bash
cd scripts
npm install dotenv zod @clerk/clerk-sdk-node ora
```

Or add to package.json and use bun:

```bash
bun add dotenv zod @clerk/clerk-sdk-node ora
```

## Post-Migration Supabase Update

After migration, you'll need to:

1. Use Clerk API to get new production IDs
2. Match them to dev IDs using `externalId`
3. Update Supabase `clerk_id` field with new production IDs
4. Keep `dev_clerk_id` for reference

Example:

```typescript
// Find user by their dev ID
const users = await clerk.users.getUserList({ 
  externalId: ['user_2su5eFUSw9IPPmzZAxT6s8VFOnY'] 
})
const newProdId = users.data[0]?.id // e.g., user_prod_xxxxx

// Update Supabase
await updateUser(supabaseUserId, { clerk_id: newProdId })
```

## Users Missing from Clerk Export

These 4 Supabase users are not in the Clerk export:

- Check if they should be migrated separately
- Or if they should be removed from Supabase
- Their `dev_clerk_id` values can help identify them
