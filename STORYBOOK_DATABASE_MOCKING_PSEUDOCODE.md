# Storybook Database Mocking Implementation Plan

## Problem Analysis
- Storybook is trying to import server-side database code (`getPunchCardsByUserId`, `getRaffleEntriesByUserId`)
- These imports happen through hooks that client components use
- Server components with database calls are being included in stories
- Need to isolate client components from server dependencies for Storybook

## Solution Approach
Create a mocking layer that intercepts database calls in Storybook environment

## Implementation Steps

### 1. Create Database Mock Layer
```pseudocode
CREATE src/lib/storybook-mocks/
  - database-mocks.ts        // Mock implementations of database functions
  - mock-context.tsx         // React context to provide mocked data
  - supabase-mock.ts         // Mock Supabase client for Storybook
```

### 2. Mock Database Functions
```pseudocode
FUNCTION mockGetPunchCardsByUserId(userId: bigint):
  RETURN predefined mock punch cards data
  
FUNCTION mockGetRaffleEntriesByUserId(userId: bigint):
  RETURN predefined mock raffle entries data
  
FUNCTION mockSupabaseBrowserClient():
  RETURN object with mocked subscribe/channel methods
  RETURN object that doesn't make real API calls
```

### 3. Create Mock Hooks for Storybook
```pseudocode
CREATE src/hooks/storybook/
  - use-punch-card-subscription.stories.ts   // Storybook-specific hook
  - useUserRaffleSubscription.stories.ts     // Storybook-specific hook
  
THESE HOOKS:
  - Return predefined mock data
  - Don't import database functions
  - Simulate loading/error states
  - Work entirely in client environment
```

### 4. Update Storybook Configuration
```pseudocode
IN .storybook/main.ts:
  ADD webpack alias to redirect imports:
    - "@/hooks/use-punch-card-subscription" -> storybook version
    - "@/hooks/useUserRaffleSubscription" -> storybook version
    - "@/db/models/*" -> mock implementations
    
IN .storybook/preview.ts:
  ADD global decorator that provides mock context
  WRAP all stories with mock data provider
```

### 5. Create Mock Context Provider
```pseudocode
CREATE MockDataProvider:
  PROVIDES mock data for:
    - Users
    - Restaurants  
    - Punch cards
    - Raffle entries
    
ALLOWS stories to:
  - Override default mock data
  - Test different states (loading, error, empty)
  - Simulate real-time updates
```

### 6. Update Existing Stories
```pseudocode
IN ProfilePage.stories.tsx:
  WRAP stories with MockDataProvider
  REMOVE direct database mocking
  USE context-provided mock data
  
FOR other stories:
  IDENTIFY which import server components
  EITHER:
    - Extract client components for stories
    - OR provide mocked server data
    - OR exclude from Storybook
```

### 7. Handle Server Components
```pseudocode
FOR src/app/admin/restaurants/[id]/page.tsx:
  PROBLEM: marked as 'use client' but uses async/await database calls
  SOLUTION: 
    - Remove 'use client' (it's a server component)
    - Extract client portion to separate component
    - Create stories for client component only
    - Mock data passing from server to client
```

### 8. Create Component Isolation Strategy
```pseudocode
IDENTIFY mixed components:
  - Server components using database
  - Client components using hooks with database calls
  
SEPARATE into:
  - Pure server components (no stories)
  - Pure client components (can have stories with mocks)
  - Hybrid components -> split into server + client parts
```

### 9. Webpack Alias Strategy
```pseudocode
IN Storybook webpack config:
  ALIAS "@/db/models/punch-cards" TO mock version
  ALIAS "@/db/models/raffle-entries" TO mock version
  ALIAS "@/db/supabase/supabase.client" TO mock version
  
MOCK versions:
  - Export same function signatures
  - Return Promise.resolve(mockData)
  - Don't import actual database code
```

### 10. Testing Strategy
```pseudocode
ENSURE mocks cover:
  - All database function signatures
  - All possible return types
  - Error conditions
  - Loading states
  - Empty data states
  
TEST that:
  - Storybook builds without errors
  - Stories render without server imports
  - Components work with mock data
  - Real components still work with real data
```

## Implementation Priority
1. Create basic mock layer (Step 1-2)
2. Configure Storybook aliasing (Step 4)
3. Update problematic stories (Step 6)
4. Fix server/client component issues (Step 7)
5. Create comprehensive mock context (Step 5)
6. Add mock hooks if needed (Step 3)

## Benefits
- Storybook works without server dependencies
- Stories load faster (no database calls)
- Predictable story data
- Can test all component states
- Clear separation of client/server concerns 