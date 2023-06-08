const hexLookup = "0123456789abcdef";
const createSessionId = () => {
	let session_id = "";
	for (let j = 0; j < 32; j++) {
		session_id += hexLookup[Math.floor(Math.random() * 16)];
	}
	return { session_id, session_exp_date: Date.now() + 1000 * 60 * 60 * 24 * 7 };
};
module.exports = {
	authenticateSession: {
		method: "post",
		path: "/auth/session",
		func: db => {
			return async (req, res) => {
				try {
					const [user] = await db.execute("SELECT session_exp_date FROM sysUsers WHERE session_id = ? LIMIT 1", [req.body.sid]);
					const isValid = user.length > 0 && user[0].session_exp_date > Date.now();
					res.json({ isValid });
				} catch (error) {
					console.error(error);
					res.status(500).send("Internal Server Error");
				}
			};
		}
	},
	userLogin: {
		method: "post",
		path: "/auth/login",
		func: db => {
			return async (req, res) => {
				try {
					const [user] = await db.execute("SELECT * FROM sysUsers WHERE email = ? AND password = ? LIMIT 1", [
						req.body.email,
						req.body.password
					]);
					const isValid = user.length > 0;
					if (isValid) {
						const { session_exp_date, session_id } = createSessionId();
						await db.execute("UPDATE sysUsers SET session_id = ?, session_exp_date = ? WHERE email = ?", [
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
	}
};
