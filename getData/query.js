const { argv } = require("process");
const dotenv = require("dotenv");
const { getDatabase } = require("../db.js");
const { readFile } = require("fs/promises");

(async function () {
	if (argv[2] !== "--dev") dotenv.config();

	const db = await getDatabase();
	let query;
	if (argv[3]) {
		query = argv[3];
	} else {
		const queries = (await readFile("sqlQuery.txt", { encoding: "utf8" })).split("\n");
		let i = 0;
		for (const query of queries) {
			if (query == "") break;
			await db.execute(query);
			console.log(`Inserted: ${++i}`);
		}
	}
	const [data] = await db.execute(query);
	console.log(JSON.stringify({ data }, null, 4));
	return;
})();
