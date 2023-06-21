const authMw = db => {
	return async (req, res, next) => {
		try {
			const { sid } = req.cookies;
			const [user] = await db.execute("SELECT session_exp_date FROM sys_users WHERE session_id = ? LIMIT 1", [sid]);
			const isValid = user.length > 0 && user[0].session_exp_date > Date.now();
			if (!isValid) return res.status(401).send("Unauthorized Access");
			next();
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal Server Error");
		}
	};
};

module.exports = { authMw };
