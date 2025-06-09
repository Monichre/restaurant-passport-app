import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

// Determine if we're in production build mode
const isProduction = process.env.NODE_ENV === "production";

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			// Disable rules that are too strict for production builds
			"@typescript-eslint/no-explicit-any": isProduction ? "off" : "warn",
			"@typescript-eslint/no-unused-vars": isProduction ? "off" : "warn",
			"no-console": isProduction ? "off" : "warn",
			"no-unused-vars": isProduction ? "off" : "warn",
			// Make TypeScript errors warnings instead of errors in production
			"@typescript-eslint/ban-ts-comment": isProduction ? "off" : "warn",
			// Downgrade some rule severities for both development and production
			"react/no-unescaped-entities": "off",
			"react/display-name": "off",
			"@next/next/no-img-element": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-empty-object-type": "off",
		},
		// Configure linting to not break builds in production
		settings: {
			next: {
				// Don't error on certain Next.js warnings
				rootDir: ".",
			},
		},
	},
];

// Note: ESLint doesn't support a global "error to warning" setting
// Individual rule severities are already configured above based on isProduction

export default eslintConfig;
