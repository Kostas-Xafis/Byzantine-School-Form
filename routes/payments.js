const { questionMarks } = require("../utils");
module.exports = {
	get: {
		authenticate: true,
		method: "get",
		path: "/payments/get",
		func: db => {
			return async (req, res) => {
				try {
					// Select all payments and sort them by date
					const [payments] = await db.execute("SELECT * FROM payments ORDER BY date DESC");
					res.json(payments);
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
		path: "/payments/post",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					const { bookId, student_name } = req.body;
					const [[book]] = await db.execute("SELECT * FROM books WHERE id = ? LIMIT 1", [bookId]);
					if (book.length === 0) return res.status(400).json({ message: "Book not found" });
					if (book.quantity - book.sold === 0) return res.status(400).json({ message: "Book is out of stock" });

					const [result1, result2] = await Promise.allSettled([
						db.execute(`INSERT INTO payments (student_name, amount, date) VALUES (${questionMarks(3)})`, [
							student_name,
							book.price,
							Date.now()
						]),
						db.execute("UPDATE books SET sold = sold + 1 WHERE id = ? AND sold < quantity LIMIT 1", [bookId])
					]);
					if (result1.status === "rejected" || result2.status === "rejected") {
						res.status(400).json({ message: "Failed database insertion and/or update" });
						return await db.rollback();
					}
					// get inserted payment from database
					const [[payment]] = await db.execute("SELECT * FROM payments WHERE id = ? LIMIT 1", [result1.value[0].insertId]);
					await db.commit();
					res.status(200).json(payment);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
					await db.rollback();
				}
			};
		}
	},
	updatePayment: {
		authenticate: true,
		method: "put",
		path: "/payments/updatePayment",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					const { id, amount } = req.body;
					//check if payment exists
					const [[payment]] = await db.execute("SELECT * FROM payments WHERE id = ? LIMIT 1", [id]);
					if (payment.length === 0) {
						await db.commit();
						return res.status(400).json({ message: "Payment not found" });
					}
					await db.execute("UPDATE payments SET amount = ? WHERE id = ? LIMIT 1", [amount, id]);
					await db.commit();
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
					await db.rollback();
				}
			};
		}
	},
	complete: {
		authenticate: true,
		method: "delete",
		path: "/payments/complete",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					//check if payment exists
					const [payment] = await db.execute(`SELECT * FROM payments WHERE id IN (${questionMarks(req.body.length)}) `, req.body);
					if (payment.length === 0) {
						await db.commit();
						return res.status(400).json({ message: "Payment not found" });
					}
					await db.execute(`DELETE FROM payments WHERE id IN (${questionMarks(req.body.length)}) `, req.body);
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
