const downloadExcel = [...document.getElementById("excelDownload").children];
const downloadZip = document.getElementById("getZip");
const sleep = async ms => new Promise(res => setTimeout(res, ms));
const formattedDate = (time, isInput) => {
	const date = time.getDate();
	const monthNum = time.getMonth(time) + 1;
	const day = date >= 10 ? "" + date : "0" + date;
	const month = monthNum >= 10 ? "" + monthNum : "0" + monthNum;
	if (isInput) return `${time.getFullYear()}-${month}-${day}`;
	return `${day}/${month}/${time.getFullYear()}`;
};
const addDay = 1000 * 60 * 60 * 24;

const classes = { 1: "Βυζαντινής Μουσικής", 2: "Παραδοσιακής Μουσικής", 4: "Ευρωπαϊκής Μουσικής" };

//Display current date on the "until" input
document.getElementById("dateEnd").value = formattedDate(new Date(), true);

const getStudents = async submitButton => {
	while (XLSX == null || PDFLib == null || JSZip == null || window.fontkit == null) await sleep(200);
	try {
		//Get date if choosen
		const dStart = document.getElementById("dateStart").value && new Date(document.getElementById("dateStart").value).getTime() + "";
		const dEnd = new Date(document.getElementById("dateEnd").value).getTime() + addDay + "";
		const date = !dStart ? null : { start: dStart, end: dEnd };

		const pwd = document.getElementById("pwd").value;
		const classType = Number(submitButton.getAttribute("data-classType")) || null;

		const res = await fetch("/get_registrations", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd, classType, date })
		});

		if (res.status >= 400) {
			submitButton.classList.add("errorSubmit");
			setTimeout(() => {
				submitButton.classList.remove("errorSubmit");
			}, 1000);
			return;
		}
		return await res.json();
	} catch (err) {
		console.log(err);
	}
};

downloadExcel.forEach(submitButton => {
	submitButton.addEventListener("click", async e => {
		e.preventDefault();
		try {
			const students = (await getStudents(submitButton))?.students;
			if (!students) return;
			createExcel(students, classes[Number(submitButton.getAttribute("data-classType"))]);
		} catch (err) {
			console.log(err);
		}
	});
});

downloadZip.addEventListener("click", async e => {
	e.preventDefault();
	try {
		const students = (await getStudents(downloadZip))?.students;
		if (!students) return;
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
		greekStudent["Διεύθυνση"] = student?.Road + " " + student?.Number + ", " + student?.Region + " " + student?.TK;
		greekStudent["Τηλέφωνο"] = student?.Cellphone + " " + (student?.Telephone && student?.Telephone !== "-" ? student?.Telephone : "");
		greekStudent["Email"] = student?.Email;
		greekStudent["Ημερομηνία"] = date;
		greekStudent["Έτος Εγγραφής"] = student?.RegistrationYear;
		greekStudent["Τάξη Φοίτησης"] = student?.ClassYear;
		greekStudent["Καθηγητής"] = student?.Teacher;
		greekStudents.push(greekStudent);
	});
	return greekStudents;
}

const createExcel = (students, classType) => {
	const greekStudentSheet = convertColumn(students);
	const wb = XLSX.utils.book_new();
	const sheet = XLSX.utils.json_to_sheet(greekStudentSheet);
	XLSX.utils.book_append_sheet(wb, sheet, classType);
	XLSX.writeFile(wb, `Εγγραφές ${classType}.xlsx`);
};

