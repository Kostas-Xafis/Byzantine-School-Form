const { questionMarks } = require("../utils");
module.exports = {
	get: {
		method: "get",
		path: "/books/get",
		func: db => {
			return async (req, res) => {
				try {
					const [books] = await db.execute("SELECT * FROM books LEFT JOIN wholesalers ON books.wholesalerId = wholesalers.id");
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
		method: "post",
		path: "/books/post",
		func: db => {
			return async (req, res) => {
				try {
					const args = Object.values(req.body);
					await db.execute(
						`INSERT INTO books (title, wholesalerId, genre, wholesalePrice, price, quantity, quantitySold) VALUES (${questionMarks(
							args.length
						)})`,
						args
					);
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	// update: {
	// 	method: "put",
	// 	path: "/books/update",
	// 	func: db => {
	// 		return async (req, res) => {
	// 			try {
	// 				//Move id to the end of the args array
	// 				const args = Object.values(req.body).slice(1);
	// 				args.push(req.body.id);
	// 				await db.execute(
	// 					`UPDATE books SET title = ?, author = ?, genre = ?, wholesalePrice = ?, price = ?, quantity = ?, quantitySold = ? WHERE id = ?`,
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
		method: "put",
		path: "/books/updateQuantity",
		func: db => {
			return async (req, res) => {
				try {
					const args = Object.values(req.body);
					await db.execute(`UPDATE books SET quantity = ? WHERE id = ?`, args);
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	deleteBook: {
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
