const addRegister = document.getElementById("addRegisterForm");
const checkbox = document.getElementById("checkbox");

document.getElementById("teacher").addEventListener("change", e => e.target.blur());
document.getElementById("class_year").addEventListener("change", e => e.target.blur());
document.querySelectorAll(".formSubmit").forEach(el => el.addEventListener("click", () => el.blur()));

addRegister.addEventListener("submit", async e => {
	e.preventDefault();
	const {
		id,
		last_name,
		name,
		father_name,
		birth_year,
		address,
		telephone,
		phonenumber,
		email,
		class_year,
		teacher,
		otherTeacher,
		addRegisterSubmit
	} = e.target.elements;
	console.log(teacher.value, otherTeacher.value);
	const data = {
		ΑΜ: id.value,
		Επώνυμο: last_name.value,
		Όνομα: name.value,
		Πατρώνυμο: father_name.value,
		Έτος_Γέννησης: birth_year.value,
		Διεύθυνση: address.value,
		Σταθερό: telephone.value,
		Κινητό: phonenumber.value,
		Email: email.value,
		Έτος_Εγγραφής: "2022-2023",
		Τάξη: class_year.value,
		Καθηγητής: teacher.value !== "null" ? teacher.value : otherTeacher.value
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

// TOS agreement
let agree = false;
checkbox.addEventListener("click", e => {
	const inputCheckbox = document.getElementById("tosCheckbox");
	agree = !agree;
	if (agree) {
		inputCheckbox.checked = true;
		checkbox.classList.add("agree");
	} else {
		inputCheckbox.checked = false;
		checkbox.classList.remove("agree");
	}
});

//User select a teacher not specified in the list
let otherTeacherSelected = false;
document.getElementById("teacher").addEventListener("change", e => {
	const teacher = e.target.value;
	const input = document.getElementById("otherTeacherInput");
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
