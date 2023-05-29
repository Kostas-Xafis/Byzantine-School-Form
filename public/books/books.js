const getCheckedBooks = () => {
	const checkboxes = document.getElementById("tableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedBooks = [];

	checkboxes.forEach(book => {
		checkedBooks.push(Number(book.getAttribute("data-id")));
	});
	return checkedBooks.map(id => bookList.find(book => book.id === id));
};
const sleep = (ms = 1000) => new Promise(res => setTimeout(res, ms));

let i = 0;
const deleteBooks = async e => {
	if (isDisabled("delete")) return;
	toggle("delete");
	try {
		const checkedBooks = getCheckedBooks();
		if (checkedBooks.length === 0) {
			alert("Επιλέξτε τουλάχιστον ένα βιβλίο για διαγραφή");
			toggle("delete");
			return;
		}
		const res = await fetch("/books/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(checkedBooks)
		});
		if (res.status >= 200 && res.status < 300) {
			document.querySelectorAll(".row:has(input[type=checkbox]:checked)").forEach(row => {
				row.dispatchEvent(new Event("delete"));
			});
		}
	} catch (error) {
		console.error(error);
	} finally {
		toggle("delete");
	}
};

const editBook = async e => {
	const form = document.forms.bookForm.elements;
	const book = {
		id: Number(document.getElementById("bookDialog").getAttribute("data-book-id")),
		title: form.title.value,
		author: form.author.value,
		genre: form.genre.value,
		wholesalePrice: Number(form.wholesalePrice.value),
		price: Number(form.price.value),
		quantity: Number(form.quantity.value),
		quantitySold: Number(form.quantitySold.value) // Not ideal, change the database to accept null values
	};
	try {
		const res = await fetch("/books/update", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(book)
		});
		if (res.status >= 200 && res.status < 300) console.log("Book updated successfully");
	} catch (error) {
		console.error(error);
	}
};

//Add book function
const addBook = async e => {
	const form = document.forms.bookForm.elements;
	const book = {
		title: form.title.value,
		author: form.author.value,
		genre: form.genre.value,
		wholesalePrice: Number(form.wholesalePrice.value),
		price: Number(form.price.value),
		quantity: Number(form.quantity.value),
		quantitySold: 0 // Not ideal, change the database to accept null values
	};
	try {
		// validate book
		if (
			book.title === "" ||
			book.author === "" ||
			book.genre === "" ||
			isNaN(book.wholesalePrice) ||
			isNaN(book.price) ||
			isNaN(book.quantity)
		) {
			alert("Please fill all the fields correctly");
			throw new Error("Invalid book");
		}
		const res = await fetch("/books/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(book)
		});
		if (res.status >= 200 && res.status < 300) {
			//close dialog and insert the new book in the table
		}
	} catch (error) {
		console.error(error);
	}
};

document.querySelectorAll("dialog").forEach(dialog => {
	const closeDialog = () => dialog.dispatchEvent(new Event("close"));
	const toggleInputs = (inputNames = [], toggleOn = true, fill) => {
		const inputs = dialog.querySelectorAll("input");
		inputs.forEach(input => {
			if (toggleOn) input.disabled = inputNames.includes(input.name) ? false : true;
			else input.disabled = true;
			if (fill && toggleOn) input.value = fill[input.name];
		});
	};
	dialog.addEventListener("close", e => {
		dialog.style.display = "none";
		toggleInputs([], false, {});
		const action = dialog.getAttribute("data-action");
		toggle(action);
	});
	dialog.addEventListener("show", e => {
		const { action, inputs, book } = e.detail;
		if (isDisabled(action)) return;
		toggle(action);

		textSetup[action]();
		dialog.style.display = "grid";
		dialog.setAttribute("data-action", action);
		if (action === "edit") dialog.setAttribute("data-book-id", book.id);

		toggleInputs(inputs, true, book);
	});
	dialog.querySelector("form").addEventListener("submit", async e => {
		e.preventDefault();
		dialog.getAttribute("data-action") === "add" ? await addBook(e) : await editBook(e);
		closeDialog();
	});
	// Close dialog modals if
	// the user clicks outside of them || presses ESC
	// || clicks cancel || user submits the form
	dialog.addEventListener("click", e => {
		if (e.target.tagName === "DIALOG") closeDialog();
	});
	dialog.querySelector(".closeDialog").addEventListener("click", e => {
		e.preventDefault();
		e.stopPropagation();
		closeDialog();
	});
	dialog.addEventListener("keydown", e => {
		if (e.key === "Escape") closeDialog();
	});
});

// It's pointless to use button.disabled = true/false
// because the click event is triggered nonetheless
const toggleButton = { add: false, edit: false, delete: false };
const toggle = type => {
	toggleButton[type] = !toggleButton[type];
};
const isDisabled = type => toggleButton[type];

document.getElementById("deleteBookButton").addEventListener("click", deleteBooks);
document.getElementById("addBookButton").addEventListener("click", e => {
	document.getElementById("bookDialog").dispatchEvent(
		new CustomEvent("show", {
			detail: { action: "add", inputs: ["title", "author", "genre", "wholesalePrice", "price", "quantity"] }
		})
	);
});
document.getElementById("editBookButton").addEventListener("click", e => {
	const checkedBooks = getCheckedBooks();
	if (checkedBooks.length === 1)
		return document.getElementById("bookDialog").dispatchEvent(
			new CustomEvent("show", {
				detail: { action: "edit", inputs: ["quantity", "quantitySold"], book: checkedBooks[0] }
			})
		);
	if (checkedBooks.length === 0) return alert("Please select a book");
	alert("Please select only one book");
});

const textSetup = {
	add: () => {
		const dialog = document.getElementById("bookDialog");
		dialog.querySelector("h1").innerText = "Προσθήκη νέου βιβλίου";
		dialog.querySelector("button").innerText = "Προσθήκη";
	},
	edit: () => {
		const dialog = document.getElementById("bookDialog");
		dialog.querySelector("h1").innerText = "Ενημέρωση νέου βιβλίου";
		dialog.querySelector("button").innerText = "Ενημέρωση";
	}
};
