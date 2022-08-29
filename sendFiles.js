const AdmZip = require("adm-zip");
const { getFiles } = require("./storeFile");
const sendRegistrations = async db => {
	const zip = new AdmZip();
	const fileBuffers = await getFiles(db);
	for (let i = 0; i < fileBuffers.length - 1; i++) {
		zip.addFile(`pdf${i + 1}.pdf`, fileBuffers[i]);
	}

	const data = zip.toBuffer().toJSON();
	return { zip: data, excel: fileBuffers.pop() };
};

module.exports = sendRegistrations;
