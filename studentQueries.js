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
	await db.execute(query, args);
};

const getStudents = async (db, date) => {
	try {
		const query = !date ? "SELECT * FROM students ;" : "SELECT * FROM students WHERE Date BETWEEN ? AND ? ;";
		const [students] = await db.execute(query, !date ? [] : [date.start, date.end]);
		return { students };
	} catch (err) {
		console.log(err);
	}
};

module.exports = { storeStudent, getStudents };
