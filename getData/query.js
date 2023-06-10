// Create a function that given a string of multiple queries, separate them, format them to a single line and filter out comments
const { argv } = require("process");
const dotenv = require("dotenv");
const { getDatabase } = require("../db.js");
const { readFile } = require("fs/promises");

const formatQuery = query => {
	query = query.replace(/\r\n/g, "");
	query = query.replace(/\n/g, "");
	return query;
};

const separateQueries = query => {
	return query.split(";");
};

const filterComments = queries => {
	return queries.filter(query => !query.startsWith("--"));
};

const executeQueries = async (queries, db) => {
	for (let i = 0; i < queries.length; i++) {
		const query = queries[i];
		if (query === "") break;
		await db.execute(query);
		console.log(`Executed query: ${query}`);
	}
};

const asyncEscape = msg => {
	console.log(msg);
	throw new Error();
};

(async function () {
	if (argv[2] !== "--prod" && argv[2] !== "--dev") asyncEscape("No environment specified");
	const env = argv[2];
	dotenv.config({ path: env === "--dev" ? "../.local.env" : "../.prod.env" });
	const db = await getDatabase();
	if (argv[3] === "--file") {
		let file = argv[4];
		if (!file) return console.log("No file specified");
		let fileString = await readFile(file, { encoding: "utf8" });
		let queries = separateQueries(fileString).map(query => formatQuery(query));
		queries = filterComments(queries);
		console.log({ queries });
		await executeQueries(queries, db);
		asyncEscape("Completed");
	}
	// If there is no specified file, then the query is the third argument
	const query = argv[3];
	if (!query) asyncEscape("No query specified");
	const [data] = await db.execute(query);
	console.log(JSON.stringify({ data }, null, 4));
	asyncEscape("Completed");
})();
