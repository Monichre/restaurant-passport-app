"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SseMessage = {
	type: string;
	payload: Record<string, unknown>;
};

export function useServerSentEvent(endpoint = "/api/sse") {
	const [isConnected, setIsConnected] = useState(false);
	const [lastMessage, setLastMessage] = useState<SseMessage | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);
	const messageListenersRef = useRef<((message: SseMessage) => void)[]>([]);

	// Initialize SSE connection
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		// Create EventSource connection
		const eventSource = new EventSource(endpoint);
		eventSourceRef.current = eventSource;

		// Connection opened
		eventSource.onopen = () => {
			setIsConnected(true);
		};

		// Connection error
		eventSource.onerror = (error) => {
			console.error("SSE error:", error);
			setIsConnected(false);

			// Try to reconnect after a delay
			setTimeout(() => {
				eventSource.close();
				// The effect cleanup will run and the effect will re-run,
				// creating a new connection
			}, 5000);
		};

		// Handle incoming messages
		eventSource.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data) as SseMessage;
				setLastMessage(message);

				// Notify all listeners
				for (const listener of messageListenersRef.current) {
					listener(message);
				}
			} catch (error) {
				console.error("Error parsing SSE message:", error);
			}
		};

		// Clean up on unmount
		return () => {
			eventSource.close();
			setIsConnected(false);
		};
	}, [endpoint]);

	// Add message listener
	const addMessageListener = useCallback(
		(listener: (message: SseMessage) => void) => {
			messageListenersRef.current.push(listener);

			// Return function to remove listener
			return () => {
				messageListenersRef.current = messageListenersRef.current.filter(
					(l) => l !== listener,
				);
			};
		},
		[],
	);

	// Send message to server (using fetch since SSE is one-way)
	const sendMessage = useCallback(
		async (message: Omit<SseMessage, "id">) => {
			try {
				const response = await fetch(`${endpoint}/send`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(message),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				return await response.json();
			} catch (error) {
				console.error("Error sending message:", error);
				throw error;
			}
		},
		[endpoint],
	);

	return {
		isConnected,
		lastMessage,
		addMessageListener,
		sendMessage,
	};
}
