"use client";

import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

interface SidebarContextType {
	collapsed: boolean;
	toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);

	const toggleCollapse = () => {
		setCollapsed(!collapsed);
	};

	return (
		<SidebarContext.Provider value={{ collapsed, toggleCollapse }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}
