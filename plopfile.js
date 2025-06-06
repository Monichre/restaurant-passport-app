const componentGenerator = require("./plop-templates/component");
const featureGenerator = require("./plop-templates/feature");

module.exports = (plop) => {
	plop.setGenerator("component", componentGenerator);
	plop.setGenerator("feature", featureGenerator);
};
