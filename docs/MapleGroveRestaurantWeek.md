# Maple Grove Restaurant Week Homepage Implementation

## Overview
This document outlines the implementation of the Maple Grove Restaurant Week landing page, a mobile-first promotional page for a local restaurant week event.

## Key Modules and Components

### 1. Main Page Component (`src/app/page.tsx`)
The primary landing page component that renders the entire Maple Grove Restaurant Week experience.

#### Structure:
- **Container**: Full-screen div with cream background (#F5F2ED)
- **Background Elements**: Decorative text elements positioned absolutely
- **Content Container**: Max-width container (414px) with responsive padding
- **Fixed Navigation**: Bottom navigation bar with user/tag icons

### 2. Component Architecture

#### Header Section
- **Experience Text**: Small gray text introducing the location
- **Location Name**: "MAPLE GROVE" in blue accent color
- **Tagline**: Multi-colored "DINE, SCAN, WIN!" with individual color spans

#### Logo Badge
- **Container**: 200x200px relative positioned div
- **Border**: 4px green circular border
- **Maple Leaf**: Custom SVG icon positioned at top
- **Text Hierarchy**:
  - "MAPLE GROVE" (small, uppercase)
  - "RESTAURANT" (medium, uppercase)
  - "Week" (cursive/italic style)
- **Icons**: Fork, burger, and wine glass SVGs at bottom

#### Content Section
- **Introduction**: "Get Started with Your Digital Passport"
- **Description**: Explanation of the QR scanning process
- **Typography**: Centered text with proper line heights

#### CTA Buttons
- **See Deals**: Orange button linking to /deals
- **Sign Up**: Green button with conditional rendering:
  - Shows "Sign up to scan" for unauthenticated users
  - Shows "Start scanning" for authenticated users

#### Bottom Navigation
- **Position**: Fixed positioning, 32px from bottom
- **Left Icon**: Dark circular "N" logo
- **Right Pills**: Green background with tag and user icons

### 3. Data Flow

#### Authentication Flow
```typescript
const session = await auth()  // Get Clerk session
const userid = session?.userId  // Extract user ID

// Conditional rendering based on auth state
{!userid ? (
  <SignUpButton mode="modal">
    <button>Sign up to scan</button>
  </SignUpButton>
) : (
  <Link href='/restaurants'>
    Start scanning
  </Link>
)}
```

#### Navigation Flow
- **Unauthenticated Users**:
  - See Deals → /deals (public route)
  - Sign up to scan → Clerk modal signup
  
- **Authenticated Users**:
  - See Deals → /deals
  - Start scanning → /restaurants

### 4. Styling Approach

#### Color Palette
```css
--bg-canvas: #F5F2ED        /* Cream background */
--accent-orange: #F97316    /* Orange for "DINE" and deals button */
--accent-blue: #06B6D4      /* Blue for "SCAN" and location */
--accent-green: #22C55E     /* Light green for "WIN!" and CTA */
--brand-green: #16A34A      /* Dark green for logo and nav */
--text-primary: #374151     /* Dark gray for body text */
--text-secondary: #9CA3AF   /* Light gray for secondary text */
```

#### Responsive Design
- Mobile-first approach with 414px max-width
- Fixed bottom navigation for mobile UX
- Horizontal button layout with flex gap
- Padding adjustments for smaller screens

#### Animation States
```css
/* Button hover effect */
hover:opacity-90 transition-opacity duration-150

/* Button press effect */
active:scale-95

/* Background decorative elements */
opacity-10 rotate-12  /* Subtle rotation and transparency */
```

### 5. Integration Points

#### Clerk Authentication
- Uses `@clerk/nextjs` for authentication
- `SignUpButton` component with modal mode
- Server-side auth check via `auth()`

#### Routing
- Next.js Link component for internal navigation
- Routes:
  - `/deals` - Deals listing page
  - `/restaurants` - Restaurant directory (authenticated)

#### Icons
- Lucide React for navigation icons (Tag, User)
- Custom SVGs for:
  - Maple leaf logo
  - Restaurant icons (fork, burger, wine)

### 6. Accessibility Features

- **Semantic HTML**: Proper heading hierarchy (h1, h2, p)
- **Color Contrast**: All text meets WCAG AA standards
- **Touch Targets**: Buttons meet 44px minimum height
- **Focus States**: Default browser focus indicators maintained

### 7. Performance Optimizations

- **No External Images**: All graphics are inline SVGs
- **Minimal Dependencies**: Only essential packages (Clerk, Lucide)
- **Server Component**: Leverages Next.js server components
- **CSS-in-JS**: Tailwind utilities for optimal CSS delivery

## Future Enhancements

1. **Tablet/Desktop Layouts**: Add responsive breakpoints for larger screens
2. **Animation**: Add entrance animations with Framer Motion
3. **PWA Features**: Implement offline support and install prompts
4. **Analytics**: Add event tracking for button clicks
5. **A/B Testing**: Test different CTA copy and colors 