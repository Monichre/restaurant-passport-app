import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, hasError, ...props }, ref) => {
		// Track if input was touched on mobile to determine when to show virtual keyboard
		const [isTouched, setIsTouched] = React.useState(false);
		const inputRef = React.useRef<HTMLInputElement>(null);

		// Combine refs (forwarded ref and internal ref)
		const setRefs = React.useCallback(
			(element: HTMLInputElement | null) => {
				// Update our internal ref
				if (inputRef.current !== element) {
					inputRef.current = element;
				}

				// Forward the ref if provided
				if (typeof ref === "function") {
					ref(element);
				} else if (ref) {
					ref.current = element;
				}
			},
			[ref],
		);

		// Handle focus issues on iOS Safari
		React.useEffect(() => {
			const handleTouchStart = (e: TouchEvent) => {
				// Only set touched if it's this input element being touched
				if (e.target === inputRef.current) {
					setIsTouched(true);
				}
			};

			// Use passive listener for better performance
			document.addEventListener("touchstart", handleTouchStart, {
				passive: true,
			});

			return () => {
				document.removeEventListener("touchstart", handleTouchStart);
			};
		}, []);

		return (
			<input
				type={type}
				className={cn(
					"flex h-14 w-full rounded-md border border-input bg-background px-4 py-4 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
					hasError &&
						"border-red-500 focus-visible:ring-red-500 placeholder:text-red-500",
					className,
				)}
				ref={setRefs}
				onTouchStart={(e) => {
					// Prevent delayed responses on some mobile browsers
					e.stopPropagation();

					// Call the original onTouchStart if provided
					props.onTouchStart?.(e);
				}}
				onTouchEnd={(e) => {
					// Fix the 300ms tap delay on mobile browsers
					if (isTouched && inputRef.current) {
						// Manually focus the input (helps on iOS Safari)
						inputRef.current.focus();
					}

					// Call the original onTouchEnd if provided
					props.onTouchEnd?.(e);
				}}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
