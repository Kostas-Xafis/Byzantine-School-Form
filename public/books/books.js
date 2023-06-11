const getCheckedBooks = () => {
	const checkboxes = document.getElementById("tableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedBooks = [];

	checkboxes.forEach(book => {
		checkedBooks.push(Number(book.getAttribute("data-id")));
	});
	return checkedBooks.map(id => {
		const book = bookList.find(book => book.id === id);
		book.wholesaler = book.wholesalerId;
		return book;
	});
};
const sleep = (ms = 1000) => new Promise(res => setTimeout(res, ms));

let i = 0;
const deleteBook = async e => {
	try {
		let checkedBooks = getCheckedBooks();
		checkedBooks = checkedBooks.map(book => book.id);
		if (checkedBooks.length === 0) {
			alert("Επιλέξτε τουλάχιστον ένα βιβλίο για διαγραφή");
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
		} else alert("Αποτυχία διαγραφής");
	} catch (error) {
		console.error(error);
		alert("Αποτυχία διαγραφής");
	}
};

const editBook = async e => {
	const form = document.forms.bookForm.elements;
	const book = {
		quantity: Number(form.quantity.value),
		id: Number(document.getElementById("bookDialog").getAttribute("data-book-id"))
	};
	try {
		const res = await fetch("/books/updateQuantity", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(book)
		});
		if (res.status >= 200 && res.status < 300) {
			document.querySelector(`.row:has(input[data-id="${book.id}"])`).dispatchEvent(new CustomEvent("update", { detail: { book } }));
		} else alert("Αποτυχία ενημέρωσης");
	} catch (error) {
		console.error(error);
		alert("Αποτυχία ενημέρωσης");
	}
};

//Add book function
const addBook = async e => {
	const form = document.forms.bookForm.elements;
	const book = {
		title: form.title.value,
		wholesaler: Number(form.wholesaler.value),
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
			book.genre === "" ||
			isNaN(book.wholesaler) ||
			isNaN(book.wholesalePrice) ||
			isNaN(book.price) ||
			isNaN(book.quantity)
		)
			throw new Error("Invalid book");

		const res = await fetch("/books/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(book)
		});
		if (res.status >= 200 && res.status < 300) {
			const book = await res.json();
			console.log(book);
			document.dispatchEvent(new CustomEvent("add", { detail: { book } }));
		}
	} catch (error) {
		console.error(error);
		if (error.message === "Invalid book") alert("Συμπληρώστε όλα τα πεδία σωστά");
		else alert("Αποτυχία προσθήκης βιβλίου");
	}
};

// Add wholesaler function
const addWholesaler = async e => {
	const form = document.forms.wholesalerForm.elements;
	const wholesaler = {
		name: form.name.value
	};
	try {
		// validate wholesaler
		if (wholesaler.name === "") throw new Error("Invalid wholesaler");

		const res = await fetch("/wholesalers/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(wholesaler)
		});
		if (res.status >= 200 && res.status < 300) {
			const wholesaler = await res.json();
			console.log(wholesaler);
			document.dispatchEvent(new CustomEvent("addWholesaler", { detail: { wholesaler } }));
		} else alert("Αποτυχία προσθήκης χονδρέμπορου");
	} catch (error) {
		console.error(error);
		alert("Αποτυχία προσθήκης χονδρέμπορου");
	}
};
const fetchCalls = {
	add: addBook,
	edit: editBook,
	delete: deleteBook,
	addWholesaler: addWholesaler
};

