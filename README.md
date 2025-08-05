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