// ! PDF utils
const createpdf = async () => {
	const fontkit = window.fontkit;
	const fontBuffer = await getFileBuffer("./fonts/arial.ttf");
	const pdfBuffer = new Uint8Array(await getFileBuffer("./dummy.pdf"));
	const { PDFDocument, rgb } = PDFLib;
	return async (data, teacher, classType) => {
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
		data.AM !== "000" && data.AM.length <= 3 && data.AM.length >= 2 ? ctx.drawText(data.AM, { ...textOptions, x: 135, y: 580 }) : null;
		ctx.drawText(data.Road, { ...textOptions, x: 75, y: 430 });
		ctx.drawText(data.Number + "", { ...textOptions, x: 105, y: 403 });
		ctx.drawText(data.TK + "", { ...textOptions, x: 200, y: 403 });
		ctx.drawText(data.Region, { ...textOptions, x: 145, y: 379 });
		data.Telephone !== "-" ? ctx.drawText(data.Telephone, { ...textOptions, x: 135, y: 350 }) : null;
		ctx.drawText(data.Cellphone, { ...textOptions, x: 135, y: 325 });
		ctx.drawText(data.Email, { ...textOptions, x: 85, y: 300 });
		ctx.drawText(data.RegistrationYear, { ...textOptions, x: 135, y: 275 });
		ctx.drawText(data.ClassYear, { ...textOptions, x: 135, y: 248 });
		ctx.drawText(teacher, { ...textOptions, x: 115, y: 223 });
		ctx.drawText("22", { ...textOptions, x: 420, y: 405 });
		ctx.drawText("23", { ...textOptions, x: 478, y: 405 });
		if (classType == 1) ctx.drawText("X", { ...textOptions, x: 467, y: 350 });
		else if (classType == 2) ctx.drawText("X", { ...textOptions, x: 548.5, y: 325.5 });
		else if (classType == 4) ctx.drawText("X", { ...textOptions, x: 468.5, y: 298.5 });
		ctx.drawText(data.LastName + " " + data.FirstName, { ...textOptions, x: 355, y: 130 });
		ctx.drawText(day, { ...textOptions, x: 165, y: 105 });
		ctx.drawText(month, { ...textOptions, x: 193, y: 105 });
		ctx.drawText("22", { ...textOptions, x: 234, y: 105 });
		const pdfUint8Array = await pdfDoc.save();
		console.log("Hey I run!");
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

const getStudentClasses = student => {
	//prettier-ignore
	return (student?.Classes & 1) + ((student?.Classes >> 1) & 1) + ((student?.Classes >> 2) & 1);
};

const getClassesArray = student => {
	let arr = [];
	if (student?.Classes & 1) arr.push(1);
	if (student?.Classes & 2) arr.push(2);
	if (student?.Classes & 4) arr.push(4);
	return arr;
};

const createZip = async students => {
	const createPDF = await createpdf();
	const zip = new JSZip();
	const studentNames = {};
	const prog = document.getElementById("progressTxt");
	let totalPdfs = 0;
	students.forEach(student => (totalPdfs += getStudentClasses(student)));
	console.log("Total pdfs will be generated: " + totalPdfs);
	let currentFilesCounter = 0;
	for (let i = 0; i < students.length; i++) {
		let fullname = students[i].FirstName + " " + students[i].LastName;
		if (!(fullname in studentNames)) {
			studentNames[fullname] = true;
		} else fullname = fullname + i;
		//Need a more understandable way to write this
		const classesCount = getClassesArray(students[i]);
		for (const classNum of classesCount) {
			const classTypeName = classes[classNum];
			const teacher = students[i].Teachers[0];
			currentFilesCounter++;
			zip.folder(`${classTypeName}/${teacher}`).file(`${fullname}.pdf`, await createPDF(students[i], teacher, classNum));
			prog.innerText = "Προετοιμασία αρχείου zip :" + parseInt((currentFilesCounter * 50) / totalPdfs) + "%";
		}
	}
	let i = -1;
	let currentFileLoad = "";
	zip.generateInternalStream({ type: "base64" })
		.accumulate(metadata => {
			if (metadata.currentFile !== currentFileLoad && !metadata.currentFile?.endsWith("/") && metadata.currentFile !== null) {
				currentFileLoad = metadata.currentFile;
				i++;
			}
			prog.innerText = "Προετοιμασία αρχείου zip :" + parseInt(50 + ((i + 1) * 50) / totalPdfs) + "%";
		})
		.then(base64 => {
			donwloadButton(base64);
			prog.innerText = "Επιτυχής λήψη αρχείου!";
		});
};

const donwloadButton = base64 => {
	const a = document.createElement("a");
	a.href = "data:application/zip;base64," + base64;
	a.download = "file.zip";
	document.body.appendChild(a);
	a.click();
};
