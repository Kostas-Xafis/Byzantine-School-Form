const express = require("express");
const initRouter = require("./router");
const process = require("process");
const cookieParser = require("cookie-parser");

process.on("uncaughtException", function (err) {
	console.log(err);
});

const app = express();
const portNum = process.env.PORT || 5000;

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/static"));
app.use("/", express.static("public/home", { index: "index.html" }));
app.use("/admin", express.static("public/admin", { index: "admin.html" }));
app.use("/books", express.static("public/books", { index: "books.html" }));
app.use("/login", express.static("public/login", { index: "login.html" }));
app.use("/payments", express.static("public/payments", { index: "payments.html" }));

(async function () {
	try {
		const Router = await initRouter();
		app.use("/", Router);
		app.listen(portNum, () => console.log(`Server hosted at: http://localhost:${portNum}`));
	} catch (err) {
		console.error(err);
	}
})();
