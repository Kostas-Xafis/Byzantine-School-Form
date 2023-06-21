module.exports = {
	get: {
		authenticate: true,
		method: "get",
		path: "/payoffs/get",
		func: db => {
			return async (req, res) => {
				try {
					const [payoffs] = await db.execute(
						"SELECT p.wholesaler_id as id, w.name as wholesaler, p.amount as amount FROM school_payoffs as p LEFT JOIN wholesalers as w ON p.wholesaler_id = w.id WHERE p.amount > 0"
					);
					res.status(200).json(payoffs);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	updateAmount: {
		authenticate: true,
		method: "put",
		path: "/payoffs/updateAmount",
		func: db => {
			return async (req, res) => {
				try {
					if (req.body.amount < 0) return res.status(400).json({ message: "Amount must be greater than 0" });
					await db.beginTransaction();
					const args = Object.values(req.body);
					await db.execute("UPDATE school_payoffs SET amount = ? WHERE id = ? AND amount > ? LIMIT 1", args.concat(args[0]));
					await db.commit();
					res.status(200).send();
				} catch (error) {
					await db.rollback();
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	complete: {
		authenticate: true,
		method: "delete",
		path: "/payoffs/complete",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					//check if payment exists
					const [payoffs] = await db.execute(
						`SELECT * FROM school_payoffs WHERE id IN (${questionMarks(req.body.length)}) `,
						req.body
					);
					if (payoffs.length === 0) {
						await db.commit();
						return res.status(400).json({ message: "Payoff not found" });
					}
					// await db.execute(`UP FROM school_payoffs WHERE id IN (${questionMarks(req.body.length)}) `, req.body);
					await db.execute(`UPDATE school_payoffs SET amount = 0 WHERE id IN (${questionMarks(req.body.length)})`, req.body);
					await db.commit();
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
					await db.rollback();
				}
			};
		}
	}
};
