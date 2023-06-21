module.exports = {
	get: {
		authenticate: true,
		method: "get",
		path: "/wholesalers/get",
		func: db => {
			return async (req, res) => {
				try {
					const [wholesalers] = await db.execute("SELECT * FROM wholesalers");
					res.json(wholesalers);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	post: {
		authenticate: true,
		method: "post",
		path: "/wholesalers/post",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					const args = Object.values(req.body);
					// await db.execute(`INSERT INTO wholesalers (name) VALUES (?)`, args);
					const [result] = await db.execute(`INSERT INTO wholesalers (name) VALUES (?)`, args);
					await db.execute("INSERT INTO school_payoffs (wholesaler_id, amount) VALUES (?, 0)", [result.insertId]);
					const [[wholesaler]] = await db.execute("SELECT * FROM wholesalers WHERE id = ? LIMIT 1", [result.insertId]);
					await db.commit();
					res.status(200).json(wholesaler);
				} catch (error) {
					await db.rollback();
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	}
	// delete: {
	// authenticate: true,
	// 	method: "delete",
	// 	path: "/wholesalers/delete",
	// 	func: db => {
	// 		return async (req, res) => {
	// 			try {
	// 				const args = req.body;
	// 				await db.execute(`DELETE FROM wholesalers WHERE id IN (${questionMarks(args.length)})`, args);
	// 				res.status(200).send();
	// 			} catch (error) {
	// 				console.error(error);
	// 				res.status(500).send("Internal Server Error");
	// 			}
	// 		};
	// 	}
	// }
};
