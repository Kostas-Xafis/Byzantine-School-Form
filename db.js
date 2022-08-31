const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
module.exports = getDatabase = async () => {
	try {
		// const db = await mysql.createConnection({
		// 	socketPath: process.env.DB_SOCKET,
		// 	user: "root",
		// 	password: process.env.DB_PWD,
		// 	database: "registrations",
		// 	multipleStatements: false
		// });
		// console.log("Connected to database");
		// return db;
		const db = await mysql.createConnection({
			user: "root",
			password: process.env.DB_PWD,
			database: "webproject",
			host: "localhost",
			port: 6000,
			multipleStatements: false
		});
		console.log("Connected to database");
		return db;
	} catch (err) {
		console.error("Could not establish connection with the database");
		console.error(err);
	}
};
