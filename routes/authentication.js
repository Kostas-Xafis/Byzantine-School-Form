const hexLookup = "0123456789abcdef";
const createSessionId = () => {
	let session_id = "";
	for (let j = 0; j < 32; j++) {
		session_id += hexLookup[Math.floor(Math.random() * 16)];
	}
	return { session_id, session_exp_date: Date.now() + 1000 * 60 * 60 * 24 * 7 };
};

const linkLookup = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateLink = () => {
	let link = "";
	for (let j = 0; j < 16; j++) {
		link += linkLookup[Math.floor(Math.random() * 62)];
	}
	return link;
};

module.exports = {
	authenticateSession: {
		authenticate: true,
		method: "post",
		path: "/auth/session",
		func: db => {
			return async (req, res) => {
				return res.status(200).json({ isValid: true });
			};
		}
	},
	userLogin: {
		method: "post",
		path: "/auth/login",
		func: db => {
			return async (req, res) => {
				try {
					const [user] = await db.execute("SELECT * FROM sys_users WHERE email = ? AND password = ? LIMIT 1", [
						req.body.email,
						req.body.password
					]);
					const isValid = user.length > 0;
					if (isValid) {
						const { session_exp_date, session_id } = createSessionId();
						await db.execute("UPDATE sys_users SET session_id = ?, session_exp_date = ? WHERE email = ?", [
							session_id,
							session_exp_date,
							req.body.email
						]);
						res.json({ isValid, session_id });
					} else res.json({ isValid });
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	registerSysUser: {
		authenticate: true,
		method: "post",
		path: "/sys/register/:link",
		func: db => {
			return async (req, res) => {
				const link = req.params.link;
				try {
					//Check if link is in the database
					const [linkCheck] = await db.execute("SELECT * FROM sys_user_register_links WHERE link = ?", [link]);
					if (linkCheck.length === 0 || linkCheck[0].used === 1) {
						return res.status(404).send("Not Found");
					} else if (linkCheck[0].date < Date.now()) {
						await db.execute("DELETE FROM sys_user_register_links WHERE link = ?", [link]);
						return res.status(410).send("Gone");
					}
					const args = Object.values(req.body);
					const [result] = await db.execute(
						`INSERT INTO sys_users (email, password) VALUES (${questionMarks(args.length)})`,
						args
					);
					const [[user]] = await db.execute("SELECT session_id FROM sys_users WHERE id = ? LIMIT 1", [result.insertId]);
					res.status(200).json(user);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	createRegisterLink: {
		method: "post",
		path: "/sys/register",
		func: db => {
			return async (req, res) => {
				try {
					const link = generateLink();
					const exp_date = Date.now() + 1000 * 60 * 60 * 24;
					await db.execute("INSERT INTO sys_user_register_links (link, date) VALUES (?, ?)", [link, exp_date]);
					res.status(200).text(link);
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	}
};
