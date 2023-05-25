/**
 *
 * @returns {int[]} Array of checked books
 */
const getCheckedBooks = () => {
	const checkboxes = document.getElementById("tableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedBooks = [];

	checkboxes.forEach(book => {
		checkboxes.push(Number(book.getAttribute("data-id")));
	});
	return checkedBooks;
};

const deleteBooks = async () => {
	const checkedBooks = getCheckedBooks();
	const url = "/books/delete";
	const data = JSON.stringify(checkedBooks);

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: data
		});
		const result = await res.json();
		if (result.status === "ok") {
			location.reload();
		}
	} catch (error) {
		console.error(error);
	}
};

const editBook = async () => {
	const checkedBooks = getCheckedBooks();
	if (checkedBooks.length === 1) {
		// Opens a modal with the book data
		const url = "/books/getBook?id=" + checkedBooks[0];
		try {
			const res = await fetch(url);
			const book = await res.json();
		} catch (error) {
			console.error(error);
		}
	} else {
		alert("Please select only one book");
	}
};

const columnNames = {
	id: "Id",
	title: "Title",
	author: "Author",
	genre: "Genre",
	price: "Price",
	retailPrice: "Retail Price",
	quantity: "Quantity",
	quantitySold: "Sold",
	description: "Description"
};

//Write a function that fills the table with the books from the database
const fillTable = async () => {
	const url = "/books/getBooks";
	try {
		// const res = await fetch(url);
		// const books = await res.json();
		const books = dummyBooks;
		const table = document.getElementById("tableContainer");
		setCustomCSSProp(
			"--grid-cols",
			Object.keys(columnNames)
				.map(key => columnNames[key].length + 4 + "ch")
				.join(" "),
			table
		);
		table.appendChild(createRow(columnNames, false));
		let i = -1;
		books.forEach(book => {
			table.appendChild(setCustomCSSProp("--delay", ++i * 50 + "ms", createRow(book)));
		});
	} catch (error) {
		console.error(error);
	}
};

//create a function that makes a row from a given book without innerHTML
const createRow = (book, setCheckbox = true) => {
	const className = "column";
	const row = createEl({ className: "row" });
	if (setCheckbox) row.appendChild(createEl({ type: "checkbox", "data-id": book.id }, "input"));
	else row.appendChild(createEl({ className }));
	delete book.id;
	// Row append child ->      Column append child ->      Paragraph
	for (const bookAttribute in book)
		row.appendChild(createEl({ className })).appendChild(createEl({ innerText: book[bookAttribute] }, "p"));

	return row;
};

//Write a function that creates a <div> element with a given class
const createEl = (attributes = {}, element = "div") => {
	const div = document.createElement(element);
	for (const attribute in attributes) {
		const value = attributes[attribute];
		if (attribute === "" || attribute === null || attribute === undefined || typeof attribute !== "string") continue;
		if (
			value === "" ||
			value === null ||
			value === undefined ||
			(typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")
		)
			continue;
		if (attribute === "className") div.classList.add(value);
		else if (attribute.startsWith("--")) setCustomCSSProp(attribute, value, div);
		else if (attribute in div) div[attribute] = value;
		else div.setAttribute(attribute, value);
	}
	return div;
};

const setCustomCSSProp = (property, value, el) => {
	el.style.setProperty(property, value);
	return el;
};

const dummyBooks = [
	{
		id: 1,
		title: "Assumenda!",
		author: "Autem.",
		genre: "Alias.",
		price: "Facere.",
		retailPrice: "Distinctio.",
		quantity: "Exercitationem.",
		quantitySold: "Velit!",
		description: "Rerum?"
	},
	{
		id: 2,
		title: "Deleniti?",
		author: "Quo!",
		genre: "Aperiam.",
		price: "Dolorem?",
		retailPrice: "Iure?",
		quantity: "Sequi!",
		quantitySold: "Repellendus!",
		description: "Nam."
	},
	{
		id: 3,
		title: "Odit!",
		author: "Voluptatum.",
		genre: "Quia?",
		price: "Voluptates?",
		retailPrice: "Dolor!",
		quantity: "Eveniet!",
		quantitySold: "Optio!",
		description: "Accusamus!"
	},
	{
		id: 4,
		title: "Quasi.",
		author: "Minus.",
		genre: "Dolorem.",
		price: "Veritatis.",
		retailPrice: "Adipisci.",
		quantity: "Quas!",
		quantitySold: "Molestiae?",
		description: "Labore!"
	},
	{
		id: 5,
		title: "Recusandae?",
		author: "Natus?",
		genre: "Natus.",
		price: "Illo.",
		retailPrice: "Dolorum.",
		quantity: "Aperiam.",
		quantitySold: "Totam!",
		description: "Magnam!"
	},
	{
		id: 6,
		title: "Ipsum?",
		author: "Provident!",
		genre: "Sunt.",
		price: "Pariatur!",
		retailPrice: "Nihil!",
		quantity: "Animi?",
		quantitySold: "Quidem.",
		description: "Placeat."
	},
	{
		id: 7,
		title: "Cupiditate!",
		author: "Necessitatibus?",
		genre: "Tenetur?",
		price: "Quod?",
		retailPrice: "Culpa?",
		quantity: "Neque.",
		quantitySold: "Magni?",
		description: "Nemo."
	},
	{
		id: 8,
		title: "Molestias.",
		author: "Magnam.",
		genre: "Maiores?",
		price: "Dolores?",
		retailPrice: "Molestiae?",
		quantity: "Odio.",
		quantitySold: "Nostrum.",
		description: "Ipsum?"
	},
	{
		id: 9,
		title: "Temporibus!",
		author: "Ullam.",
		genre: "Laboriosam?",
		price: "Unde!",
		retailPrice: "Praesentium!",
		quantity: "Quaerat.",
		quantitySold: "Modi!",
		description: "Eius."
	},
	{
		id: 1,
		title: "Placeat.",
		author: "Corrupti!",
		genre: "Veniam?",
		price: "Blanditiis.",
		retailPrice: "Delectus!",
		quantity: "Saepe.",
		quantitySold: "Reprehenderit.",
		description: "Repudiandae."
	},
	{
		id: 1,
		title: "Delectus.",
		author: "Error!",
		genre: "Porro!",
		price: "Odit.",
		retailPrice: "Beatae.",
		quantity: "Alias!",
		quantitySold: "Non!",
		description: "Corporis."
	}
];

fillTable();
