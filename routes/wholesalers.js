module.exports = {
	get: {
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
		method: "post",
		path: "/wholesalers/post",
		func: db => {
			return async (req, res) => {
				try {
					const args = Object.values(req.body);
					await db.execute(`INSERT INTO wholesalers (name, address, phone) VALUES (${questionMarks(args.length)})`, args);
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	delete: {
		method: "delete",
		path: "/wholesalers/delete",
		func: db => {
			return async (req, res) => {
				try {
					const args = req.body;
					await db.execute(`DELETE FROM wholesalers WHERE id IN (${questionMarks(args.length)})`, args);
					res.status(200).send();
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	}
};
