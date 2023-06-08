document.querySelector("form").addEventListener("submit", async e => {
	e.preventDefault();
	const form = document.forms.loginForm.elements;
	let data = {
		email: form.email.value,
		password: form.password.value
	};
	try {
		const res = await fetch("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});
		if (res.status >= 400) return alert("Αποτυχία σύνδεσης");
		const { isValid, session_id } = await res.json();
		if (!isValid) return alert("Αποτυχία σύνδεσης");
		sessionStorage.setItem("sid", session_id);
		window.history.back();
	} catch (error) {
		console.error(error);
		alert("Αποτυχία σύνδεσης");
	}
});
