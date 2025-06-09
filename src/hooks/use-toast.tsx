"use client";

import { useState } from "react";

interface ToastProps {
	title?: string;
	description?: string;
	variant?: "default" | "destructive";
}

interface Toast extends ToastProps {
	id: string;
}

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const toast = (props: ToastProps) => {
		const id = Date.now().toString();
		setToasts((prevToasts) => [...prevToasts, { ...props, id }]);

		// Auto-dismiss after 3 seconds
		setTimeout(() => {
			setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
		}, 3000);
	};

	return { toast, toasts };
}
