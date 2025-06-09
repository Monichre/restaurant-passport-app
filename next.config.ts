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

	// PostHog rewrites to proxy analytics calls
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
			{
				source: "/ingest/decide",
				destination: "https://us.i.posthog.com/decide",
			},
		];
	},

	// This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
};

export default withBundleAnalyzer(nextConfig);
