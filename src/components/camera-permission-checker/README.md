# Camera Permission Checker Component

A reusable React component for checking and requesting camera permissions. This component provides a user-friendly interface for handling camera permissions in web applications.

## Features

- Checks camera permission status (granted, denied, prompt, checking)
- Provides visual feedback about the current permission state
- Handles permission requests with retry options
- Special handling for Arc browser in incognito mode
- Allows callback functions for permission granted/denied events

## Usage

### Basic Usage

```tsx
import { CameraPermissionChecker } from "@/components/camera-permission-checker";

export function MyComponent() {
  return (
    <div>
      <h1>My Camera App</h1>
      
      <CameraPermissionChecker
        onPermissionGranted={() => console.log("Camera permission granted")}
        onPermissionDenied={() => console.log("Camera permission denied")}
      />
      
      {/* Rest of your component */}
    </div>
  );
}
```

### Hidden Status Display

You can use the component to check permissions without showing the UI:

```tsx
<CameraPermissionChecker
  onPermissionGranted={() => startCamera()}
  onPermissionDenied={() => showCustomError()}
  showStatus={false}
/>
```

### Custom Permission Flow

You can disable the automatic permission check on mount:

```tsx
function MyComponent() {
  const startScan = () => {
    // Start scanning logic
  };
  
  return (
    <div>
      <button onClick={startScan}>Start Scan</button>
      
      <CameraPermissionChecker
        onPermissionGranted={startScan}
        checkOnMount={false}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPermissionGranted` | `() => void` | `undefined` | Called when camera permission is granted |
| `onPermissionDenied` | `() => void` | `undefined` | Called when camera permission is denied |
| `checkOnMount` | `boolean` | `true` | Whether to check camera permission when the component mounts |
| `showStatus` | `boolean` | `true` | Whether to show the permission status UI |

## Browser Compatibility

The component includes special handling for:

- Arc browser in incognito mode
- Safari on iOS
- General browser compatibility checks

## Integration with QR Scanner

This component is designed to work seamlessly with QR code scanners and other camera-based features:

```tsx
import { CameraPermissionChecker } from "@/components/camera-permission-checker";
import { QrReader } from "react-qr-reader";

function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  
  return (
    <div>
      <CameraPermissionChecker
        onPermissionGranted={() => setIsScanning(true)}
        onPermissionDenied={() => console.log("Please enable camera access")}
      />
      
      {isScanning && (
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result) => {
            if (result) {
              console.log("QR Code scanned:", result);
            }
          }}
        />
      )}
    </div>
  );
}
```
