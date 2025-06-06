// Mock Supabase client for Storybook

export interface MockSupabaseChannel {
  on: (event: string, config: any, callback: (payload: any) => void) => MockSupabaseChannel;
  subscribe: () => MockSupabaseSubscription;
  unsubscribe: () => void;
}

export interface MockSupabaseSubscription {
  unsubscribe: () => void;
}

export class MockSupabaseClient {
  private channels: Map<string, MockSupabaseChannel> = new Map();

  channel(name: string): MockSupabaseChannel {
    if (!this.channels.has(name)) {
      this.channels.set(name, new MockChannel());
    }
    return this.channels.get(name)!;
  }
}

class MockChannel implements MockSupabaseChannel {
  private callbacks: Array<(payload: any) => void> = [];

  on(event: string, config: any, callback: (payload: any) => void): MockSupabaseChannel {
    this.callbacks.push(callback);
    return this;
  }

  subscribe(): MockSupabaseSubscription {
    // In Storybook, we don't need real subscriptions
    return {
      unsubscribe: () => {
        // Clear callbacks
        this.callbacks = [];
      }
    };
  }

  unsubscribe(): void {
    this.callbacks = [];
  }

  // Method to simulate events for testing
  simulateEvent(payload: any): void {
    this.callbacks.forEach(callback => callback(payload));
  }
}

// Create the mock client instance
export const supabaseBrowserClient = new MockSupabaseClient();

// Also export as default for compatibility
export default supabaseBrowserClient; 