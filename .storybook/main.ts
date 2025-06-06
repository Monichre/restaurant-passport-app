import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
    stories: [
        "../src/components/**/*.stories.tsx",
        "../src/features/**/*.stories.tsx"
    ],

    addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@chromatic-com/storybook",
	],

    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    staticDirs: ["../public"],

    typescript: {
        reactDocgen: "react-docgen-typescript"
    },

    env: (config) => ({
        ...config,
        DATABASE_URL: 'postgresql://mock:mock@localhost:5432/storybook',
    }),

    webpackFinal: async (config) => {
        // Add Node.js polyfills for webpack
        config.resolve = config.resolve || {};
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'net': false,
            'tls': false,
            'fs': false,
            'child_process': false,
            'perf_hooks': false,
            'crypto': false,
            'stream': false,
            'buffer': false,
            'util': false,
        };

        return config;
    },
};
export default config;

