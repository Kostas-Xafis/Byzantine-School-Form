const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs/promises");
const fontKit = require("@pdf-lib/fontkit");

const createpdf = async data => {
	const fontBuffer = await fs.readFile("./fonts/arial.ttf");
	const pdfBuffer = await fs.readFile("./registrations/dummy.pdf");
	const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
	pdfDoc.registerFontkit(fontKit);
	const arialFont = await pdfDoc.embedFont(fontBuffer);
	const pages = pdfDoc.getPages();
	const ctx = pages[0];
	const textOptions = { font: arialFont, size: 14, rgb: rgb(0.01, 0.01, 0.01) };

	ctx.drawText(data.LastName, { ...textOptions, x: 100, y: 575 });
	ctx.drawText(data.FirstName, { ...textOptions, x: 100, y: 550 });
	ctx.drawText(data.FatherName, { ...textOptions, x: 132.5, y: 516 });
	ctx.drawText(data.AM, { ...textOptions, x: 135, y: 610 });
	ctx.drawText(data.Road, { ...textOptions, x: 75, y: 450 });
	ctx.drawText(data.Number + "", { ...textOptions, x: 105, y: 415 });
	ctx.drawText(data.TK + "", { ...textOptions, x: 200, y: 415 });
	ctx.drawText(data.Region, { ...textOptions, x: 140, y: 381 });
	ctx.drawText(data.Telephone, { ...textOptions, x: 135, y: 347 });
	ctx.drawText(data.Cellphone, { ...textOptions, x: 135, y: 313 });
	ctx.drawText(data.Email, { ...textOptions, x: 100, y: 280 });
	ctx.drawText(data.RegistrationYear, { ...textOptions, x: 135, y: 246 });
	ctx.drawText(data.ClassYear, { ...textOptions, x: 135, y: 213 });
	ctx.drawText(data.Teacher, { ...textOptions, x: 115, y: 180 });
	ctx.drawText("22", { ...textOptions, x: 420, y: 403 });
	ctx.drawText("23", { ...textOptions, x: 477.5, y: 403 });
	(data.Classes & 1) > 0 ? ctx.drawText("X", { ...textOptions, x: 467, y: 350 }) : null;
	(data.Classes & 2) > 0 ? ctx.drawText("X", { ...textOptions, x: 548.5, y: 325.5 }) : null;
	(data.Classes & 4) > 0 ? ctx.drawText("X", { ...textOptions, x: 468.5, y: 298.5 }) : null;
	ctx.drawText(data.LastName + " " + data.FirstName, { ...textOptions, x: 355, y: 130 });
	ctx.drawText("29", { ...textOptions, x: 165, y: 95 });
	ctx.drawText("08", { ...textOptions, x: 193, y: 95 });
	ctx.drawText("22", { ...textOptions, x: 234, y: 95 });
	const pdfBytes = await pdfDoc.save();
	return Buffer.from(pdfBytes.buffer);
};

module.exports = createpdf;
