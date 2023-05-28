const columnNames = {
	id: "Id",
	title: "Τίτλος",
	author: "Συγγραφέας",
	genre: "Είδος",
	wholesalePrice: "Χονδρική Τιμή",
	price: "Λιανική Τιμή",
	quantity: "Ποσότητα",
	quantitySold: "Πωλήσεις",
	description: "Περιγραφή"
};

//Write a function that fills the table with the books from the database
let bookList = [];
const fillTable = async () => {
	const url = "/books/get";
	try {
		const books = await (await fetch(url)).json();
		bookList = JSON.parse(JSON.stringify(books));
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
		//remove the rowFadeIn class from the rows after the animation is done
		await sleep(400 + i * 50);
		document.querySelectorAll(".row").forEach(row => {
			row.classList.remove("rowFadeIn");
		});
	} catch (error) {
		console.error(error);
	}
};

//create a function that makes a row from a given book without innerHTML
const createRow = (book, setCheckbox = true) => {
	const className = "column";
	const row = createEl({ className: ["row", setCheckbox ? "rowFadeIn" : "noFadeIn"] });
	if (setCheckbox) row.appendChild(createEl({ type: "checkbox", "data-id": book.id }, "input"));
	else row.appendChild(createEl({ className }));
	delete book.id;
	// Row append child ->      Column append child ->      Paragraph
	for (const bookAttribute in book)
		row.appendChild(createEl({ className })).appendChild(createEl({ innerText: book[bookAttribute] }, "p"));

	row.addEventListener("click", e => {
		const checked = row.querySelector("input[type=checkbox]");
		if (checked) checked.checked = !checked.checked;
	});
	row.addEventListener("delete", e => {
		const row = e.currentTarget;
		row.classList.add("delete");
		sleep(400).then(() => row.remove());
	});
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
			(typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" && !Array.isArray(value))
		)
			continue;
		// The spread operator passes the array as individual arguments 🤯🤬
		if (attribute === "className") typeof value === "string" ? div.classList.add(value) : div.classList.add(...value);
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

fillTable();
