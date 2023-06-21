const { existsSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config({
	path: existsSync("./.local.env") ? "./.local.env" : "./.prod.env",
	debug: true
});

const express = require("express");
const { getDatabase } = require("./db.js");
const routes = require("./routes/index.js");
const { authMw } = require("./middleware/authenticate.js");
module.exports = initRouter = async function () {
	const router = express.Router();
	const db = await getDatabase();
	console.log(routes.map(route => route.method.toUpperCase() + ":" + route.path));
	for (const route of routes) {
		const { method, path, func, authenticate } = route;
		if (authenticate) router[method](path, authMw(db), func(db));
		else router[method](path, func(db));
	}
	return router;
};
