const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const xlsx = require("xlsx");
const createpdf = require("./pdf.js");
const hashedPwd = require("process").env.HASH;
const getDatabase = require("./db.js");
const sendRegistrations = require("./sendFiles.js");
const { scryptSync } = require("crypto");
const { storeFile } = require("./storeFile.js");
const { sleep } = require("./globals.js");

module.exports = router = async function () {
	const router = express.Router();
	const db = await getDatabase();
	const postQueue = [];

	router.post("/post_registration", (req, res) => {
		postQueue.push({ data: Object.assign({}, req.body), cb: code => res.status(code).send() }); // make copy of the post body
	});

	router.post("/get_registrations", async (req, res) => {
		const [pwdHash, salt] = hashedPwd.split(":");
		const newHash = scryptSync(req.body.pwd, salt, 64).toString("hex");
		if (newHash !== pwdHash) return res.status(400).send();
		res.json(await sendRegistrations(db));
	});

	(async function () {
		let sheet = xlsx.utils.json_to_sheet([{}]);
		while (true) {
			if (postQueue.length === 0) {
				await sleep(500);
				continue;
			}
			const { data, cb } = postQueue.shift();
			try {
				xlsx.utils.sheet_add_json(sheet, [...xlsx.utils.sheet_to_json(sheet), data]);
				const sheetTxt = JSON.stringify({ sheet: xlsx.utils.sheet_to_json(sheet) });
				const pdfBuffer = await createpdf(data);
				storeFile(db, pdfBuffer, "regs");
				storeFile(db, sheetTxt, "excel");
				cb(200); //Send ok response
			} catch (err) {
				console.log(err);
				cb(400); //Send error response
			}
		}
	})();
	return router;
};
