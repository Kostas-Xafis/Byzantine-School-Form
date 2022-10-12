const dotenv = require("dotenv");
const { argv } = require("process");
const { writeFile } = require("fs/promises");
const { getDatabase } = require("../db.js");
// const classes = { 1: "Βυζαντινής Μουσικής", 2: "Παραδοσιακής Μουσικής - Οργάνων", 4: "Ευρωπαϊκής Μουσικής" };

const sqlQuery = student => {
	return `INSERT INTO lessons VALUES(${student.id}, '${student.Teacher}', ${1 & student.Classes || 2 & student.Classes || 4})`;
	// return `INSERT INTO students (id, AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Classes, Date) VALUES ('${student.id}', '${student.AM}', '${student.LastName}', '${student.FirstName}', '${student.FatherName}', ${student.BirthYear}, '${student.Road}', ${student.Number}, ${student.TK}, '${student.Region}', '${student.Telephone}', '${student.Cellphone}', '${student.Email}', '${student.RegistrationYear}', "${student.ClassYear}", ${student.Classes}, '${student.Date}');`;
	// return `INSERT INTO students (AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Teacher, Classes, Date) VALUES ('${student.AM}', '${student.LastName}', '${student.FirstName}', '${student.FatherName}', ${student.BirthYear}, '${student.Road}', ${student.Number}, ${student.TK}, '${student.Region}', '${student.Telephone}', '${student.Cellphone}', '${student.Email}', '${student.RegistrationYear}', "${student.ClassYear}", '${student.Teacher}', ${student.Classes}, '${student.Date}');`;
};

(async function () {
	if (argv[2] !== "--dev") dotenv.config();
	const db = await getDatabase();
	const [students] = await db.execute("SELECT * FROM students;");
	let fullTxt = "";
	students.forEach(student => {
		fullTxt += sqlQuery(student) + "\n";
	});
	await writeFile("./sqlQuery.txt", fullTxt);
	console.log("Done");
	return;
})();
