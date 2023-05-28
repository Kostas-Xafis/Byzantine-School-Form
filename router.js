const { existsSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config({
	path: existsSync("./.local.env") ? "./.local.env" : "./.prod.env",
	debug: true
});
const express = require("express");
const { getDatabase } = require("./db.js");
const routes = require("./routes/index.js");

module.exports = initRouter = async function () {
	const router = express.Router();
	const db = await getDatabase();
	console.log(routes.map(route => route.method.toUpperCase() + ":" + route.path));
	for (const route of routes) {
		const { method, path, func } = route;
		router[method](path, func(db));
	}
	return router;
};
