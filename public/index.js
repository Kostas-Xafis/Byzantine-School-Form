const addRegister = document.getElementById("addRegisterForm");

document.getElementById("teacher").addEventListener("change", e => e.target.blur());
document.getElementById("class_year").addEventListener("change", e => e.target.blur());
document.querySelectorAll(".formSubmit").forEach(el => el.addEventListener("click", () => el.blur()));

addRegister.addEventListener("submit", async e => {
	e.preventDefault();
	const {
		last_name,
		name,
		father_name,
		birth_year,
		address,
		telephone,
		phonenumber,
		email,
		reg_year,
		class_year,
		teacher,
		addRegisterSubmit
	} = e.target.elements;
	const data = {
		last_name: last_name.value,
		name: name.value,
		father_name: father_name.value,
		birth_year: birth_year.value,
		address: address.value,
		telephone: telephone.value,
		phonenumber: phonenumber.value,
		email: email.value,
		reg_year: reg_year.value,
		class_year: class_year.value,
		teacher: teacher.value
	};

	try {
		const res = await fetch("/post_registration", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		if (res.status >= 400) {
			addRegisterSubmit.classList.add("errorSubmit");
			setTimeout(() => {
				addRegisterSubmit.classList.remove("errorSubmit");
			}, 3000);
		} else {
			addRegisterSubmit.classList.add("successSubmit");
			setTimeout(() => {
				addRegisterSubmit.classList.remove("successSubmit");
			}, 3000);
		}
	} catch (error) {
		console.error("Connection error:", error);
	}
});
