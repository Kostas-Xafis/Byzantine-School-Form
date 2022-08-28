const hummus = require("hummus");

const createpdf = (data, id) => {
	const pdfWriter = hummus.createWriterToModify(__dirname + "/pdfs/dummy.pdf", {
		modifiedFilePath: __dirname + `/pdfs/pdf${id}.pdf`
	});
	const arialFont = pdfWriter.getFontForFile("./fonts/arial.ttf");
	const page1 = new hummus.PDFPageModifier(pdfWriter, 0);
	const page2 = new hummus.PDFPageModifier(pdfWriter, 1);
	let textOptions = { font: arialFont, size: 14, colorspace: "gray", color: 0x00 };

	// Pasting data on the 1st pdf page
	let ctx = page1.startContext().getContext();
	ctx.writeText(data["Επώνυμο"], 75, 550, textOptions);
	ctx.writeText(data["Όνομα"], 75, 525, textOptions);
	ctx.writeText(data["Πατρώνυμο"], 100, 475, textOptions);
	ctx.writeText(data["ΑΜ"], 100, 425, textOptions);
	ctx.writeText("Πλάτωνος 14", 75, 372.5, textOptions);
	ctx.writeText("Κηφισιάς", 75, 322.5, textOptions);
	ctx.writeText("14563", 75, 270, textOptions);
	data["Σταθερό"] ? ctx.writeText(data["Σταθερό"], 75, 220, textOptions) : null;
	ctx.writeText(data["Κινητό"], 75, 165, textOptions);
	data["Email"] ? ctx.writeText(data["Email"], 75, 115, textOptions) : null;
	data["Έτος_Εγγραφής"] ? ctx.writeText(data["Έτος_Εγγραφής"], 75, 65, textOptions) : null;
	ctx.writeText(data["Τάξη"], 350, 657.5, textOptions);
	page1.endContext().writePage();

	// Pasting data on the 2nd pdf page
	ctx = page2.startContext().getContext();
	textOptions = { font: arialFont, size: 13, colorspace: "gray", color: 0x00 };
	ctx.writeText("22", 79, 652, textOptions);
	ctx.writeText("23", 120, 652, textOptions);
	page2.endContext().writePage();

	pdfWriter.end();
};

module.exports = createpdf;
