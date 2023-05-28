const { argv } = require("process");
const dotenv = require("dotenv");
const { getDatabase } = require("../db.js");
const { readFile } = require("fs/promises");

(async function () {
	if (argv[2] !== "--prod" && argv[2] !== "--dev") return console.log("No environment specified");
	const env = argv[2];
	dotenv.config({ path: env === "--dev" ? "../.local.env" : "../.prod.env" });
	const db = await getDatabase();
	if (argv[3] === "--file") {
		let file = argv[4];
		if (!file) return console.log("No file specified");
		const fileString = await readFile(file, { encoding: "utf8" });
		const queries = argv[5] === "--single" ? [fileString.replace("\n", "")] : fileString.split("\n");
		let i = 0;
		for (const query of queries) {
			if (query === "") break;
			await db.execute(query);
			console.log(`Executed queries: ${++i}`);
		}
		return;
	}
	// If the is no specified file, then the query is the third argument
	const query = argv[3];
	if (!query) return console.log("No query specified");
	const [data] = await db.execute(query);
	console.log(JSON.stringify({ data }, null, 4));
	return;
})();
