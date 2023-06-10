const mysql = require("mysql2/promise");
module.exports = {
	getDatabase: async () => {
		try {
			const db = await mysql.createConnection({
				user: "root",
				password: process.env.DB_PWD,
				database: process.env.DB_NAME,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				multipleStatements: false
			});
			console.log(`Connected to ${process.env.ENV} database`);
			return db;
		} catch (err) {
			console.error("Could not establish connection with the database");
			console.error(err);
		}
	}
};
