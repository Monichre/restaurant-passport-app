import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/(public)/admin/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/(public)/**/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			spacing: {
				safe: "env(safe-area-inset-bottom)",
			},
			padding: {
				safe: "env(safe-area-inset-bottom)",
				"safe-top": "env(safe-area-inset-top)",
				"safe-bottom": "env(safe-area-inset-bottom)",
				"safe-left": "env(safe-area-inset-left)",
				"safe-right": "env(safe-area-inset-right)",
			},
			margin: {
				safe: "env(safe-area-inset-bottom)",
				"safe-top": "env(safe-area-inset-top)",
				"safe-bottom": "env(safe-area-inset-bottom)",
				"safe-left": "env(safe-area-inset-left)",
				"safe-right": "env(safe-area-inset-right)",
			},
		},
	},
	plugins: [],
};

export default config;
