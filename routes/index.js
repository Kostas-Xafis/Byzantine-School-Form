module.exports = [
	Object.values(require("./registrations.js")),
	Object.values(require("./books.js")),
	Object.values(require("./authentication.js"))
].flat();
