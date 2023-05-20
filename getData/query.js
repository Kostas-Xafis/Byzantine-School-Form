const { argv } = require("process");
const dotenv = require("dotenv");
const { getDatabase } = require("../db.js");
const { readFile } = require("fs/promises");

(async function () {
	if (argv[2] !== "--dev" && argv[2] !== "--prod") return;
	if (argv[2] === "--prod") dotenv.config();
	const db = await getDatabase();
	let query;
	if (argv[3] === "-f") {
		let file = argv[4] || "sqlQuery.txt";
		const queries = (await readFile(file, { encoding: "utf8" })).split("\n");
		let i = 0;
		for (const query of queries) {
			if (query == "") break;
			await db.execute(query);
			console.log(`Inserted: ${++i}`);
		}
	} else {
		query = argv[3];
	}
	const [data] = await db.execute(query);
	console.log(JSON.stringify({ data }, null, 4));
	return;
})();
