const pwdForm = document.getElementById("getRegistrationsForm");

pwdForm.addEventListener("submit", async e => {
	e.preventDefault();
	const pwd = document.getElementById("pwd").value;
	try {
		const res = await fetch("/get_registrations", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pwd })
		});
		if (res.status >= 400) return;
		const data = new Uint8Array((await res.json()).data);
		const blob = new Blob([data], { type: "application/zip" });
		const downloadUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = "file.zip";
		document.body.appendChild(a);
		a.click();
	} catch (err) {
		console.log(err);
	}
});

function blobToBase64(blob) {
	return new Promise(res => {
		const reader = new FileReader();
		reader.onloadend = () => res(reader.result);
		reader.readAsDataURL(blob);
	});
}
