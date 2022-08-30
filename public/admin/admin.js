const pwdForm = document.getElementById("getRegistrationsForm");
const sleep = async ms => new Promise(res => setTimeout(res, ms));

pwdForm.addEventListener("submit", async e => {
	e.preventDefault();
	const pwd = document.getElementById("pwd").value;
	while (XLSX == null) await sleep(200);
	try {
		const res = await fetch("/get_registrations", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd })
		});
		if (res.status >= 400) return;

		const { zip, students } = await res.json();
		const data = new Uint8Array(zip.data);
		const blob = new Blob([data], { type: "application/zip" });
		const downloadUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = "file.zip";
		document.body.appendChild(a);
		a.click();

		//convert student database names to greek ones
		const greekStudentSheet = convertColumn(students);
		const wb = XLSX.utils.book_new();
		const sheet = XLSX.utils.json_to_sheet(greekStudentSheet);
		XLSX.utils.book_append_sheet(wb, sheet, "Εγγραφές");
		XLSX.writeFile(wb, "Εγγραφές.xlsx");
	} catch (err) {
		console.log(err);
	}
});

function convertColumn(students) {
	const greekStudents = [];
	students.forEach(student => {
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
		greekStudent["Ημερομηνία"] = student?.Date;
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
