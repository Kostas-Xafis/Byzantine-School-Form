module.exports = [
	Object.values(require("./registrations.js")),
	Object.values(require("./books.js")),
	Object.values(require("./authentication.js")),
	Object.values(require("./payments.js")),
	Object.values(require("./wholesalers.js")),
	Object.values(require("./payoffs.js"))
].flat();
