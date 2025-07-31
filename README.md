# Restaurant Passport App - Comprehensive Codebase Documentation

## 1. Project Overview

**Project Type**: Next.js-based digital restaurant passport and loyalty platform  
**Primary Technologies**: Next.js 14, TypeScript, Tailwind CSS, ShadCN/UI, Framer Motion  
**Authentication**: Clerk  
**Database**: Supabase (PostgreSQL) with Drizzle ORM  
**Analytics**: PostHog  
**Deployment**: Vercel  

**Core Functionality**:

- Digital punch card system for restaurant visits
- QR code scanning for instant punch validation
- Raffle entry system upon completion
- Restaurant deals and promotions
- User leaderboards and achievements
- Admin dashboard for restaurant management

**Target Environment**: Production web application with mobile-responsive design

## 2. Architecture Analysis

### Overall System Architecture

The application follows a **Next.js App Router** architecture with the following key patterns:

- **Server-Side Rendering (SSR)** for SEO and performance
- **Client-Side Components** for interactive features
- **API Routes** for backend functionality
- **Server Actions** for form handling and data mutations
- **Real-time subscriptions** via WebSockets and Server-Sent Events

### Directory Structure & Organization

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (public)/          # Public routes (restaurants, deals, auth)
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API endpoints
│   ├── actions/           # Server actions
│   └── users/             # User-specific routes
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN/UI components
│   ├── admin/            # Admin-specific components
│   ├── nav/              # Navigation components
│   └── [feature]/        # Feature-specific components
├── features/             # Feature-based modules
├── hooks/                # Custom React hooks
├── context/              # React context providers
├── db/                   # Database layer
│   ├── drizzle/          # Drizzle ORM schema
│   ├── models/           # Database models
│   └── supabase/         # Supabase client configuration
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Architectural Patterns

**1. Feature-Based Organization**

- Features are organized by domain (users, restaurants, deals)
- Each feature contains its own components, hooks, and utilities
- Promotes modularity and maintainability

**2. Layered Architecture**

- **Presentation Layer**: React components and pages
- **Business Logic Layer**: Server actions and API routes
- **Data Access Layer**: Database models and Drizzle ORM
- **Infrastructure Layer**: Supabase, Clerk, PostHog

**3. Context-Based State Management**

- User context for authentication state
- Location context for geolocation
- Style wrapper for theming

## 3. Code Quality Assessment

### Coding Standards & Style Guidelines

**TypeScript Configuration**

- Strict type checking enabled
- Comprehensive type definitions in `/types/`
- Proper type exports and imports

**Code Organization**

- **Named exports** used consistently
- **Functional components** preferred over classes
- **Custom hooks** for reusable logic
- **Server actions** for form handling

**Naming Conventions**

- **Directories**: lowercase with dashes (`restaurant-detail/`)
- **React Components**: PascalCase (`RestaurantDetail.tsx`)
- **Hooks**: camelCase with `use` prefix (`useHandleQrCode.tsx`)
- **Utilities**: lowercase with dashes (`url-parsing.ts`)
- **Constants**: ALL_CAPS (`MAX_PUNCH_THRESHOLD`)

### Code Modularity

- **High cohesion** within feature modules
- **Low coupling** between features
- **Separation of concerns** between UI, business logic, and data access
- **Reusable components** in `/components/ui/`

### Testing Strategy

- **Jest** configuration present
- **Test files** in `__tests__/` directories
- **Component testing** with Storybook
- **API route testing** structure in place

## 4. Technical Stack

### Core Libraries & Frameworks

**Frontend Framework**

```typescript
// Next.js 14 with App Router
import { NextRequest, NextResponse } from "next/server"
```

**UI Framework**

