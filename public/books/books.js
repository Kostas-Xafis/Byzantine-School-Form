const getCheckedBooks = () => {
	const checkboxes = document.getElementById("tableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedBooks = [];

	checkboxes.forEach(book => {
		checkedBooks.push(Number(book.getAttribute("data-id")));
	});
	return checkedBooks;
};
const sleep = (ms = 1000) => new Promise(res => setTimeout(res, ms));

let i = 0;
const deleteBooks = async e => {
	if (isDisabled("delete")) return;
	toggle("delete");
	try {
		const checkedBooks = getCheckedBooks();
		const res = await fetch("/books/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(checkedBooks)
		});
		if (res.status >= 200 && res.status < 300) {
			document.querySelectorAll(".row:has(input[type=checkbox]:checked)").forEach(row => {
				row.dispatchEvent(new CustomEvent("delete"));
			});
		}
	} catch (error) {
		console.error(error);
	} finally {
		toggle("delete");
	}
};

const editBook = async e => {
	if (isDisabled("edit")) return;
	toggle("edit");
	const checkedBooks = getCheckedBooks();
	if (checkedBooks.length === 1) {
		// Opens a modal with the book data
		const url = "/books/get?id=" + checkedBooks[0];
		try {
			const res = await fetch(url);
			const book = await res.json();
			console.log(book);
		} catch (error) {
			console.error(error);
		}
	} else {
		toggle("edit");
		if (checkedBooks.length === 0) alert("Please select a book");
		else alert("Please select only one book");
	}
};

//Add book function
const addBook = async () => {};

// It's pointless to use button.disabled = true/false
// because the click event is triggered nonetheless
const toggleButton = { add: false, edit: false, delete: false };
const toggle = type => {
	toggleButton[type] = !toggleButton[type];
};
const isDisabled = type => toggleButton[type];

document.getElementById("deleteBookButton").addEventListener("click", deleteBooks);
document.getElementById("editBookButton").addEventListener("click", editBook);
document.getElementById("addBookButton").addEventListener("click", addBook);
