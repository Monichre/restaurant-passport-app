const path = require("node:path");

module.exports = {
	description: "Create a new feature",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Feature name:",
		},
		{
			type: "input",
			name: "component",
			message: "Main component name:",
		},
	],
	actions: [
		{
			type: "add",
			path: "src/features/{{camelCase name}}/{{pascalCase component}}.tsx",
			templateFile: path.join(__dirname, "feature-component.hbs"),
		},
		{
			type: "add",
			path: "src/features/{{camelCase name}}/index.ts",
			templateFile: path.join(__dirname, "feature-index.hbs"),
		},
	],
};