document.querySelectorAll("dialog").forEach(dialog => {
	const closeDialog = () => dialog.dispatchEvent(new Event("close"));
	const toggleInputs = (enabledInputs = [], toggleOn = true, fill = {}) => {
		const inputs = dialog.querySelectorAll("input, select");
		const hasFill = Object.values(fill)?.length;
		inputs.forEach(input => {
			if (toggleOn) input.disabled = enabledInputs.includes(input.name) ? false : true;
			else input.disabled = true;
			if (hasFill && toggleOn) input.value = fill[input.name];
			else input.value = "";
		});
	};
	dialog.addEventListener("close", e => {
		toggleInputs([], false, {});
		const action = dialog.getAttribute("data-action");
		toggle(action);
		toggleHide("#" + dialog.id);
		if (action === "delete") toggleHide("#bookFormContainer");
	});
	if (dialog.id === "bookDialog") {
		dialog.addEventListener("show", e => {
			const { action, enabledInputs, book } = e.detail;
			if (isDisabled(action)) return;
			toggle(action);

			textSetup[action]();
			toggleHide("#" + dialog.id);
			dialog.setAttribute("data-action", action);
			if (action === "edit") dialog.setAttribute("data-book-id", book.id);
			if (action === "delete") toggleHide("#bookFormContainer");
			toggleInputs(enabledInputs, true, book);
		});
	} else if (dialog.id === "wholesalerDialog") {
		dialog.addEventListener("show", e => {
			const { action, enabledInputs } = e.detail;
			if (isDisabled(action)) return;
			toggle(action);

			textSetup[action]();
			toggleHide("#" + dialog.id);
			dialog.setAttribute("data-action", action);
			toggleInputs(enabledInputs);
		});
	}
	dialog.querySelector("form").addEventListener("submit", async e => {
		e.preventDefault();
		await fetchCalls[dialog.getAttribute("data-action")](e);
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
const toggleButton = { add: false, edit: false, delete: false, addWholesaler: false };
const toggle = type => {
	toggleButton[type] = !toggleButton[type];
};
const isDisabled = type => toggleButton[type];

document.getElementById("deleteBookButton").addEventListener("click", e => {
	const checkedBooks = getCheckedBooks();
	if (checkedBooks.length === 0) return alert("Δεν έχετε επιλέξει βιβλία για διαγραφή");
	document.getElementById("bookDialog").dispatchEvent(new CustomEvent("show", { detail: { action: "delete", book: {} } }));
});

document.getElementById("addBookButton").addEventListener("click", e => {
	document.getElementById("bookDialog").dispatchEvent(
		new CustomEvent("show", {
			detail: { action: "add", enabledInputs: ["title", "wholesaler", "genre", "wholesalePrice", "price", "quantity"], book: {} }
		})
	);
});
document.getElementById("editBookButton").addEventListener("click", e => {
	const checkedBooks = getCheckedBooks();
	if (checkedBooks.length === 1)
		return document.getElementById("bookDialog").dispatchEvent(
			new CustomEvent("show", {
				detail: { action: "edit", enabledInputs: ["quantity"], book: checkedBooks[0] }
			})
		);
	if (checkedBooks.length === 0) return alert("Δεν έχετε επιλέξει βιβλία για επεξεργασία");
	alert("Μπορείτε να επεξεργαστείτε μόνο ένα βιβλίο τη φορά");
});

document.getElementById("addWholesalerButton").addEventListener("click", e => {
	document.getElementById("wholesalerDialog").dispatchEvent(
		new CustomEvent("show", {
			detail: { action: "addWholesaler", enabledInputs: ["name"] }
		})
	);
});

const textSetup = {
	add: () => {
		const dialog = document.getElementById("bookDialog");
		dialog.querySelector("h1").innerText = "Προσθήκη νέου βιβλίου";
		dialog.querySelector("button").innerText = "Προσθήκη";
	},
	edit: () => {
		const dialog = document.getElementById("bookDialog");
		dialog.querySelector("h1").innerText = "Ενημέρωση βιβλίου";
		dialog.querySelector("button").innerText = "Ενημέρωση";
	},
	delete: () => {
		const dialog = document.getElementById("bookDialog");
		dialog.querySelector("h1").innerText = "Είστε σίγουροι για τη διαγραφή των επιλεγμένων βιβλίων;";
		dialog.querySelector("button").innerText = "Διαγραφή";
	},
	addWholesaler: () => {
		const dialog = document.getElementById("wholesalerDialog");
		dialog.querySelector("h1").innerText = "Προσθήκη νέου χονδρέμπορου";
		dialog.querySelector("button").innerText = "Προσθήκη";
	}
};

const toggleHide = selector => {
	const element = document.querySelector(selector);
	element.classList.toggle("hidden");
};
