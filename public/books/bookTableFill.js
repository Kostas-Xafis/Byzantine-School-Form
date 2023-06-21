const columnNames = {
	id: "Id",
	title: "Τίτλος",
	wholesaler: "Χονδρέμπορος",
	genre: "Είδος",
	wholesale_price: "Χονδρική Τιμή",
	price: "Λιανική Τιμή",
	quantity: "Ποσότητα",
	sold: "Πωλήσεις",
	reserved: "Απόθεμα"
};

//Write a function that fills the table with the books from the database
let bookList = [];
let wholesalerList = [];
const fillBooksTable = async () => {
	const table = document.getElementById("tableContainer");
	setCustomCSSProp(
		"--grid-cols",
		Object.values(columnNames)
			.map(key => key.length + 4 + "ch")
			.join(" "),
		table
	);
	table.appendChild(createRow(columnNames, columnNames, false));
	let i = -1;
	bookList.forEach(book => {
		const bookCopy = Object.assign({}, book);
		bookCopy.wholesale_price += "€";
		bookCopy.price += "€";
		table.appendChild(setCustomCSSProp("--delay", ++i * 50 + "ms", createRow(bookCopy, columnNames)));
	});
	//remove the rowFadeIn class from the rows after the animation is done
	await sleep(400 + i * 50);
	document.querySelectorAll(".row").forEach(row => {
		row.classList.remove("rowFadeIn");
	});
};

const fillTotalsTable = () => {
	const totalsColumnNames = {
		quantity: "Σύνολο Ποσότητας",
		sold: "Σύνολο Πωλήσεων",
		reserved: "Συνολικό Αποθέματος",
		profit: "Συνολικό Κέρδος",
		repayment: "Σύνολο Εξόφλησης"
	};

	const table = document.getElementById("totalsTableContainer");
	if (table.children.length > 1) table.querySelectorAll(".row").forEach(row => row.remove());
	setCustomCSSProp(
		"--grid-cols",
		Object.value(totalsColumnNames)
			.map(key => key.length + 4 + "ch")
			.join(" "),
		table
	);
	table.appendChild(createRow(totalsColumnNames, totalsColumnNames, false));
	const totals = {
		quantity: 0,
		sold: 0,
		reserved: 0,
		profit: 0,
		repayment: 0
	};
	for (let i = 0; i < bookList.length; i++) {
		totals.quantity += bookList[i].quantity;
		totals.sold += bookList[i].sold;
		totals.reserved += bookList[i].reserved;
		totals.profit += bookList[i].sold * (bookList[i].price - bookList[i].wholesale_price);
		totals.repayment += bookList[i].reserved * bookList[i].wholesale_price;
	}

	table.appendChild(createRow(totals, totalsColumnNames, false));
	table.querySelectorAll(".column:first-child").forEach(column => {
		column.remove();
	});
};
//create a function that makes a row from a given book without innerHTML
const createRow = (data, columns, setCheckbox = true) => {
	const className = "column";
	const row = createEl({ className: ["row", setCheckbox ? "rowFadeIn" : "noFadeIn"] });
	if (setCheckbox) row.appendChild(createEl({ type: "checkbox", "data-id": data.id }, "input"));
	else row.appendChild(createEl({ className }));
	// Row append child ->      Column append child ->      Paragraph
	for (const dataAttribute in columns)
		if (dataAttribute !== "id")
			row.appendChild(createEl({ className, "data-name": dataAttribute })).appendChild(
				createEl({ innerText: data[dataAttribute] }, "p")
			);

	row.addEventListener("click", e => {
		const checked = row.querySelector("input[type=checkbox]");
		if (checked) checked.checked = !checked.checked;
	});
	row.addEventListener("delete", e => {
		const row = e.currentTarget;
		row.classList.add("delete");
		sleep(650).then(() => row.remove());
	});
	row.addEventListener("update", e => {
		const { book } = e.detail;
		row.querySelectorAll(".column").forEach(column => {
			const dataName = column.dataset.name;
			if (dataName === "id" || !(dataName in book)) return;
			column.querySelector("p").innerText = book[dataName];
		});
	});
	return row;
};
document.addEventListener("add", e => {
	const { book } = e.detail;
	book.wholesaler = wholesalerList.find(wholesaler => wholesaler.id === book.wholesaler_id).name;
	book.reserved = book.quantity - book.sold;
	bookList.push(book);

	const bookCopy = Object.assign({}, book);
	bookCopy.wholesale_price += "€";
	bookCopy.price += "€";
	const table = document.getElementById("tableContainer");
	const row = createRow(book, columnNames);
	if (table.children.length === 1) table.appendChild(row);
	else table.insertBefore(row, table.children.item(1));
	fillTotalsTable();
});

document.addEventListener("addWholesaler", e => {
	const { wholesaler } = e.detail;
	wholesalerList.push(wholesaler);

	const select = document.querySelector("select");
	const option = createEl({ value: wholesaler.id, innerText: wholesaler.name }, "option");
	select.appendChild(option);
});

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

const fillWholesalersSelect = () => {
	const select = document.querySelector("select");
	wholesalerList.forEach(wholesaler => {
		const option = createEl({ value: wholesaler.id }, "option");
		option.innerText = wholesaler.name;
		select.appendChild(option);
	});
};

(async () => {
	try {
		const [res1, res2] = await Promise.all([fetch("/books/get"), fetch("/wholesalers/get")]);
		const [books, wholesalers] = await Promise.all([res1.json(), res2.json()]);
		// Add a reserved property to each book
		books.forEach(book => {
			book.reserved = book.quantity - book.sold;
		});
		bookList = JSON.parse(JSON.stringify(books));
		fillBooksTable();
		fillTotalsTable();
		wholesalerList = JSON.parse(JSON.stringify(wholesalers));
		fillWholesalersSelect();
	} catch (error) {
		console.error(error);
	}
})();
