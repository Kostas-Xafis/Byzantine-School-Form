const express = require("express");
const router = require("./router");
const process = require("process");

process.on("uncaughtException", function (err) {
	console.log(err);
});

const app = express();
const portNum = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("public", { index: "index.html" })); //Serve the /public directory as static files with the main html being "frontend.html"
(async function () {
	try {
		// const routes = await router();
		app.use("/", router);
		app.listen(portNum, () => console.log("Server listening in " + portNum));
	} catch (err) {
		console.error(err);
	}
})();
