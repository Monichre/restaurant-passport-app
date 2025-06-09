import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true", // Enable only when ANALYZE environment variable is set
});

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	// Less strict type checking in production builds
	typescript: {
		// In production, don't fail the build if there are TypeScript errors
		ignoreBuildErrors: isProduction,
	},
	// Less strict ESLint checking in production builds
	eslint: {
		// In production, don't fail the build if there are ESLint errors
		ignoreDuringBuilds: isProduction,
	},
	// Performance optimizations

	// In development, enable React strict mode

	// Improve load times with compression
	compress: true,
	// Improve performance with statically exported pages where possible

	// Improved bundling

	// Image configuration
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "fastly.picsum.photos",
			},
			{
				protocol: "https",
				hostname: "media.canva.com",
			},
			{
				protocol: "https",
				hostname: "experiencemaplegrove.com",
			},
			{
				protocol: "https",
				hostname: "hvjiuuzpupgmckuyfahe.supabase.co",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
				{
				protocol: "https",
				hostname: "www.experiencemaplegrove.app",
			},
			{
				protocol: "https",
				hostname: "*.com",
			},
				{
				protocol: "https",
				hostname: "*.net",
			},
			{
				protocol: "https",
				hostname: "*.org",
			},
			{
				protocol: "https",
				hostname: "malonesbarandgrill.net",
			},
	
			
		],
	},
};
export default withBundleAnalyzer(nextConfig);
// export default withSentryConfig(nextConfig, {
// 	// For all available options, see:
// 	// https://www.npmjs.com/package/@sentry/webpack-plugin#options

// 	org: "digital-mischief-group",
// 	project: "restaurant-passport-app",

// 	// Only print logs for uploading source maps in CI
// 	silent: !process.env.CI,

// 	// For all available options, see:
// 	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// 	// Upload a larger set of source maps for prettier stack traces (increases build time)
// 	widenClientFileUpload: true,

// 	// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// 	// This can increase your server load as well as your hosting bill.
// 	// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// 	// side errors will fail.
// 	tunnelRoute: "/monitoring",

// 	// Automatically tree-shake Sentry logger statements to reduce bundle size
// 	disableLogger: true,

// 	// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// 	// See the following for more information:
// 	// https://docs.sentry.io/product/crons/
// 	// https://vercel.com/docs/cron-jobs
// 	automaticVercelMonitors: true,
// });
