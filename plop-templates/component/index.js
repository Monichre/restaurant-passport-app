const path = require("node:path");
const fs = require("node:fs");

module.exports = {
	description: "Create a new component",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "Component name:",
		},
		{
			type: "list",
			name: "type",
			message: 'Component type (select "none" for a custom folder):',
			choices: ["none", "ui", "kokonutui", "magicui", "admin", "qr-code"],
			default: "none",
		},
	],
	actions: (data) => {
		console.log("🚀 ~ data:", data);

		const root = path.join(__dirname, "..", "..");

		console.log("🚀 ~ root:", root);

		const folderName = data.type === "none" ? data.name : data.type;

		console.log("🚀 ~ folderName:", folderName);

		console.log("🚀 ~ root:", root);

		const destinationPath = path.join(
			root,
			"src",
			"components",
			folderName,
			// data.name,
		);

		console.log("🚀 ~ destinationPath:", destinationPath);

		return [
			{
				type: "add",
				path: path.join(destinationPath, "index.tsx"),
				templateFile: path.join(__dirname, "index.hbs"),
			},
			{
				type: "add",
				// if type is "none", create a new folder with the component name
				path: path.join(destinationPath, `${data.name}.tsx`),
				templateFile: path.join(__dirname, "component.hbs"),
			},
		];
	},
};
