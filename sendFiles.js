const AdmZip = require("adm-zip");
const createpdf = require("./pdf");
const { getStudents } = require("./storeFile");
const { format } = require("date-fns");

const sendRegistrations = async db => {
	const zip = new AdmZip();
	const students = await getStudents(db);
	const teacherNames = {};
	const studentNames = {};
	for (let i = 0; i < students.length; i++) {
		let fullname = students[i].FirstName + students[i].LastName;
		if (!(fullname in studentNames)) {
			studentNames[fullname] = true;
		} else fullname = fullname + i;
		if (!(students[i].Teacher in teacherNames)) {
			teacherNames[students[i].Teacher] = true;
			zip.addFile(`${students[i].Teacher}/`);
		}
		zip.addFile(`${students[i].Teacher}/${fullname}.pdf`, await createpdf(students[i]));
		students[i].Date = format(Number(students[i].Date), "dd/MM/yyyy");
	}
	const data = zip.toBuffer().toJSON();
	return { zip: data, students };
};

module.exports = sendRegistrations;
