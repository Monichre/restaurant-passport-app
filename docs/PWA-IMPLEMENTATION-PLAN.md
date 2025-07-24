# Restaurant Passport App - PWA Implementation Plan

## 1. Create Web App Manifest

1. Create `app/manifest.ts` file with the following properties:
   - Set `name` to "Restaurant Passport"
   - Set `short_name` to "RestPass" 
   - Set appropriate description, colors, and start URL
   - Define icons for various sizes (192x192, 512x512)

2. Generate app icons:
   - Use existing logo at `/public/logo.png` as base
   - Generate PWA icon set with different sizes
   - Place generated icons in `/public/`

## 2. Implement Service Worker

1. Create `public/sw.js` service worker file:
   - Handle push notifications
   - Implement notification click events
   - Add caching strategies for offline access
   - Configure custom notification appearance

2. Add service worker registration in a client component:
   - Create `src/components/pwa/service-worker-registration.tsx`
   - Register service worker during app initialization
   - Set up proper scope and update handling

## 3. Set Up Push Notifications

1. Generate VAPID keys:
   - Install web-push globally
   - Run `web-push generate-vapid-keys`
   - Store keys in `.env` file

2. Create server actions for push notification management:
   - Create `src/app/actions/push-notifications.ts`
   - Implement `subscribeUser`, `unsubscribeUser`, and `sendNotification` functions
   - Connect to database for subscription storage

3. Implement notification UI components:
   - Create `src/components/pwa/push-notification-manager.tsx`
   - Add subscribe/unsubscribe functionality
   - Build notification testing interface for admin users

## 4. Add "Install to Home Screen" Functionality

1. Create install prompt component:
   - Build `src/components/pwa/install-prompt.tsx`
   - Detect platform (iOS vs. Android)
   - Show appropriate installation instructions
   - Hide prompt when app is already installed

2. Integrate install prompt in app layout:
   - Add to main app layout or as a dismissible banner
   - Style to match app's design system

## 5. Configure Security Headers

1. Update `next.config.ts` to add security headers:
   - Set `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
   - Configure service worker specific headers
   - Implement Content Security Policy

## 6. Implement Offline Support

1. Configure offline access for critical pages:
   - Cache restaurant data for offline browsing
   - Store user punch cards locally
   - Implement offline indicator component

2. Add background sync capabilities:
   - Queue scan operations when offline
   - Sync when connection is restored
   - Notify users when offline actions complete

## 7. Testing Plan

1. Local testing setup:
   - Configure local HTTPS using `next dev --experimental-https`
   - Test across multiple browsers and devices
   - Verify offline functionality and notifications

2. Create testing checklist:
   - Manifest validation
   - Service worker registration
   - Push notification subscription/delivery
   - Home screen installation
   - Offline behavior verification

## 8. Integration with Existing Features

1. Connect with punch card system:
   - Enable offline punch card viewing
   - Queue scan operations when offline
   - Sync with server when online

2. Restaurant listing enhancements:
   - Cache restaurant data for offline access
   - Show offline indicator when viewing cached data
   - Provide graceful degradation for unavailable features

## Implementation Schedule

1. Week 1: Basic PWA setup
   - Web app manifest
   - Service worker implementation
   - Security headers configuration

2. Week 2: Push notifications
   - VAPID key generation
   - Server actions implementation
   - Notification UI components

3. Week 3: Offline support
   - Caching strategies
   - Background sync
   - Offline indicators

4. Week 4: Testing and refinement
   - Cross-browser testing
   - Performance optimization
   - Documentation