const pwdForm = document.getElementById("getRegistrationsForm");
const sleep = async ms => new Promise(res => setTimeout(res, ms));

pwdForm.addEventListener("submit", async e => {
	e.preventDefault();
	const pwd = document.getElementById("pwd").value;
	while (XLSX == null) sleep(200);
	try {
		const res = await fetch("/get_registrations", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd })
		});
		if (res.status >= 400) return;

		const { zip, excel } = await res.json();
		const data = new Uint8Array(zip.data);
		const blob = new Blob([data], { type: "application/zip" });
		const downloadUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = "file.zip";
		document.body.appendChild(a);
		a.click();

		const wb = XLSX.utils.book_new();
		const sheet = XLSX.utils.json_to_sheet(JSON.parse(excel).sheet);
		XLSX.utils.book_append_sheet(wb, sheet.sheet, "Εγγραφές");
		XLSX.writeFile(wb, "Εγγραφές.xlsx");
	} catch (err) {
		console.log(err);
	}
});
