# QR Onboarding for /restaurants/[id] Route

## 1. Client-Side Detection
- Create a client component (QrOnboardingGate)
- On mount:
  - Use Clerk's `useUser` or `useAuth` to check if user is authenticated
  - Use Next.js `useRouter` to get `restaurantId` from params
  - Check if `window.history.length === 1` (direct entry, likely from QR scan)
  - Optionally, check for a query param (e.g., ?qr=1) for robustness

## 2. If Unauthenticated and Direct Entry
- Show a modal or banner:
  - Message: "Welcome! You scanned a code for [Restaurant Name]. Sign up to start earning rewards."
  - Display Sign Up and Sign In buttons (Clerk UI)
- Store `restaurantId` in localStorage or sessionStorage for context preservation
- Optionally, log the scan event via API (POST /api/qr/scan)

## 3. On Successful Signup
- After signup, check for stored `restaurantId` context
- If present:
  - Call backend API (POST /api/qr/signup-complete) with `{ restaurantId }` to award onboarding reward (badge, points, punch card)
  - Optionally, remove the context from storage
  - Redirect user to the restaurant detail or punch card page

## 4. If Authenticated
- Show normal restaurant detail content (no modal/banner)

## 5. Edge Cases
- If `restaurantId` is invalid or missing, show an error and allow generic signup
- If user is already signed up and scans again, show normal flow
- Prevent duplicate rewards for the same user/restaurant
- Handle abandoned signups (no reward until signup completes) 