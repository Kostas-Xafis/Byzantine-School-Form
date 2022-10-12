const addRegister = document.getElementById("addRegisterForm");
const tosCheckbox = document.getElementById("tosfakecheckbox");
const classCheckboxes = [...document.querySelectorAll(".classSubContainer > .checkbox")];
const classes = {
	1: false,
	2: false,
	4: false
};
const teachers = {
	1: document.getElementById("teacherByzantini"),
	2: document.getElementById("teacherParadosiaki"),
	4: document.getElementById("teacherEuropaiki")
};
let countClasses = 0;

document.getElementById("class_year").addEventListener("change", e => e.target.blur());
document.querySelectorAll(".formSubmit").forEach(el => el.addEventListener("click", () => el.blur()));

addRegister.addEventListener("submit", async e => {
	e.preventDefault();
	const getTeachers = (...teachers) =>
		teachers
			.map(teacherEl => (teacherEl.value !== "null" ? teacherEl.value : teacherEl.nextElementSibling.value))
			.filter(teacher => teacher !== "");
	const {
		id,
		last_name,
		name,
		father_name,
		birth_year,
		road,
		number,
		TK,
		region,
		telephone,
		phonenumber,
		email,
		class_year,
		teacher1,
		teacher2,
		teacher3,
		addRegisterSubmit
	} = e.target.elements;
	const data = {
		AM: id.value,
		LastName: last_name.value.replaceAll(" ", ""),
		FirstName: name.value.replaceAll(" ", ""),
		FatherName: father_name.value.replaceAll(" ", ""),
		BirthYear: birth_year.value,
		Road: road.value,
		Number: number.value,
		TK: TK.value,
		Region: region.value,
		Telephone: telephone.value || "-",
		Cellphone: phonenumber.value,
		Email: email.value,
		RegistrationYear: "2022-2023",
		ClassYear: class_year.value,
		Teachers: getTeachers(teacher1, teacher2, teacher3),
		Classes: countClasses,
		Date: new Date().getTime() + ""
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

// Classes checkbox
classCheckboxes.forEach((checkbox, i) => {
	checkbox.addEventListener("click", e => {
		classes[i] = !classes[i];
		const classType = Number(checkbox.getAttribute("data-classType"));
		if (classes[i]) {
			countClasses += classType;
			checkbox.classList.add("agree");
			teachers[classType].parentElement.classList.add("showTeachers");
			teachers[classType].required = true;
		} else {
			countClasses -= classType;
			checkbox.classList.remove("agree");
			teachers[classType].parentElement.classList.remove("showTeachers");
			teachers[classType].required = false;
		}
		const inputCheckbox = document.getElementById("class");
		if (countClasses > 0) inputCheckbox.checked = true;
		else inputCheckbox.checked = false;
	});
});

// TOS agreement
let agree = false;
tosCheckbox.addEventListener("click", e => {
	const inputCheckbox = document.getElementById("tosCheckbox");
	agree = !agree;
	if (agree) {
		inputCheckbox.checked = true;
		tosCheckbox.classList.add("agree");
	} else {
		inputCheckbox.checked = false;
		tosCheckbox.classList.remove("agree");
	}
});

//User select a teacher not specified in the list
let otherTeacherSelected = {
	1: false,
	2: false,
	4: false
};
[...document.querySelectorAll(".teachersSelect")].forEach(teacherEl => {
	teacherEl.addEventListener("change", e => {
		teacherEl.blur();
		const classType = Number(teacherEl.getAttribute("data-classType"));
		const teacher = e.target.value;
		const input = teacherEl.nextElementSibling;
		if (teacher !== "null") {
			if (!otherTeacherSelected[classType]) return;
			otherTeacherSelected[classType] = false;
			input.classList.remove("otherTeacherSelected");
			input.required = false;
			return;
		}
		otherTeacherSelected[classType] = true;
		input.classList.add("otherTeacherSelected");
		input.required = true;
	});
});
