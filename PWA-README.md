# Restaurant Passport App - PWA Features

This application has been enhanced with Progressive Web App (PWA) capabilities, allowing users to install it on their home screens and access content offline.

## PWA Features

- **Offline Access**: Key restaurant data and user punch cards are available even without an internet connection
- **Home Screen Installation**: Users can add the app to their home screen for quick access
- **Push Notifications**: Stay updated with restaurant deals and promotions
- **App-like Experience**: Smooth navigation and UI that feels like a native app

## Development

### Running with HTTPS for PWA Testing

To test PWA features during development, run the app with HTTPS enabled:

```bash
bun run dev:https
```

This enables ServiceWorker registration and push notifications during local development.

### Browser Support

PWA features are supported in most modern browsers:
- Chrome (Android, Desktop)
- Edge
- Firefox
- Safari (iOS 16.4+ for installed PWAs, macOS 13+ with Safari 16)

## Push Notifications

### Generating VAPID Keys

Before using push notifications, you need to generate VAPID keys:

```bash
bun install -g web-push
web-push generate-vapid-keys
```

Add the generated keys to your `.env` file:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### How Notifications Work

1. Users subscribe to notifications via the UI
2. The browser generates a unique push subscription
3. The service worker receives push messages and displays notifications
4. Users can click notifications to navigate to specific content

## Installation Instructions

### iOS/iPadOS

1. Open the app in Safari
2. Tap the Share button (rectangle with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right corner

### Android

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install app"
4. Follow the prompts to complete installation

### Desktop

1. Open the app in Chrome or Edge
2. Look for the installation icon in the address bar (or 3-dot menu)
3. Click "Install" and follow the prompts

## Implementation Details

The PWA implementation includes:

- `src/app/manifest.ts` - App manifest with metadata
- `public/sw.js` - Service worker for offline caching and notifications
- `src/components/pwa/` - Components for PWA functionality
- Security headers in `next.config.ts`

## Testing PWA Features

1. **Offline Mode**: 
   - Open the application in Chrome
   - Turn on Developer Tools
   - Go to Network tab and enable "Offline"
   - Navigate through the app to test offline functionality

2. **Installation**:
   - Visit the site in a supported browser
   - Look for install prompts or use the "Add to Home Screen" button

3. **Push Notifications**:
   - Subscribe to notifications using the UI
   - Test notification delivery via admin interface

## Code Organization

- `src/components/pwa/service-worker-registration.tsx` - Registers the service worker
- `src/components/pwa/push-notification-manager.tsx` - UI for notification management
- `src/components/pwa/install-prompt.tsx` - Installation instruction UI
- `src/components/pwa/offline-indicator.tsx` - Shows online/offline status
- `src/app/offline/page.tsx` - Fallback page for offline users