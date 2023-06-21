const paymentColumns = {
	id: "Id",
	student_name: "Μαθητής",
	amount: "Οφειλή",
	date: "Ημερομηνία"
};

const payoffColumns = {
	id: "Id",
	wholesaler: "Χονδρέμπορος",
	amount: "Οφειλή"
};

const totalsColumnNames = {
	quantity: "Σύνολο Ποσότητας",
	sold: "Σύνολο Πωλήσεων",
	reserved: "Σύνολο Αποθέματος",
	profit: "Σύνολο Κέρδους",
	repayment: "Σύνολο Εξόφλησης"
};

//Write a function that fills the table with the payments from the database
let paymentList = [];
let payoffList = [];
const fillPaymentsTable = async () => {
	const table = document.getElementById("paymentsTableContainer");
	// empty table if it has elements
	if (table.children.length > 0)
		table.querySelectorAll(".row").forEach(row => {
			row.remove();
		});

	setCustomCSSProp(
		"--grid-cols",
		Object.values(paymentColumns)
			.map(key => key.length + 4 + "ch")
			.join(" "),
		table
	);
	table.appendChild(createRow(paymentColumns, paymentColumns, false));
	let i;
	for (i = 0; i < paymentList.length; i++) {
		const paymentCopy = Object.assign({}, paymentList[i]);
		table.appendChild(setCustomCSSProp("--delay", i * 50 + "ms", createRow(paymentCopy, paymentColumns)));
	}
	//remove the rowFadeIn class from the rows after the animation is done
	await sleep(400 + i * 50);
	table.querySelectorAll(".row").forEach(row => {
		row.classList.remove("rowFadeIn");
	});
};

const fillPayoffsTable = async () => {
	const table = document.getElementById("payoffsTableContainer");
	// empty table if it has elements
	if (table.children.length > 0)
		table.querySelectorAll(".row").forEach(row => {
			row.remove();
		});

	setCustomCSSProp(
		"--grid-cols",
		Object.values(payoffColumns)
			.map(key => key.length + 4 + "ch")
			.join(" "),
		table
	);
	table.appendChild(createRow(payoffColumns, payoffColumns, false));
	let i;
	for (i = 0; i < payoffList.length; i++) {
		const paymentCopy = Object.assign({}, payoffList[i]);
		table.appendChild(setCustomCSSProp("--delay", i * 50 + "ms", createRow(paymentCopy, payoffColumns)));
	}
	//remove the rowFadeIn class from the rows after the animation is done
	await sleep(400 + i * 50);
	table.querySelectorAll(".row").forEach(row => {
		row.classList.remove("rowFadeIn");
	});
};

// const fillTotalsTable = () => {
// 	const table = document.getElementById("totalsTableContainer");
// 	setCustomCSSProp(
// 		"--grid-cols",
// 		Object.keys(totalsColumnNames)
// 			.map(key => totalsColumnNames[key].length + 4 + "ch")
// 			.join(" "),
// 		table
// 	);
// 	table.appendChild(createRow(totalsColumnNames, totalsColumnNames, false));
// 	const totals = {
// 		quantity: 0,
// 		sold: 0,
// 		reserved: 0,
// 		profit: 0,
// 		repayment: 0
// 	};
// 	paymentList.forEach(payment => {
// 		totals.quantity += payment.quantity;
// 		totals.sold += payment.sold;
// 		totals.reserved += payment.reserved;
// 		totals.profit += payment.sold * (payment.price - payment.wholesale_price);
// 		totals.repayment += payment.reserved * payment.wholesale_price;
// 	});
// 	table.appendChild(createRow(totals, totalsColumnNames, false));
// 	table.querySelectorAll(".column:first-child").forEach(column => {
// 		column.remove();
// 	});
// };
//create a function that makes a row from a given payment without innerHTML
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
	row.addEventListener("complete", e => {
		const row = e.currentTarget;
		row.classList.add("complete");
		sleep(650).then(() => row.remove());
	});
	row.addEventListener("update", e => {
		let isPayment = "payment" in e.detail;
		console.log("🚀 ~ file: paymentsTableFill.js:134 ~ createRow ~ e.detail:", e.detail);
		row.querySelectorAll(".column").forEach(column => {
			const dataName = column.dataset.name;
			const payment = isPayment ? e.detail.payment : e.detail.payoff;
			console.log("🚀 ~ file: paymentsTableFill.js:138 ~ row.querySelectorAll ~ payment:", payment);
			if (dataName === "id" || !(dataName in payment)) return;
			column.querySelector("p").innerText = payment[dataName];
		});
	});
	return row;
};
document.addEventListener("add", e => {
	const { payment } = e.detail;
	const date = new Date(payment.date);
	payment.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	paymentList.push(payment);

	const table = document.getElementById("tableContainer");
	const row = createRow(payment, paymentColumns);
	if (table.children.length === 1) table.appendChild(row);
	else table.insertBefore(row, table.children.item(1));
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

//function that fills the select element with the books from the arguments
const fillBooksSelect = books => {
	const select = document.querySelector("select[name=book]");
	books.forEach(book => {
		const option = createEl({ value: book.id, innerText: book.title }, "option");
		select.appendChild(option);
	});
};

const loadData = async () => {
	try {
		const [res1, res2, res3] = await Promise.all([fetch("/payments/get"), fetch("/books/get"), fetch("/payoffs/get")]);
		const [payments, books, payoffs] = await Promise.all([res1.json(), res2.json(), res3.json()]);

		// Add a reserved property to each payment
		payments.forEach(payment => {
			const date = new Date(payment.date);
			//format date to dd/mm/yyyy
			payment.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		});
		paymentList = JSON.parse(JSON.stringify(payments));
		payoffList = JSON.parse(JSON.stringify(payoffs));
		fillPaymentsTable();
		fillPayoffsTable();
		fillBooksSelect(books);
		// fillTotalsTable();
	} catch (error) {
		console.error(error);
	}
};

loadData();
