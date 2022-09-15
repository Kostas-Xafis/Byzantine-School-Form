const downloadExcel = document.getElementById("getExcel");
const downloadZip = document.getElementById("getZip");
const sleep = async ms => new Promise(res => setTimeout(res, ms));
const formattedDate = (time, isInput) => {
	if (!time) time = new Date();
	const date = time.getDate();
	const monthNum = time.getMonth(time) + 1;
	const day = date >= 10 ? "" + date : "0" + date;
	const month = monthNum >= 10 ? "" + monthNum : "0" + monthNum;
	if (isInput) return `${time.getFullYear()}-${month}-${day}`;
	return `${day}/${month}/${time.getFullYear()}`;
};

const addDay = 1000 * 60 * 60 * 24;

document.getElementById("dateEnd").value = formattedDate(null, true);

const getStudents = async () => {
	while (XLSX == null && PDFLib == null && JSZip == null && window.fontkit == null) await sleep(200);
	try {
		const pwd = document.getElementById("pwd").value;
		const dStart = document.getElementById("dateStart").value && new Date(document.getElementById("dateStart").value).getTime() + "";
		const dEnd = new Date(document.getElementById("dateEnd").value).getTime() + addDay + "";
		const res = await fetch("/get_registrations", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd, date: !dStart ? null : { start: dStart, end: dEnd } })
		});

		if (res.status >= 400) return console.log(await res.text());
		return await res.json();
	} catch (err) {
		console.log(err);
	}
};

downloadExcel.addEventListener("click", async e => {
	e.preventDefault();
	try {
		const { students } = await getStudents();
		createExcel(students);
	} catch (err) {
		console.log(err);
	}
});

downloadZip.addEventListener("click", async e => {
	e.preventDefault();
	try {
		const { students } = await getStudents();
		await createZip(students);
	} catch (err) {
		console.log(err);
	}
});

// ! Excel utils

function convertColumn(students) {
	const greekStudents = [];
	students.forEach(student => {
		const date = formattedDate(new Date(Number(student.Date)));
		const greekStudent = {};
		greekStudent["Επώνυμο"] = student?.LastName;
		greekStudent["Όνομα"] = student?.FirstName;
		greekStudent["ΑΜ"] = student?.AM;
		greekStudent["Πατρώνυμο"] = student?.FatherName;
		greekStudent["Έτος Γέννησης"] = student?.BirthYear;
		greekStudent["Οδός"] = student?.Road;
		greekStudent["Αριθμός"] = student?.Number;
		greekStudent["ΤΚ"] = student?.TK;
		greekStudent["Δήμος/Περιοχή"] = student?.Region;
		greekStudent["Σταθερό"] = student?.Telephone;
		greekStudent["Κινητό"] = student?.Cellphone;
		greekStudent["Email"] = student?.Email;
		greekStudent["Ημερομηνία"] = date;
		greekStudent["Έτος Εγγραφής"] = student?.RegistrationYear;
		greekStudent["Τάξη Φοίτησης"] = student?.ClassYear;
		greekStudent["Καθηγητής"] = student?.Teacher;
		greekStudent["Βυζαντινής Μουσικής"] = student?.Classes & 1 ? "Ναι" : "";
		greekStudent["Παραδοσιακής Μουσικής - Οργάνων"] = student?.Classes & 2 ? "Ναι" : "";
		greekStudent["Ευρωπαϊκής Μουσικής"] = student?.Classes & 4 ? "Ναι" : "";
		greekStudents.push(greekStudent);
	});
	return greekStudents;
}

const createExcel = students => {
	const greekStudentSheet = convertColumn(students);
	const wb = XLSX.utils.book_new();
	const sheet = XLSX.utils.json_to_sheet(greekStudentSheet);
	XLSX.utils.book_append_sheet(wb, sheet, "Εγγραφές");
	XLSX.writeFile(wb, "Εγγραφές.xlsx");
};

// ! PDF utils

const createpdf = async () => {
	const fontkit = window.fontkit;
	const fontBuffer = await getFileBuffer("./fonts/arial.ttf");
	const pdfBuffer = new Uint8Array(await getFileBuffer("./dummy.pdf"));
	const { PDFDocument, rgb } = PDFLib;
	return async data => {
		const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
		pdfDoc.registerFontkit(fontkit);
		const arialFont = await pdfDoc.embedFont(fontBuffer);
		const pages = pdfDoc.getPages();
		const ctx = pages[0];
		const textOptions = { font: arialFont, size: 14, rgb: rgb(0.01, 0.01, 0.01) };

		const time = new Date(Number(data.Date));
		const date = time.getDate();
		const monthNum = time.getMonth(time) + 1;
		const day = date >= 10 ? "" + date : "0" + date;
		const month = monthNum >= 10 ? "" + monthNum : "0" + monthNum;

		ctx.drawText(data.LastName, { ...textOptions, x: 100, y: 555 });
		ctx.drawText(data.FirstName, { ...textOptions, x: 100, y: 530 });
		ctx.drawText(data.FatherName, { ...textOptions, x: 130, y: 505 });
		ctx.drawText(data.BirthYear + "", { ...textOptions, x: 130, y: 480 });
		data.AM !== "000" && data.AM.length === 3 ? ctx.drawText(data.AM, { ...textOptions, x: 135, y: 580 }) : null;
		ctx.drawText(data.Road, { ...textOptions, x: 75, y: 430 });
		ctx.drawText(data.Number + "", { ...textOptions, x: 105, y: 403 });
		ctx.drawText(data.TK + "", { ...textOptions, x: 200, y: 403 });
		ctx.drawText(data.Region, { ...textOptions, x: 145, y: 379 });
		data.Telephone !== "-" ? ctx.drawText(data.Telephone, { ...textOptions, x: 135, y: 350 }) : null;
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
		const pdfUint8Array = await pdfDoc.save();
		return pdfUint8Array;
	};
};

const getFileBuffer = async url => {
	try {
		const res = await fetch(url, { method: "GET" });
		if (res >= 400) return;
		return await res.arrayBuffer();
	} catch (error) {
		console.log(error);
	}
};

const createZip = async students => {
	const createPDF = await createpdf();
	const zip = new JSZip();
	const studentNames = {};
	const prog = document.getElementById("progressTxt");
	for (let i = 0; i < students.length; i++) {
		let fullname = students[i].FirstName + " " + students[i].LastName;
		if (!(fullname in studentNames)) {
			studentNames[fullname] = true;
		} else fullname = fullname + i;
		zip.folder(`${students[i].Teacher}`).file(`${fullname}.pdf`, await createPDF(students[i]));
		prog.innerText = "Προετοιμασία αρχείου zip :" + parseInt(((i + 1) * 100) / students.length) + "%";
	}
	prog.innerText = "Δημιουργία αρχείου zip...";
	zip.generateAsync({ type: "base64" }).then(function (base64) {
		const a = document.createElement("a");
		a.href = "data:application/zip;base64," + base64;
		a.download = "file.zip";
		document.body.appendChild(a);
		a.click();
		prog.innerText = "Επιτυχής λήψη αρχείου zip...";
	});
};
