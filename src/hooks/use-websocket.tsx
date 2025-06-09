"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WsMessage = {
	type: string;
	payload: Record<string, unknown>;
};

export function useWebSocket() {
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		// Get WebSocket URL from environment or use a default
		const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

		// Create WebSocket connection
		const socket = new WebSocket(wsUrl);
		socketRef.current = socket;

		// Connection opened
		socket.addEventListener("open", () => {
			setIsConnected(true);
		});

		// Connection closed
		socket.addEventListener("close", () => {
			setIsConnected(false);
		});

		// Connection error
		socket.addEventListener("error", (error) => {
			console.error("WebSocket error:", error);
			setIsConnected(false);
		});

		// Clean up on unmount
		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	}, []);

	// Send message function
	const sendMessage = useCallback((message: WsMessage) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not connected");
		}
	}, []);

	return {
		isConnected,
		sendMessage,
		socket: socketRef.current,
	};
}
