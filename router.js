const Router = require("express").Router();

Router.post("/post_registration", (req, res) => {
	console.log(req.body);
	return res.status(200).send();
});

module.exports = Router;
