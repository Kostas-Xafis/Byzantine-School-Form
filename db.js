const mysql = require("mysql2/promise");
module.exports = {
	getDatabase: async () => {
		try {
			if (process.env.ENV === "production") {
				const db = await mysql.createConnection({
					user: "root",
					password: process.env.DB_PWD,
					database: process.env.DB_NAME,
					host: process.env.DB_HOST,
					port: process.env.DB_PORT,
					multipleStatements: false
				});
				console.log("Connected to production database");
				return db;
			} else {
				const db = await mysql.createConnection({
					user: "root",
					password: "Whereiswaldo!09",
					database: "webproject",
					host: "localhost",
					port: 6000,
					multipleStatements: false
				});
				console.log("Connected to development database");
				return db;
			}
		} catch (err) {
			console.error("Could not establish connection with the database");
			console.error(err);
		}
	}
};
