const addRegister = document.getElementById("addRegisterForm");
const toscheckbox = document.getElementById("tosfakecheckbox");
const classCheckboxes = [...document.querySelectorAll(".classSubContainer > .checkbox")];
const classes = {
	1: false,
	2: false,
	3: false
};
let countClasses = 0;

document.getElementById("teacher").addEventListener("change", e => e.target.blur());
document.getElementById("class_year").addEventListener("change", e => e.target.blur());
document.querySelectorAll(".formSubmit").forEach(el => el.addEventListener("click", () => el.blur()));

addRegister.addEventListener("submit", async e => {
	e.preventDefault();
	const form = e.target.elements;
	const data = {
		AM: form.id.value,
		LastName: form.last_name.value.replaceAll(" ", ""),
		FirstName: form.name.value.replaceAll(" ", ""),
		FatherName: form.father_name.value.replaceAll(" ", ""),
		BirthYear: form.birth_year.value,
		Road: form.road.value,
		Number: form.number.value,
		TK: form.TK.value,
		Region: form.region.value,
		Telephone: form.telephone.value || "-",
		Cellphone: form.phonenumber.value,
		Email: form.email.value,
		RegistrationYear: "2022-2023",
		ClassYear: form.class_year.value,
		Teacher: form.teacher.value !== "null" ? form.teacher.value : form.otherTeacher.value,
		Classes: countClasses,
		Date: new Date().getTime() + ""
	};
	try {
		const res = await fetch("/registrations/post", {
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

// Classes checkbox
classCheckboxes.forEach((checkbox, i) => {
	checkbox.addEventListener("click", e => {
		classes[i] = !classes[i];
		if (classes[i]) {
			countClasses += 1 << i;
			checkbox.classList.add("agree");
		} else {
			countClasses -= 1 << i;
			checkbox.classList.remove("agree");
		}
		const inputCheckbox = document.getElementById("class");
		if (countClasses > 0) inputCheckbox.checked = true;
		else inputCheckbox.checked = false;
	});
});

// TOS agreement
let agree = false;
toscheckbox.addEventListener("click", e => {
	const inputCheckbox = document.getElementById("tosCheckbox");
	agree = !agree;
	if (agree) {
		inputCheckbox.checked = true;
		toscheckbox.classList.add("agree");
	} else {
		inputCheckbox.checked = false;
		toscheckbox.classList.remove("agree");
	}
});

//User select a teacher not specified in the list
let otherTeacherSelected = false;
document.getElementById("teacher").addEventListener("change", e => {
	const teacher = e.target.value;
	const input = document.getElementById("otherTeacher");
	const label = document.getElementById("otherTeacherLabel");
	if (teacher !== "null") {
		if (!otherTeacherSelected) return;
		otherTeacherSelected = false;
		input.classList.remove("otherTeacherSelected");
		label.classList.remove("otherTeacherSelected");
		input.required = true;
		return;
	}
	otherTeacherSelected = true;
	input.classList.add("otherTeacherSelected");
	label.classList.add("otherTeacherSelected");
	input.required = false;
});
