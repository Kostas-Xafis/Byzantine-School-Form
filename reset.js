const handledb = require("./db");

let db;
(async function () {
	db = await handledb();
	await db.execute("DELETE FROM regs");
	await db.execute("DELETE FROM excel");
	return;
})();
