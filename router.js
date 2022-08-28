const Router = require("express").Router();
const xlsx = require("xlsx");

//* Reading the raw data from file
const a = [
	{ bob: 10, alice: 20 },
	{ bob: 20, alice: 30 }
];
const sheet = xlsx.utils.json_to_sheet(a);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, sheet, "sheet1");
xlsx.writeFile(wb, "newData.xlsx");

Router.post("/post_registration", (req, res) => {
	console.log(req.body);
	return res.status(200).send();
});

module.exports = Router;
