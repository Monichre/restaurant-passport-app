
Digital Punch Card & Loyalty Platform

1. Overview

This application is a Next.js-based digital punch card and loyalty system that leverages TypeScript for type safety, Tailwind CSS + ShadCN/UI for styling, Framer Motion for animations, Storybook for UI component documentation, and Clerk for authentication. The database is managed by Supabase (PostgreSQL) with Drizzle integration. Users earn “punches” at participating restaurants, can redeem prizes, and share achievements. Restaurants (via their admins) and a system admin can manage data through protected routes.

Key Features
 • Digital Punch Cards: Users earn punches, and upon reaching a threshold (e.g., 10 punches), they are entered into a raffle.
 • Role-Based Authorization:
 • User: Access their own profile, punch cards, achievements, and can transfer/earn points.
 • Restaurant Admin: Manage restaurant-specific data (prizes, analytics, etc.) for their own restaurant(s).
 • System Admin: Full access to all resources (managing users, restaurants, etc.).
 • Real-Time QR Code Validation: Staff or admins can scan a user’s QR code to add a punch instantly (via WebSockets).
 • Prizes & Raffles: Advanced prize management, redemption tracking, and raffle entries upon completing a punch card.
 • Points & Achievements: Gamified point transfer system with achievements and real-time leaderboard updates.
 • Analytics Dashboard: Restaurant-level analytics for punch cards, user activity, and prize redemptions.

2. Technical Stack
1. Next.js (TypeScript)
 • Server-side rendering, file-based routing, API routes for some server logic if needed.
 • Integration with Storybook for UI component development.
2. Clerk Authentication
 • Manages user sign-up, sign-in, SSO, and role-based access (user, restaurant admin, system admin).
3. Supabase (PostgreSQL)
 • Hosts the database.
 • Communicated with via a custom storage layer.
4. Tailwind CSS + ShadCN/UI
 • Provides utility-based styling and pre-built components for a consistent UI/UX.
5. Framer Motion
 • Animations for badges, transitions, and dynamic elements (e.g., leaderboard updates).
6. WebSockets
 • Real-time communication for QR validation and leaderboard updates.
7. Storybook
 • Document and test UI components in isolation.

3. Roles & Authorization
1. User
 • Default role after sign-up.
 • Can view their profile, punch cards, achievements, and transfer points to other users.
2. Restaurant Admin
 • Can manage the resources (e.g., prizes, analytics) for their assigned restaurant(s).
 • Has extended permissions to update punch cards, view analytics, and handle prize redemptions for their restaurant.
3. System Admin
 • Has full access to all resources across the platform.
 • Manages users, restaurants, global settings, and can see all analytics.

4. User Flows & Features

4.1 User Onboarding & Profile
 • Sign Up / Sign In:
 • Powered by Clerk.
 • The sign-up flow ensures users have a clerkId, and they’re assigned the default “User” role.
 • Profile Page:
 • Displays user information, achievements, points, and punch cards.

4.2 Punch Card System
 • Restaurant Listing Page:
 • Shows participating restaurants with relevant info (name, image, address, etc.).
 • Punch Card View:
 • Shows the user’s punch count and a QR code to be scanned by staff.
 • Once a user hits the required punches, the card is marked completed and a raffle entry is created.

4.3 QR Code Validation & Raffle
 • QR Scanning (Staff or Restaurant Admin):
 • Real-time validation via WebSockets.
 • Increments the punch card and checks if it’s completed.
 • Raffle Entries:
 • Automatically created when a punch card completes.
 • Used for prize drawings and giveaways.

4.4 Prizes & Prize Redemptions
 • Prize Management (Restaurant Admin or System Admin):
 • Create, edit, and delete prizes (e.g., free coffee, dessert).
 • Configure redemption rules, expiration, quantity, etc.
 • Prize Redemption:
 • Users can redeem prizes if they meet the required punches.
 • System tracks redemption status (redeemed, pending, etc.) and handles expiration logic.

4.5 Points & Achievements
 • Point Balances:
 • Users have a points balance that can be transferred to other users.
 • Point Transfers:
 • A user can send points to another user (if they have enough).
 • Achievements triggered by the first transfer, or certain milestones (100, 500, 1000 points, etc.).
 • Leaderboard:
 • Real-time ranking of users by their points, updated via WebSockets.

