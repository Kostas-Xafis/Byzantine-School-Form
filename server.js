const express = require("express");
const Router = require("./router");
const process = require("process");

process.on("uncaughtException", function (err) {
	console.log(err);
});

const app = express();
const portNum = process.env.PORT || 5000;

app.use(express.json({ limit: "100mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/static"));
app.use("/", express.static("public/home", { index: "index.html" }));
app.use("/admin", express.static("public/admin", { index: "admin.html" }));
(async function () {
	try {
		const router = await Router();
		app.use("/", router);
		app.listen(portNum, () => console.log("Server listening in " + portNum));
	} catch (err) {
		console.error(err);
	}
})();
