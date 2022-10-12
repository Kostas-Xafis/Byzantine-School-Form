const classes = { 1: "Βυζαντινής Μουσικής", 2: "Παραδοσιακής Μουσικής - Οργάνων", 4: "Ευρωπαϊκής Μουσικής" };
const storeStudent = async (db, student) => {
	const query = `INSERT INTO students (AM, LastName, FirstName, FatherName, BirthYear, Road, Number, TK, Region, Telephone, Cellphone, Email, RegistrationYear, ClassYear, Classes, Date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
		student.Classes,
		student.Date
	];
	const [{ insertId }] = await db.execute(query, args);

	student.Teachers.forEach(async (teacher, i) => {
		const query2 = `INSERT INTO lessons (studentId, Teacher, Class) VALUES (?, ?, ?)`;
		while (!((1 << i) & student.Classes)) i++;
		student.Classes -= 1 << i; //to avoid 1->2 (6), 2->2 (6) and make it 1->2 (6), 2->4 (4)
		await db.execute(query2, [insertId, teacher, 1 << i]);
	});
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
		console.log(students.length);
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
