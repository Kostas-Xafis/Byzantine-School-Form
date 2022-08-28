const AdmZip = require("adm-zip");

const sendRegistrations = () => {
	const zip = new AdmZip();
	zip.addLocalFolder("./registrations");
	const data = zip.toBuffer().toJSON();
	return data;
};

module.exports = sendRegistrations;