```typescript
// Tailwind CSS + ShadCN/UI
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

**Animation Library**

```typescript
// Framer Motion
import { motion, AnimatePresence } from "motion/react"
```

**Authentication**

```typescript
// Clerk
import { auth } from "@clerk/nextjs/server"
import { useUser } from "@clerk/nextjs"
```

### Database Systems

**ORM**: Drizzle ORM with PostgreSQL

```typescript
// Schema definition
export const users = pgTable("users", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  clerkId: text("clerk_id").notNull(),
  name: text().notNull(),
  isStaff: boolean("is_staff").default(false),
  isAdmin: boolean("is_admin").default(false),
  email: text().notNull(),
  phone: text(),
})
```

**Database Models**

- `users` - User accounts and authentication
- `restaurants` - Restaurant information and QR codes
- `punchCards` - User punch card progress
- `raffleEntries` - Raffle participation tracking
- `restaurantDeals` - Restaurant promotions and deals

### External Services & APIs

**Analytics**: PostHog for user behavior tracking
**File Storage**: Supabase Storage for images
**Real-time**: WebSockets and Server-Sent Events
**Geolocation**: Browser Geolocation API

## 5. Key Components

### Core Business Logic Modules

**1. QR Code Scanning System**

```typescript
// src/hooks/use-handle-qr-code.tsx
export const useHandleQRCode = (props: UseHandleQRCodeProps) => {
  // QR code generation and processing logic
}
```

**2. Punch Card Management**

```typescript
// src/app/actions/scan-actions.ts
export async function processQrScan(formData: {
  qrData: string
  userId: string | number | bigint
}) {
  // Punch card creation and validation
}
```

**3. Raffle Entry System**

```typescript
// src/db/models/raffle-entries/raffle-entries.ts
export async function createRaffleEntry(data: {
  userId: bigint
  punchCardId: bigint
}) {
  // Raffle entry creation logic
}
```

### Data Models & Schemas

**User Model**

```typescript
export type AppUser = {
  id: number
  clerkId: string
  name: string
  isStaff: boolean
  isAdmin: boolean
}
```

**Punch Card Model**

```typescript
export type PunchCard = {
  id: bigint
  userId: bigint
  restaurantId: bigint
  punches: number
  completed: boolean
  updatedAt: string
}
```

### API Endpoints & Services

**User Management**

- `GET /api/users/[id]` - Get user by Clerk ID
- `POST /api/users` - Create new user

**Restaurant Operations**

- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/[id]` - Get restaurant details
- `POST /api/restaurants/[id]/scan` - Process QR scan

**Punch Card Operations**

- `GET /api/punch-cards` - Get user punch cards
- `POST /api/punch-cards` - Create punch card

**Raffle Management**

- `GET /api/raffle-entries` - Get raffle entries
- `POST /api/raffle-entries` - Create raffle entry

### UI Components

**Navigation System**

```typescript
// src/components/nav/nav.tsx
export const Nav = () => {
  // Responsive navigation with QR scanner integration
}
```

**Passport Component**

```typescript
// src/features/users/passport/passport.tsx
export function Passport({ punches }: PassportProps) {
  // Digital passport display with stamps
}
```

**Admin Dashboard**

```typescript
// src/components/admin/admin-dashboard-content.tsx
export const AdminDashboardContent = () => {
  // Admin interface for restaurant management
}
```

## 6. Codebase Instructions for Another Agent

### Critical Files & Functions

**Authentication Flow**

- **File**: `src/context/user-context.tsx`
- **Function**: `fetchUser()` - Syncs Clerk user with database
- **Usage**: Provides user state throughout the app

**QR Code Processing**

- **File**: `src/app/api/restaurants/[id]/scan/route.ts`
- **Function**: `POST` handler - Processes QR scans
- **Key Logic**: Creates punch cards and raffle entries

**Database Operations**

- **File**: `src/db/models/punch-cards/punch-cards.ts`
- **Functions**: `createPunchCard()`, `getUserPunchCardForRestaurant()`
- **Usage**: All punch card database operations

### Implementing New Features

**1. Add New API Endpoint**

```typescript
// Create: src/app/api/[feature]/route.ts
export async function GET(request: NextRequest) {
  // Implementation
}
```

**2. Add New Database Model**

```typescript
// Add to: src/db/drizzle/schema.ts
export const newTable = pgTable("new_table", {
  // Schema definition
})
```

**3. Add New Component**

