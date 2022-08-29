const { randomBytes } = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// const enc_key = Buffer.from(process.env.enc_key || "", "base64");

const storeFile = async (db, str, table) => {
	if (table == "excel") {
		const query = `DELETE FROM excel `;
		await db.execute(query);
	}
	const query = `INSERT INTO ${table} (file, iv) VALUES (?, ?)`;
	const iv = randomBytes(8);
	// const ciph = createCipheriv("aes-256-gcm", enc_key, iv);
	// const encData = ciph.update(str, "utf8", "hex") + ciph.final("hex");
	const args = [str, iv];
	await db.execute(query, args);
};

const getFiles = async db => {
	const query = "SELECT * FROM regs ;";
	const query2 = "SELECT * FROM excel ;";
	if (db == undefined || db == null) console.log("The Database object is dead");
	const [pdfs] = await db.execute(query);
	const [[excel]] = await db.execute(query2);
	const fileBlobs = [];
	pdfs?.forEach(async fileData => {
		// const decipher = createDecipheriv("aes-256-gcm", enc_key, fileData.iv);
		// fileBlobs.push(decipher.update(fileData.file, "hex", "utf8"));
		// if (a == 1) {
		// 	console.log("Result buffer:", Buffer.from(fileBlobs[0], "utf8"));
		// 	console.log("Result buffer:", Buffer.from(fileBlobs[0], "binary"));
		// 	// const pdfDoc = await PDFDocument.load();
		// 	await fs.writeFile("./out2.pdf", Buffer.from(fileBlobs[0], "utf8"));
		// 	a--;
		// }
		fileBlobs.push(fileData.file);
	});

	fileBlobs.push(excel.file.toString());
	return fileBlobs;
};

module.exports = { storeFile, getFiles };
