# Maple Grove Restaurant Week Homepage Redesign Pseudocode

## Overview
Transform the current homepage into a mobile-first landing page for Maple Grove Restaurant Week with a cream background, custom branding, and promotional CTAs.

## Component Structure

### 1. Main Container
```
- Set viewport-optimized container (414px × 896px mobile view)
- Apply cream background (#F5F2ED)
- Add decorative background elements (subtle, low opacity)
- Implement vertical scroll with fixed bottom navigation
```

### 2. Header Section
```
- Create centered text block with:
  - "EXPERIENCE" (small, gray text)
  - "MAPLE GROVE" (medium, blue accent)
  - "DINE, SCAN, WIN!" (large, multi-color: orange/blue/green)
- Apply proper spacing and typography
```

### 3. Logo Badge Component
```
- Create circular badge (200px × 200px) with:
  - Green border (4px stroke)
  - Maple leaf icon at top
  - "MAPLE GROVE" text
  - "RESTAURANT" text (larger)
  - "Week" in script font
  - Restaurant icons (fork, burger, wine) at bottom
- Center align all elements
```

### 4. Content Section
```
- Add descriptive text:
  - "Get Started with Your" (regular gray)
  - "Digital Passport" (semibold green)
  - Description paragraph about scanning QR codes
- Center align with proper spacing
```

### 5. CTA Buttons
```
- Create horizontal button group:
  - "See Deals" button (orange background, white text)
  - "Sign up to scan" button (green background, white text)
- Apply hover/press states
- Link to appropriate routes
```

### 6. Bottom Navigation
```
- Create fixed bottom nav with:
  - Left: Dark circular "N" icon
  - Right: Green pill with tag and user icons
- Position 32px from bottom
```

## Color Variables
```
--bg-canvas: #F5F2ED
--accent-orange: #F97316
--accent-blue: #06B6D4
--accent-green: #22C55E
--brand-green: #16A34A
--text-primary: #374151
--text-secondary: #9CA3AF
```

## Responsive Considerations
- Mobile-first design (414px width)
- Fixed layout for mobile viewport
- Consider tablet/desktop breakpoints for future

## Animation States
- Button hover: opacity 0.9
- Button press: scale 0.95
- Smooth transitions (150ms ease)

## Integration Points
- Clerk authentication for "Sign up to scan"
- Link "See Deals" to /deals route
- Bottom nav links to appropriate sections
- Maintain existing auth logic 