const storeStudent = async (db, student) => {
	const query = `INSERT INTO students (AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Teacher, Classes, Date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
	const args = [
		student.AM,
		student.LastName,
		student.FirstName,
		student.FatherName,
		student.BirthYear,
		student.Road,
		student.Number,
		student.TK,
		student.Region,
		student.Telephone,
		student.Cellphone,
		student.Email,
		student.RegistrationYear,
		student.ClassYear,
		student.Teacher,
		student.Classes,
		student.Date
	];
	const [{ insertId }] = await db.execute(query, args);

	const query2 = `INSERT INTO lessons (studentId, Teacher, Class) VALUES (?, ?, ?)`;
	if (1 & student.Classes) await db.execute(query2, [insertId, student.Teacher, 1]);
	if (2 & student.Classes) await db.execute(query2, [insertId, student.Teacher, 2]);
	if (4 & student.Classes) await db.execute(query2, [insertId, student.Teacher, 4]);
};

const getStudentsForExcel = async (db, date, classType) => {
	try {
		let { query, args } = studentQuery(date);
		query += `${date ? "AND" : "WHERE"} (classes & ? != 0)`;
		args = args.concat([classType]);
		let [students] = await db.execute(query, args);
		for (const student of students) {
			student.Teacher = (
				await db.execute("SELECT Teacher FROM lessons WHERE studentId = ? AND class = ?", [student.id, classType])
			)[0][0]?.Teacher;
		}
		return { students };
	} catch (err) {
		console.log(err);
	}
};

const getStudentsForZip = async (db, date) => {
	try {
		let { query, args } = studentQuery(date);
		const [students] = await db.execute(query, args);
		for (const student of students) {
			student.Teachers = (await db.execute("SELECT Teacher FROM lessons WHERE studentId = ?", [student.id]))[0]?.map(
				teacherObj => teacherObj.Teacher
			);
		}
		return { students };
	} catch (err) {
		console.log(err);
	}
};

module.exports = { storeStudent, getStudentsForZip, getStudentsForExcel };

const studentQuery = date => {
	let query = "SELECT * FROM students ";
	let args = [];
	if (date) {
		query += "WHERE (Date BETWEEN ? AND ?) ";
		args = [date.start, date.end];
	}
	return { query, args };
};
