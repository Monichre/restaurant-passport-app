"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Camera, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CameraPermissionCheckerProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  checkOnMount?: boolean;
  showStatus?: boolean;
}

export const CameraPermissionChecker = ({
  onPermissionGranted,
  onPermissionDenied,
  checkOnMount = true,
  showStatus = true,
}: CameraPermissionCheckerProps) => {
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt" | "checking" | null>(null);
  const [isIncognito, setIsIncognito] = useState(false);
  const [isArcBrowser, setIsArcBrowser] = useState(false);

  const checkIncognitoMode = useCallback(async () => {
    try {
      // Check if user agent contains "Arc"
      if (navigator.userAgent.includes("Arc")) {
        setIsArcBrowser(true);
      }
      
      // Common ways to detect incognito mode
      const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
      if (fs) {
        fs(
          (window as any).TEMPORARY,
          100,
          () => setIsIncognito(false),
          () => setIsIncognito(true)
        );
      } else if (!navigator.cookieEnabled) {
        setIsIncognito(true);
      } else {
        // Try to check for service worker which might be restricted in incognito
        const serviceWorkerAvailable = 'serviceWorker' in navigator;
        if (!serviceWorkerAvailable) {
          setIsIncognito(true);
        }
      }
    } catch (err) {
      console.error("Error checking incognito mode:", err);
    }
  }, []);

  const checkCameraPermission = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionStatus("denied");
      onPermissionDenied?.();
      return false;
    }

    try {
      setPermissionStatus("checking");
      
      // Try to get permission status
      if ('permissions' in navigator) {
        try {
          const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          if (status.state === 'granted') {
            setPermissionStatus("granted");
            onPermissionGranted?.();
            return true;
          } else if (status.state === 'denied') {
            setPermissionStatus("denied");
            onPermissionDenied?.();
            return false;
          } else {
            setPermissionStatus("prompt");
          }
        } catch (err) {
          console.log("Permissions API not supported, falling back to getUserMedia");
        }
      }
      
      // Fallback to directly requesting camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Clean up stream right away
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus("granted");
      onPermissionGranted?.();
      return true;
    } catch (err) {
      console.error("Camera permission check failed:", err);
      setPermissionStatus("denied");
      onPermissionDenied?.();
      return false;
    }
  }, [onPermissionGranted, onPermissionDenied]);

  const requestPermission = useCallback(async () => {
    try {
      setPermissionStatus("checking");
      
      // Special handling for Arc browser in incognito
      if (isArcBrowser && isIncognito) {
        // Try first with basic constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          
          setPermissionStatus("granted");
          onPermissionGranted?.();
          toast.success("Camera access granted!");
          return true;
        } catch (firstErr) {
          console.log("Basic permission request failed:", firstErr);
          
          // Try with more specific constraints
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: "environment" },
              audio: false
            });
            
            stream.getTracks().forEach(track => track.stop());
            
            setPermissionStatus("granted");
            onPermissionGranted?.();
            toast.success("Camera access granted!");
            return true;
          } catch (secondErr) {
            console.error("Camera permission request failed:", secondErr);
            setPermissionStatus("denied");
            onPermissionDenied?.();
            toast.error("Camera access denied", {
              description: "Please check your browser settings."
            });
            return false;
          }
        }
      } else {
        // Standard approach for other browsers
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" }
        });
        
        stream.getTracks().forEach(track => track.stop());
        
        setPermissionStatus("granted");
        onPermissionGranted?.();
        toast.success("Camera access granted!");
        return true;
      }
    } catch (err) {
      console.error("Camera permission request failed:", err);
      setPermissionStatus("denied");
      onPermissionDenied?.();
      toast.error("Camera access denied", {
        description: "Please check your browser settings."
      });
      return false;
    }
  }, [isArcBrowser, isIncognito, onPermissionGranted, onPermissionDenied]);

  // Check on mount if required
  useEffect(() => {
    checkIncognitoMode();
    
    if (checkOnMount) {
      checkCameraPermission();
    }
  }, [checkOnMount, checkCameraPermission, checkIncognitoMode]);

  // Don't render anything if status shouldn't be shown
  if (!showStatus) {
    return null;
  }

  return (
    <div className="mb-4">
      {permissionStatus === "granted" && (
        <Alert variant="success" className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Camera access granted</AlertTitle>
          <AlertDescription>
            You can use the QR scanner.
          </AlertDescription>
        </Alert>
      )}
      
      {permissionStatus === "denied" && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Camera access denied</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Please allow camera access to use the QR scanner.</p>
            
            {isArcBrowser && isIncognito && (
              <div className="text-sm bg-amber-50 p-2 rounded border border-amber-100">
                <p className="font-medium">Arc Browser in Incognito Mode Detected</p>
                <p>Check for permission prompts in your browser toolbar.</p>
              </div>
            )}
            
            <Button onClick={requestPermission} className="mt-2">
              <Camera className="mr-2 h-4 w-4" />
              Request Camera Access
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {(permissionStatus === "prompt" || permissionStatus === null) && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Camera className="h-4 w-4 text-blue-600" />
          <AlertTitle>Camera permission required</AlertTitle>
          <AlertDescription>
            <p>Grant camera access to use the QR scanner.</p>
            <Button onClick={requestPermission} className="mt-2 bg-blue-600 hover:bg-blue-700">
              Check Camera Permission
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {permissionStatus === "checking" && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Camera className="h-4 w-4 text-blue-600 animate-pulse" />
          <AlertTitle>Checking camera permission...</AlertTitle>
          <AlertDescription>
            Please wait while we check camera access.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 