const { argv } = require("process");
// const { readFile } = require("fs/promises");

(async function () {
	const db = await getDatabase();
	let query;
	if (argv[2]) {
		query = argv[2];
	} else {
		// const queries = (await readFile("sqlQuery.txt", { encoding: "utf8" })).split("\n");
		// let i = 0;
		// for (const query of queries) {
		// 	await db.execute(query);
		// 	console.log(`Inserted: ${++i}`);
		// }
		query =
			"DELETE s FROM students s INNER JOIN students s2 WHERE s.LastName=s2.LastName AND s.FirstName=s2.FirstName AND s.Email=s2.Email AND s.id<s2.id ;";
	}
	const [data] = await db.execute(query);
	console.log(data);
	return;
})();
