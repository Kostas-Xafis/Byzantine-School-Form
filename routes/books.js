const { questionMarks } = require("../utils");
module.exports = {
	get: {
		authenticate: true,
		method: "get",
		path: "/books/get",
		func: db => {
			return async (req, res) => {
				try {
					const [books] = await db.execute(
						"SELECT *, books.id as id FROM books LEFT JOIN wholesalers ON books.wholesaler_id = wholesalers.id ORDER BY books.id DESC"
					);
					//rename name to wholesaler in a simple for loop
					for (let i = 0; i < books.length; i++) {
						books[i].wholesaler = books[i].name;
						delete books[i].name;
					}
					res.json(books);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	getBook: {
		authenticate: true,
		method: "get",
		path: "/books/getBook/:id",
		func: db => {
			return async (req, res) => {
				try {
					const [book] = await db.execute("SELECT * FROM books WHERE id = ?", [req.params.id]);
					res.json(book);
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
		path: "/books/post",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					const args = Object.values(req.body);
					const [result] = await db.execute(
						`INSERT INTO books (title, wholesaler_id, genre, wholesale_price, price, quantity, sold) VALUES (${questionMarks(
							args.length
						)})`,
						args
					);
					// Update school_payoffs table amount
					await db.execute("UPDATE school_payoffs SET amount = amount + ? WHERE wholesaler_id = ?", [
						req.body.wholesale_price * req.body.quantity,
						req.body.wholesaler_id
					]);
					const [[book]] = await db.execute("SELECT * FROM books WHERE id = ? LIMIT 1", [result.insertId]);
					await db.commit();
					res.status(200).json(book);
				} catch (error) {
					await db.rollback();
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	// update: {
	//  authenticate: true,
	// 	method: "put",
	// 	path: "/books/update",
	// 	func: db => {
	// 		return async (req, res) => {
	// 			try {
	// 				//Move id to the end of the args array
	// 				const args = Object.values(req.body).slice(1);
	// 				args.push(req.body.id);
	// 				await db.execute(
	// 					`UPDATE books SET title = ?, author = ?, genre = ?, wholesale_price = ?, price = ?, quantity = ?, sold = ? WHERE id = ?`,
	// 					args
	// 				);
	// 				res.status(200).send();
	// 			} catch (error) {
	// 				console.error(error);
	// 				res.status(500).send("Internal Server Error");
	// 			}
	// 		};
	// 	}
	// },
	updateQuantity: {
		authenticate: true,
		method: "put",
		path: "/books/updateQuantity",
		func: db => {
			return async (req, res) => {
				try {
					await db.beginTransaction();
					const args = Object.values(req.body);
					const [[book]] = await db.execute("SELECT * FROM books WHERE id = ? LIMIT 1", [req.body.id]);
					if (book.quantity > req.body.quantity) return res.status(400).send("Cannot reduce quantity");

					await db.execute(`UPDATE books SET quantity = ? WHERE id = ?`, args);
					// Update school_payoffs table amount
					await db.execute("UPDATE school_payoffs SET amount = amount + ? WHERE wholesaler_id = ?", [
						book.wholesale_price * (req.body.quantity - book.quantity),
						book.wholesaler_id
					]);
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
	deleteBook: {
		authenticate: true,
		method: "delete",
		path: "/books/delete",
		func: db => {
			return async (req, res) => {
				try {
					if (req.body.length === 1) await db.execute(`DELETE FROM books WHERE id = ?`, req.body);
					else await db.execute(`DELETE FROM books WHERE id IN (${questionMarks(req.body.length)})`, req.body);
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	}
};
