# Supabase Batch Scripts

This directory contains scripts for batch operations with a local Supabase instance, specifically for creating users and punch cards for testing and development.

## Setup

1. Make sure you have a local Supabase instance running:
   ```bash
   supabase start
   ```

2. Ensure your `.env` file has the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   DATABASE_URL=postgres://postgres:postgres@localhost:54322/postgres
   ```

3. Install additional dependencies:
   ```bash
   npm install @faker-js/faker nanoid commander
   ```

## Usage

### Creating Users

```bash
npm run batch:create-users -- --count 20 --staff 5 --admin 2 --prefix "test-user"
```

Options:
- `--count` or `-c`: Total number of users to create (default: 10)
- `--staff` or `-s`: Number of users to mark as staff (default: 0)
- `--admin` or `-a`: Number of users to mark as admin (default: 0)
- `--prefix` or `-p`: Prefix for user names (default: "test-user")

### Creating Punch Cards

```bash
npm run batch:create-punch-cards -- --count 3 --users 20 --punches 0-10 --completed 25
```

Options:
- `--count` or `-c`: Number of punch cards to create per user (default: 3)
- `--users` or `-u`: Number of users to create punch cards for (default: 10)
- `--punches` or `-p`: Range of punches in format "min-max" (default: "0-5")
- `--completed`: Percentage of cards marked as completed (default: 20)

## Direct Script Execution

You can also run the scripts directly:

```bash
node scripts/supabase-batch/batch-create-users.js 20 5 2
```

Arguments: `<totalCount> <staffCount> <adminCount>`

```bash
node scripts/supabase-batch/batch-create-punch-cards.js 3 20 0 10 25
```

Arguments: `<cardsPerUser> <userCount> <minPunches> <maxPunches> <completedPercentage>`

## Notes

- These scripts are for local development only.
- The scripts check for existing records to avoid duplicates.
- Users are created with fake Clerk IDs for local testing.
