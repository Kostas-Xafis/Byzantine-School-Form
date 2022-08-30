const AdmZip = require("adm-zip");
const createpdf = require("./pdf");
const { getStudents } = require("./storeFile");
const sendRegistrations = async db => {
	const zip = new AdmZip();
	const students = await getStudents(db);
	for (let i = 0; i < students.length; i++) {
		zip.addFile(`pdf${i + 1}.pdf`, await createpdf(students[i]));
	}
	const data = zip.toBuffer().toJSON();
	return { zip: data, students };
};

module.exports = sendRegistrations;
