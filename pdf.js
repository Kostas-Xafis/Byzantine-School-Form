const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs/promises");
const fontKit = require("@pdf-lib/fontkit");
const { getMonth, getDate } = require("date-fns");

const createpdf = async data => {
	const fontBuffer = await fs.readFile("./fonts/arial.ttf");
	const pdfBuffer = await fs.readFile("./registrations/dummy.pdf");
	const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
	pdfDoc.registerFontkit(fontKit);
	const arialFont = await pdfDoc.embedFont(fontBuffer);
	const pages = pdfDoc.getPages();
	const ctx = pages[0];
	const textOptions = { font: arialFont, size: 14, rgb: rgb(0.01, 0.01, 0.01) };

	const time = new Date(Number(data.Date));
	const date = getDate(time);
	const monthNum = (getMonth(time) + 1) % 13;
	const day = date >= 10 ? "" + date : "0" + date;
	const month = monthNum >= 10 ? "" + monthNum : "0" + monthNum;

	ctx.drawText(data.LastName, { ...textOptions, x: 100, y: 555 });
	ctx.drawText(data.FirstName, { ...textOptions, x: 100, y: 530 });
	ctx.drawText(data.FatherName, { ...textOptions, x: 130, y: 505 });
	ctx.drawText(data.BirthYear + "", { ...textOptions, x: 130, y: 480 });
	ctx.drawText(data.AM, { ...textOptions, x: 135, y: 580 });
	ctx.drawText(data.Road, { ...textOptions, x: 75, y: 430 });
	ctx.drawText(data.Number + "", { ...textOptions, x: 105, y: 403 });
	ctx.drawText(data.TK + "", { ...textOptions, x: 200, y: 403 });
	ctx.drawText(data.Region, { ...textOptions, x: 145, y: 379 });
	ctx.drawText(data.Telephone, { ...textOptions, x: 135, y: 350 });
	ctx.drawText(data.Cellphone, { ...textOptions, x: 135, y: 325 });
	ctx.drawText(data.Email, { ...textOptions, x: 85, y: 300 });
	ctx.drawText(data.RegistrationYear, { ...textOptions, x: 135, y: 275 });
	ctx.drawText(data.ClassYear, { ...textOptions, x: 135, y: 248 });
	ctx.drawText(data.Teacher, { ...textOptions, x: 115, y: 223 });
	ctx.drawText("22", { ...textOptions, x: 420, y: 405 });
	ctx.drawText("23", { ...textOptions, x: 478, y: 405 });
	(data.Classes & 1) > 0 ? ctx.drawText("X", { ...textOptions, x: 467, y: 350 }) : null;
	(data.Classes & 2) > 0 ? ctx.drawText("X", { ...textOptions, x: 548.5, y: 325.5 }) : null;
	(data.Classes & 4) > 0 ? ctx.drawText("X", { ...textOptions, x: 468.5, y: 298.5 }) : null;
	ctx.drawText(data.LastName + " " + data.FirstName, { ...textOptions, x: 355, y: 130 });
	ctx.drawText(day, { ...textOptions, x: 165, y: 105 });
	ctx.drawText(month, { ...textOptions, x: 193, y: 105 });
	ctx.drawText("22", { ...textOptions, x: 234, y: 105 });
	const pdfBytes = await pdfDoc.save();
	return Buffer.from(pdfBytes.buffer);
};

module.exports = createpdf;
