# Webhook Refactor - Best Practices Implementation

## Current Issues Summary

1. **CRITICAL**: No webhook verification (security vulnerability)
2. Monolithic function (180+ lines, multiple responsibilities)
3. Excessive logging with sensitive data
4. No transaction safety
5. Incomplete edge case handling
6. Poor error handling and recovery
7. No rate limiting or idempotency
8. Mixed concerns (HTTP handling + business logic)

## Proposed Architecture

### 1. **Security First**

```typescript
// ✅ Proper webhook verification
const verifyWebhookSignature = async (request: Request): Promise<ClerkWebhookEvent> => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new WebhookError('Missing webhook secret');
  
  const payload = await request.text();
  const headers = await headers();
  
  const wh = new Webhook(WEBHOOK_SECRET);
  return wh.verify(payload, {
    'svix-id': headers.get('svix-id'),
    'svix-timestamp': headers.get('svix-timestamp'), 
    'svix-signature': headers.get('svix-signature'),
  }) as ClerkWebhookEvent;
};
```

### 2. **Separation of Concerns**

```typescript
// ✅ Dedicated service classes
class UserWebhookService {
  async processUserCreated(data: ClerkUserData): Promise<ProcessResult> {
    // Handle user creation logic
  }
  
  private async findOrCreateUser(userData: UserData): Promise<User> {
    // User lookup and creation logic
  }
  
  private async syncClerkMetadata(clerkId: string, supabaseUserId: string): Promise<void> {
    // Clerk metadata sync
  }
}

class WebhookValidator {
  static validateUserCreatedData(data: any): ClerkUserData {
    // Comprehensive validation with detailed error messages
  }
}
```

### 3. **Transaction Safety**

```typescript
// ✅ Database transactions for consistency
const processUserCreation = async (userData: UserData) => {
  return await db.transaction(async (tx) => {
    const user = await findOrCreateUser(userData, tx);
    await syncClerkMetadata(user.clerkId, user.id.toString());
    await trackUserRegistration(user);
    return user;
  });
};
```

### 4. **Proper Error Handling**

```typescript
// ✅ Specific error types and handling
class WebhookError extends Error {
  constructor(message: string, public code: string, public statusCode: number) {
    super(message);
  }
}

class UserCreationError extends WebhookError {
  constructor(message: string, cause?: Error) {
    super(message, 'USER_CREATION_FAILED', 422);
    this.cause = cause;
  }
}

// ✅ Specific error recovery
try {
  await userService.processUserCreated(data);
} catch (error) {
  if (error instanceof UserCreationError) {
    // Specific handling for user creation failures
    logger.error('User creation failed', { clerkId: data.id, error: error.message });
    return new Response('User creation failed', { status: 422 });
  }
  
  if (error instanceof ClerkAPIError) {
    // Handle Clerk API failures differently
    logger.error('Clerk API error', { error: error.message });
    return new Response('External service error', { status: 502 });
  }
  
  // Generic fallback
  logger.error('Unexpected webhook error', { error });
  return new Response('Internal server error', { status: 500 });
}
```

### 5. **Structured Logging**

```typescript
// ✅ Structured, secure logging
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  error: (message: string, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error', 
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};

// ✅ Usage (no sensitive data)
logger.info('Processing user webhook', { 
  eventType: 'user.created',
  hasClerkId: !!clerkId,
  hasEmail: !!email 
});
```

### 6. **Idempotency & Rate Limiting**

```typescript
// ✅ Idempotency handling
const processedEvents = new Set<string>();

const handleWebhook = async (event: ClerkWebhookEvent) => {
  const eventId = event.id || `${event.type}-${event.data.id}`;
  
  if (processedEvents.has(eventId)) {
    logger.info('Duplicate webhook event ignored', { eventId });
    return { status: 'duplicate', eventId };
  }
  
  processedEvents.add(eventId);
  // Process event...
};
```

### 7. **Clean Main Handler**

```typescript
// ✅ Clean, focused route handler
export async function POST(request: Request) {
  try {
    // 1. Verify webhook signature
    const event = await verifyWebhookSignature(request);
    
    // 2. Route to appropriate handler
    const result = await routeWebhookEvent(event);
    
    // 3. Return success response
    return Response.json(result);
    
  } catch (error) {
    return handleWebhookError(error);
  }
}

const routeWebhookEvent = async (event: ClerkWebhookEvent) => {
  if (isUserCreatedEvent(event)) {
    return await userWebhookService.processUserCreated(event.data);
  }
  
  logger.info('Unhandled webhook type', { type: event.type });
  return { status: 'unhandled', type: event.type };
};
```

## Implementation Priority

### Phase 1: Critical Security

1. Re-enable webhook verification
2. Remove sensitive data from logs
3. Add proper environment variable validation

### Phase 2: Code Quality  

1. Extract service classes
2. Add proper error types
3. Implement transaction safety

### Phase 3: Reliability

1. Add idempotency handling
2. Implement structured logging
3. Add comprehensive monitoring

### Phase 4: Performance

1. Add rate limiting
2. Optimize database queries
3. Add caching where appropriate

## File Structure

```
src/
├── app/api/webhooks/
│   ├── route.ts (clean handler)
│   └── handlers/
│       ├── user-created.ts
│       └── index.ts
├── services/
│   ├── webhook-service.ts
│   ├── user-service.ts
│   └── clerk-service.ts
├── lib/
│   ├── webhook-validator.ts
│   ├── webhook-errors.ts
│   └── structured-logger.ts
└── types/
    ├── webhook-events.ts
    └── service-responses.ts
```

This refactor would make the code:

- ✅ Secure (proper verification)
- ✅ Maintainable (separation of concerns)
- ✅ Testable (isolated functions)
- ✅ Reliable (proper error handling)
- ✅ Observable (structured logging)
- ✅ Scalable (modular architecture)
