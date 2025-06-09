# TriggerSignUp.tsx Pseudocode

- Import Clerk's useSession (or useUser/useAuth)
- Import Next.js useRouter
- Get restaurantId from router params
- On mount:
  - If user is not signed in AND window.history.length === 1:
    - Show modal/banner: "Welcome! You scanned a code for [Restaurant Name]. Sign up to start earning rewards."
    - Store restaurantId in localStorage/sessionStorage
    - Optionally, POST to /api/qr/scan to log event
- On sign up completion (handled by Clerk):
  - Check for stored restaurantId
  - If present, POST to /api/qr/signup-complete to award reward
  - Remove restaurantId from storage
  - Redirect to restaurant detail or punch card page
- If user is signed in, render nothing (or null) 