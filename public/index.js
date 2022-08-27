const addRegister = document.getElementById("addRegisterForm");
const faIcons = {
	title: "fa-quote-left",
	author: "fa-user",
	price: "fa-euro-sign",
	genre: "fa-masks-theater"
};
const bookAttrName = {
	title: "Title:",
	author: "Author:",
	price: "Price:",
	genre: "Genre:"
};
document.getElementById("genre").addEventListener("change", e => e.target.blur());
document.querySelectorAll(".formSubmit").forEach(el => el.addEventListener("click", () => el.blur()));

addRegister.addEventListener("submit", async e => {
	e.preventDefault();
	const { author, title, price, genre, addRegisterSubmit } = e.target.elements;
	const data = {
		author: author.value,
		title: title.value,
		price: Number(price.value),
		genre: genre.value
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
