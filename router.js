const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const hashedPwd = require("process").env.HASH;
const getDatabase = require("./db.js");
const sendRegistrations = require("./sendFiles.js");
const { scryptSync } = require("crypto");
const { storeStudent } = require("./storeFile.js");

module.exports = router = async function () {
	const router = express.Router();
	const db = await getDatabase();

	router.post("/post_registration", async (req, res) => {
		try {
			await storeStudent(db, req.body);
			res.status(200).send();
		} catch (error) {
			console.log(error);
			res.status(400).send();
		}
	});

	router.post("/get_registrations", async (req, res) => {
		const [pwdHash, salt] = hashedPwd.split(":");
		const newHash = scryptSync(req.body.pwd, salt, 64).toString("hex");
		if (newHash !== pwdHash) return res.status(400).send();
		res.json(await sendRegistrations(db));
	});

	return router;
};