4.6 Analytics & Dashboards
 • Restaurant Analytics:
 • Accessible to Restaurant Admin for their restaurant and System Admin for all.
 • Tracks user engagement (punch cards completed, redemption rates, active users, etc.).
 • Graphs and charts for daily/weekly/monthly trends.

5. Database Model & CRUD/REST Routes

Below is the Drizzle ORM schema (TypeScript + Zod) defining the PostgreSQL tables. Each table has corresponding CRUD/REST routes (or integrated Next.js API routes, depending on structure).

5.1 Database Schema

import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/*USERS*/
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  isStaff: boolean("is_staff").default(false),   // e.g., restaurant admin
  isAdmin: boolean("is_admin").default(false),   // system admin
});

/*RESTAURANTS*/
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  address: text("address").notNull(),
});

/*PUNCH CARDS*/
export const punchCards = pgTable("punch_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  punches: integer("punches").default(0),
  completed: boolean("completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/*RAFFLE ENTRIES*/
export const raffleEntries = pgTable("raffle_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  punchCardId: integer("punch_card_id").references(() => punchCards.id),
  createdAt: timestamp("created_at").defaultNow(),
});

/*PRIZES*/
export const prizes = pgTable("prizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  requiredPunches: integer("required_punches").notNull(),
  available: boolean("available").default(true),
  quantity: integer("quantity").default(0),
  rules: json("rules").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/*PRIZE REDEMPTIONS*/
export const prizeRedemptions = pgTable("prize_redemptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  prizeId: integer("prize_id").references(() => prizes.id),
  punchCardId: integer("punch_card_id").references(() => punchCards.id),
  status: text("status").notNull(),
  redeemedAt: timestamp("redeemed_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

/*POINT BALANCES*/
export const pointBalances = pgTable("point_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  points: integer("points").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/*POINT TRANSFERS*/
export const pointTransfers = pgTable("point_transfers", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id),
  points: integer("points").notNull(),
  message: text("message"),
  status: text("status").notNull(), // e.g., pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

/*ACHIEVEMENTS*/
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // e.g., first_transfer, transfer_milestone
  data: json("data").default({}),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

5.2 Insert Schemas & Validation (Zod)

Examples:

export const insertUserSchema = createInsertSchema(users).pick({
  clerkId: true,
  name: true,
  isStaff: true,
  isAdmin: true,
});
export const insertRestaurantSchema = createInsertSchema(restaurants);
export const insertPunchCardSchema = createInsertSchema(punchCards);
export const insertPrizeSchema = createInsertSchema(prizes).omit({
  id: true,
  createdAt: true,
}).extend({
  rules: z.object({
    expirationDays: z.number().optional(),
    usageLimit: z.number().optional(),
    terms: z.string().optional(),
  }).optional(),
});
export const insertPrizeRedemptionSchema = createInsertSchema(prizeRedemptions).omit({
  id: true,
  createdAt: true,
  redeemedAt: true,
});
export const insertPointTransferSchema = createInsertSchema(pointTransfers, {
  points: z.number().min(1),
  message: z.string().max(200).optional(),
}).omit({ id: true, createdAt: true });

5.3 Example CRUD/REST Routes

The following routes (shown in an Express-like format) can also be integrated into Next.js API routes if preferred:

 1. User Routes
 • POST /api/users – create a user (via insertUserSchema)
 • GET /api/users/clerk/:clerkId – retrieve user by clerk ID
 2. Restaurant Routes
 • GET /api/restaurants – list all restaurants
 • GET /api/restaurants/:id – get a specific restaurant
 3. Punch Card Routes
 • POST /api/punch-cards – create a new punch card
 • POST /api/punch-cards/:id/punch – increment punch count
 • GET /api/users/:userId/punch-cards – get all punch cards for a user
 4. Raffle Routes
 • POST /api/raffle-entries – create a raffle entry
 5. Prize Management
 • POST /api/prizes – create a new prize
 • GET /api/restaurants/:restaurantId/prizes – list prizes for a restaurant
 • GET /api/prizes/:id – get a specific prize
 • PATCH /api/prizes/:id – update an existing prize
 6. Prize Redemption
 • POST /api/prize-redemptions – create a new redemption
 • GET /api/users/:userId/prize-redemptions – list user’s prize redemptions
 • PATCH /api/prize-redemptions/:id/status – update redemption status
 7. Analytics
 • GET /api/restaurants/:restaurantId/analytics – retrieve punch card and redemption analytics
 8. Points & Leaderboard
 • GET /api/users/:userId/points – get point balance for a user
 • GET /api/leaderboard – get overall leaderboard
 • POST /api/point-transfers – transfer points between users
 • GET /api/users/:userId/transfers – get transfer history
 • GET /api/users/:userId/achievements – get user achievements
 9. WebSocket
 • ws://<server>/ws – handles real-time QR validation messages.

 6. Role-Based Access & Authorization
 • Middleware / Next.js API Route Guards
 • Use Clerk’s role checks to ensure only restaurant admins or system admins can manage prizes, analytics, or punch cards.
 • Restrict system-level actions (e.g., reading all resources, user creation) to system admin.
 • Users can only access their own punch cards, points, and achievements.

Example checks in Next.js:

// e.g. a Next.js API route
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  const { userId, sessionId, getToken } = getAuth(req);
  // Retrieve user from DB, check roles...
}

7. UI/UX & Styling
1. Tailwind CSS + ShadCN/UI
 • Provides utility classes and theming.
2. Framer Motion
 • Used for animated transitions, particularly for the achievements and leaderboard rank changes.
3. Storybook
 • Document reusable components (e.g., “PunchCardDisplay”, “LeaderboardTable”, “AchievementBadge”).
4. Responsive & Accessible
 • Mobile-friendly layout for scanning QR codes from phones.
 • Aria labels, keyboard navigation, and basic accessibility checks.

8. Key Use Cases & Scenarios
1. User Redeems a Punch
 • The user visits a restaurant, staff scans the user’s QR code.
 • The punch count increments in real-time.
 • If the punch card is completed, a raffle entry is created.
2. Restaurant Admin Updates a Prize
 • The admin logs into the admin dashboard.
 • Navigates to “Prizes” for their restaurant.
 • Creates or updates a prize, specifying required punches, availability, etc.
3. System Admin Manages a Restaurant Admin
 • System admin grants a user isStaff for a specific restaurant or sets isAdmin to true for full privileges.
4. User Transfers Points
 • A user chooses a recipient and enters the number of points to transfer.
 • The system checks if the sender has enough points, completes the transfer, updates balances, and triggers an achievement check.

9. Analytics & Reporting
 • Restaurant-Level Metrics
 • Completed vs. total punch cards.
 • Redemption rates for prizes.
 • Active users in the last 30 days.
 • Historical activity data for daily punch counts.
 • Leaderboards
 • Points-based ranking with real-time updates.

10. Testing & Quality
1. Unit Tests:
 • Test Next.js pages, custom hooks (e.g., useWebSocket), and server routes.
2. Integration Tests:
 • Validate flows (sign-up, punch card scanning, prize redemption).
3. E2E Tests:
 • Use Playwright or Cypress to test the entire user journey.
4. Storybook Visual Testing:
 • Ensure components render consistently across states (loading, success, error).

11. Deployment & DevOps
1. Environment Variables:
 • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
 • SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (secured)
2. CI/CD:
 • Automated testing pipeline (GitHub Actions or similar).
3. Hosting:
 • Next.js can be hosted on Vercel or similar.
 • Supabase for database hosting.

12. Next Steps & Enhancements
 • Multiple Campaigns: Support multiple parallel punch-card campaigns within a single restaurant.
 • Expanded Social Sharing: More robust social media integration (Facebook, Twitter, etc.).
 • Deeper Analytics: Additional dashboards for points economy, user churn, advanced segmentation.
 • Localization & Internationalization: Provide multi-language support for broader reach.

13. Summary

This Next.js + TypeScript application integrates Clerk for authentication, Supabase for the database, Tailwind CSS + ShadCN/UI for styling, and Framer Motion for animation. It includes robust role-based authorization for Users, Restaurant Admins, and System Admins. The platform offers digital punch cards, real-time QR code validation, prize management, gamified point transfers, achievements, and analytics dashboards. The included Drizzle ORM schema and CRUD/REST endpoints illustrate how data is managed and accessed, ensuring a clear, maintainable foundation for future growth and enhancements.


Dealslist Mobile Card
- orange dashed border: #ed8025
