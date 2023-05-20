const dotenv = require("dotenv");
const { argv } = require("process");
const { writeFile } = require("fs/promises");
const { getDatabase } = require("../db.js");

const sqlQuery = student => {
	let query = "";
	if (1 & student.Classes) query += `INSERT INTO lessons VALUES(${student.id}, '${student.Teacher}', 1)\n`;
	if (2 & student.Classes) query += `INSERT INTO lessons VALUES(${student.id}, '${student.Teacher}', 2)\n`;
	if (4 & student.Classes) query += `INSERT INTO lessons VALUES(${student.id}, '${student.Teacher}', 4)\n`;

	return query;
	// return `INSERT INTO students (id, AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Classes, Date) VALUES ('${student.id}', '${student.AM}', '${student.LastName}', '${student.FirstName}', '${student.FatherName}', ${student.BirthYear}, '${student.Road}', ${student.Number}, ${student.TK}, '${student.Region}', '${student.Telephone}', '${student.Cellphone}', '${student.Email}', '${student.RegistrationYear}', "${student.ClassYear}", ${student.Classes}, '${student.Date}');`;
	// return `INSERT INTO students (AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Teacher, Classes, Date) VALUES ('${student.AM}', '${student.LastName}', '${student.FirstName}', '${student.FatherName}', ${student.BirthYear}, '${student.Road}', ${student.Number}, ${student.TK}, '${student.Region}', '${student.Telephone}', '${student.Cellphone}', '${student.Email}', '${student.RegistrationYear}', "${student.ClassYear}", '${student.Teacher}', ${student.Classes}, '${student.Date}');`;
};

(async function () {
	if (argv[2] !== "--dev" && argv[2] !== "--prod") return;
	if (argv[2] === "--prod") dotenv.config();
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
