const dotenv = require("dotenv");
dotenv.config({ path: "./.local.env", debug: true });
const express = require("express");
const hashedPwd = process.env.HASH;
const { getDatabase } = require("./db.js");
const { scryptSync } = require("crypto");
const { storeStudent, getStudentsForExcel, getStudentsForZip } = require("./studentQueries.js");
const { sendMail } = require("./sendMail.js");

module.exports = initRouter = async function () {
	const router = express.Router();
	const db = await getDatabase();

	router.post("/post_registration", async (req, res) => {
		try {
			await storeStudent(db, req.body);
			res.status(200).send();
			if (process.env.ENV === "production") sendMail(req.body);
		} catch (error) {
			console.log(error);
			res.status(400).send();
		}
	});

	router.post("/get_registrations", async (req, res) => {
		const { pwd, date, classType } = req.body;
		const [pwdHash, salt] = hashedPwd.split(":");
		const newHash = scryptSync(pwd, salt, 128).toString("hex");
		if (newHash !== pwdHash) return res.status(400).send();
		if (classType) res.json(await getStudentsForExcel(db, date, classType));
		else res.json(await getStudentsForZip(db, date));
	});
	return router;
};
