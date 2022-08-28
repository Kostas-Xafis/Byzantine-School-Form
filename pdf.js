const hummus = require("hummus");
const pdfWriter = hummus.createWriterToModify(__dirname + "/pdfs/dummy.pdf", {
	modifiedFilePath: __dirname + "/pdfs/pdf1.pdf"
});
const arialFont = pdfWriter.getFontForFile("./fonts/arial.ttf");
const page1 = new hummus.PDFPageModifier(pdfWriter, 0);
const page2 = new hummus.PDFPageModifier(pdfWriter, 1);
let textOptions = { font: arialFont, size: 14, colorspace: "gray", color: 0x00 };

let ctx = page1.startContext().getContext();
ctx.writeText("Χαφής", 75, 550, textOptions);
ctx.writeText("Κωνσταντίνος", 75, 525, textOptions);
ctx.writeText("Θωμάς", 100, 475, textOptions);
ctx.writeText("ΑΜ609507", 100, 425, textOptions);
ctx.writeText("Πλάτωνος 14", 75, 372.5, textOptions);
ctx.writeText("Κηφισιάς", 75, 322.5, textOptions);
ctx.writeText("14563", 75, 270, textOptions);
ctx.writeText("2107221441", 75, 220, textOptions);
ctx.writeText("6978096018", 75, 165, textOptions);
ctx.writeText("koxafis@gmail.com", 75, 115, textOptions);
ctx.writeText("Γ' Τάξη", 350, 657.5, textOptions);
page1.endContext().writePage();

ctx = page2.startContext().getContext();
textOptions = { font: arialFont, size: 13, colorspace: "gray", color: 0x00 };
ctx.writeText("22", 79, 652, textOptions);
ctx.writeText("23", 120, 652, textOptions);
page2.endContext().writePage();

// ctx.writeText("22-23", 75, 65, textOptions);
pdfWriter.end();
const createpdf = data => {};

module.export = createpdf;
