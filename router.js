const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const hashedPwd = require("process").env.HASH;
const getDatabase = require("./db.js");
const { scryptSync } = require("crypto");
const { storeStudent, getStudents } = require("./studentQueries.js");

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
		const { pwd, date } = req.body;
		const [pwdHash, salt] = hashedPwd.split(":");
		const newHash = scryptSync(pwd, salt, 64).toString("hex");
		if (newHash !== pwdHash) return res.status(400).send();
		res.json(await getStudents(db, date));
	});

	return router;
};
