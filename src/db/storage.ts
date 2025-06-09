// Storage Module - Main Entry Point
// Re-exports all storage functionality in a unified interface

// Types and utilities
export * from "./storage/storage-types";

// Server-side operations (with "use server")
export * from "./storage/storage-server";

// Client-side operations (with "use client")
export * from "./storage/storage-client";

// Default export with all functions for convenience
import * as storageServer from "./storage/storage-server";
import * as storageClient from "./storage/storage-client";
import * as storageTypes from "./storage/storage-types";

export default {
  // Server operations
  ...storageServer,
  
  // Client operations  
  ...storageClient,
  
  // Utility functions and constants
  ...storageTypes,
};
