const dotenv = require("dotenv");
dotenv.config();
const { writeFile } = require("fs/promises");
const { getDatabase } = require("../db.js");
const sqlQuery = student => {
	return `INSERT INTO students (AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Teacher, Classes, Date) VALUES ('${student.AM}', '${student.LastName}', '${student.FirstName}', '${student.FatherName}', ${student.BirthYear}, '${student.Road}', ${student.Number}, ${student.TK}, '${student.Region}', '${student.Telephone}', '${student.Cellphone}', '${student.Email}', '${student.RegistrationYear}', "${student.ClassYear}", '${student.Teacher}', ${student.Classes}, '${student.Date}');`;
};

(async function () {
	const db = await getDatabase();
	const [students] = await db.execute("SELECT * FROM students;");
	let fullTxt = "";
	students.forEach(student => {
		fullTxt += sqlQuery(student) + "\n";
	});
	await writeFile("./sqlQuery.txt", fullTxt);
	return;
})();
