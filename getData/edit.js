const { readFile, writeFile } = require("fs/promises");

(async function () {
	let ids = {};
	let queries = (await readFile("lessons.txt", { encoding: "utf8" })).split("\n");
	let id = 1;
	queries = queries.map(query => {
		let a = query.match(/[0-9]{3}/g)[0];
		if (a in ids) id = ids[a];
		else {
			ids[a] = id;
		}
		return query.replace(/[0-9]{3}/g, id++);
	});
	let file = "";
	queries.forEach(q => (file += q + "\n"));
	await writeFile("some.txt", file, { encoding: "utf-8" });
})();