```typescript
// Create: src/components/[feature]/ComponentName.tsx
export const ComponentName = ({ props }: Props) => {
  // Component implementation
}
```

### Testing Requirements

**Unit Tests**

- Test files in `__tests__/` directories
- Use Jest and React Testing Library
- Test both client and server components

**Integration Tests**

- Test API routes with proper authentication
- Test database operations with test data
- Test user flows end-to-end

### Deployment & Environment Setup

**Environment Variables**

```bash
# Required environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

**Database Migrations**

```bash
# Run migrations
bun run db:generate
bun run db:migrate
```

### Common Patterns & Idioms

**Server Actions Pattern**

```typescript
"use server"
export async function actionName(formData: FormData) {
  // Server-side logic
}
```

**Context Usage Pattern**

```typescript
const { currentUser, isLoading } = useUserContext()
```

**Database Query Pattern**

```typescript
const result = await db.query.table.findMany({
  where: eq(table.field, value)
})
```

### Error Handling Conventions

**API Error Responses**

```typescript
return NextResponse.json({
  success: false,
  error: "Error message"
}, { status: 400 })
```

**Client Error Handling**

```typescript
try {
  const result = await action()
} catch (error) {
  console.error("Error:", error)
  // Handle error appropriately
}
```

### Security Considerations

**Authentication**

- All protected routes use Clerk middleware
- Server actions validate user authentication
- API routes check user permissions

**Data Validation**

- Use Zod schemas for input validation
- Sanitize user inputs
- Validate database queries

## 7. Development Workflow

### Git Branching Strategy

- **Main branch**: Production-ready code
- **Feature branches**: `feature/feature-name`
- **Bug fixes**: `fix/bug-description`
- **Hotfixes**: `hotfix/urgent-fix`

### Code Review Process

1. Create feature branch from main
2. Implement changes with tests
3. Submit pull request
4. Code review and approval
5. Merge to main

### Release Procedures

1. Update version in `package.json`
2. Create release notes
3. Deploy to staging environment
4. Run integration tests
5. Deploy to production

### Environment Management

- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live application environment

## 8. Known Issues & Technical Debt

### Identified Issues

1. **BigInt Serialization**: Some API responses need BigInt conversion
2. **QR Code Parsing**: Complex JSON parsing logic could be simplified
3. **Error Handling**: Inconsistent error handling across components

### Areas Needing Refactoring

1. **QR Code Logic**: Consolidate QR processing logic
2. **Database Queries**: Optimize complex queries
3. **Component Structure**: Some components are too large

### Performance Considerations

1. **Image Optimization**: Implement proper image optimization
2. **Database Indexing**: Add indexes for frequently queried fields
3. **Caching**: Implement caching for restaurant data

### Security Vulnerabilities

1. **Input Validation**: Strengthen input validation
2. **Rate Limiting**: Add rate limiting to API endpoints
3. **CORS Configuration**: Review CORS settings

## 9. Context for New Agent

### Project History & Evolution

- **Initial Development**: Restaurant passport concept
- **QR Code Integration**: Added QR scanning functionality
- **Admin Dashboard**: Built restaurant management interface
- **Raffle System**: Implemented completion rewards

### Recent Changes

- **Clerk Integration**: Migrated to Clerk authentication
- **Drizzle ORM**: Replaced Prisma with Drizzle
- **PostHog Analytics**: Added user behavior tracking
- **Mobile Optimization**: Improved mobile responsiveness

### Current Development Priorities

1. **Performance Optimization**: Improve app performance
2. **User Experience**: Enhance UI/UX
3. **Admin Features**: Expand admin capabilities
4. **Testing Coverage**: Increase test coverage

### Future Roadmap

1. **Real-time Features**: Enhanced real-time updates
2. **Advanced Analytics**: More detailed reporting
3. **Mobile App**: Native mobile application
4. **Integration APIs**: Third-party integrations

### Team Conventions

- **Code Style**: Prettier + ESLint configuration
- **Commits**: Conventional commit messages
- **Documentation**: Inline comments and README files
- **Testing**: Write tests for new features
