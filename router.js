const router = require("express").Router();
const xlsx = require("xlsx");
const createpdf = require("./pdf.js");

const postQueue = [];
const sleep = async ms => new Promise(res => setTimeout(res, ms));

let counter = 0;
router.post("/post_registration", (req, res) => {
	postQueue.push({ id: ++counter, data: Object.assign({}, req.body), cb: code => res.status(code).send() }); // make copy of the post body
});

(async function () {
	let wb, sheet;
	try {
		wb = xlsx.readFile("newData.xlsx");
		sheet = wb.Sheets["Εγγραφές"];
	} catch (error) {
		wb = xlsx.utils.book_new();
		sheet = xlsx.utils.json_to_sheet([{}]);
	}
	while (true) {
		if (postQueue.length === 0) {
			await sleep(500);
			continue;
		}
		const { id, data, cb } = postQueue.shift();
		try {
			xlsx.utils.sheet_add_json(sheet, [...xlsx.utils.sheet_to_json(sheet), data]);
			const newWb = xlsx.utils.book_new();
			xlsx.utils.book_append_sheet(newWb, sheet, "Εγγραφές");
			xlsx.writeFile(newWb, "newData.xlsx");
			createpdf(data, id);
			cb(200); //Send ok response
		} catch (err) {
			console.log(err);
			cb(400); //Send error response
		}
	}
})();

module.exports = router;
