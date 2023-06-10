const errorMessages = {
	"Book is out of stock": "Το βιβλίο είναι εξαντλημένο"
};

const getCheckedPayments = () => {
	const checkboxes = document.getElementById("tableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedPayments = [];

	checkboxes.forEach(payment => {
		checkedPayments.push(Number(payment.getAttribute("data-id")));
	});
	return checkedPayments.map(id => paymentList.find(payment => payment.id === id));
};
const sleep = (ms = 1000) => new Promise(res => setTimeout(res, ms));

let i = 0;
const completePayment = async e => {
	try {
		let checkedPayments = getCheckedPayments();
		checkedPayments = checkedPayments.map(payment => payment.id);
		if (checkedPayments.length === 0) {
			alert("Επιλέξτε τουλάχιστον μια πληρωμή για ολοκλήρωση");
			return;
		}
		const res = await fetch("/payments/complete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(checkedPayments)
		});
		if (res.status >= 200 && res.status < 300) {
			document.querySelectorAll(".row:has(input[type=checkbox]:checked)").forEach(row => {
				row.dispatchEvent(new Event("complete"));
			});
		}
	} catch (error) {
		console.error(error);
	}
};

const editPayment = async e => {
	const form = document.forms.paymentForm.elements;
	const payment = {
		amount: Number(form.amount.value),
		id: Number(document.getElementById("paymentDialog").getAttribute("data-payment-id"))
	};
	try {
		const res = await fetch("/payments/updatePayment", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payment)
		});
		if (res.status >= 200 && res.status < 300) {
			document
				.querySelector(`.row:has(input[data-id="${book.id}"])`)
				.dispatchEvent(new CustomEvent("update", { detail: { payment } }));
		}
	} catch (error) {
		console.error(error);
	}
};

//Add payment function
const addPayment = async e => {
	const form = document.forms.paymentForm.elements;
	const payment = {
		studentName: form.studentName.value,
		bookId: form.title.value,
		date: new Date(form.date.value).getTime() + 10800000
	};
	try {
		// validate payment
		if (payment.studentName === "" || isNaN(payment.bookId) || isNaN(payment.date)) {
			alert("Λάθος στοιχεία πληρωμής");
			throw new Error("Invalid payment");
		}
		const res = await fetch("/payments/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payment)
		});
		if (res.status >= 200 && res.status < 300) {
			const newPayment = await res.json();
			document.dispatchEvent(new CustomEvent("add", { detail: { payment: newPayment } }));
		} else if (res.status === 400 && res.status < 500) {
			const { message } = await res.json();
			alert(errorMessages[message] || message);
		}
	} catch (error) {
		console.error(error);
	}
};

const paymentActions = {
	add: addPayment,
	edit: editPayment,
	complete: completePayment
};

document.querySelectorAll("dialog").forEach(dialog => {
	const closeDialog = () => dialog.dispatchEvent(new Event("close"));
	const toggleInputs = (inputNames = [], toggleOn = true, fill) => {
		dialog.querySelectorAll("input").forEach(input => {
			if (toggleOn) input.disabled = inputNames.includes(input.name) ? false : true;
			else input.disabled = true;
			if (fill && toggleOn) input.value = fill[input.name] || "";
		});
	};

	const toggleHide = selector => {
		const element = document.querySelector(selector);
		element.classList.toggle("hidden");
	};

	dialog.addEventListener("close", e => {
		toggleInputs([], false, {});
		const action = dialog.getAttribute("data-action");
		toggle(action);
		toggleHide("dialog");
		if (action === "complete") toggleHide("#paymentFormContainer");
	});
	dialog.addEventListener("show", e => {
		const { action, inputs, payment } = e.detail;
		if (isDisabled(action)) return;
		toggle(action);

		textSetup[action]();
		toggleHide("dialog");
		dialog.setAttribute("data-action", action);
		if (action === "edit") dialog.setAttribute("data-payment-id", payment.id);
		if (action === "complete") toggleHide("#paymentFormContainer");
		toggleInputs(inputs, true, payment);
	});
	dialog.querySelector("form").addEventListener("submit", async e => {
		e.preventDefault();
		await paymentActions[dialog.getAttribute("data-action")](e);
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
const toggleButton = { add: false, edit: false, complete: false };
const toggle = type => {
	toggleButton[type] = !toggleButton[type];
};
const isDisabled = type => toggleButton[type];

document.getElementById("completePaymentButton").addEventListener("click", e => {
	const checkedPayments = getCheckedPayments();
	if (checkedPayments.length === 0) return alert("Παρακαλώ επιλέξτε πληρωμές για ολοκλήρωση");
	document.getElementById("paymentDialog").dispatchEvent(new CustomEvent("show", { detail: { action: "complete" } }));
});

document.getElementById("addPaymentButton").addEventListener("click", e => {
	document.getElementById("paymentDialog").dispatchEvent(
		new CustomEvent("show", {
			detail: { action: "add", inputs: ["studentName", "amount", "date"] }
		})
	);
});

document.getElementById("editPaymentButton").addEventListener("click", e => {
	const checkedPayments = getCheckedPayments();
	if (checkedPayments.length === 1)
		return document.getElementById("paymentDialog").dispatchEvent(
			new CustomEvent("show", {
				detail: { action: "edit", inputs: ["amount"], payment: checkedPayments[0] }
			})
		);
	if (checkedPayments.length === 0) return alert("Παρακαλώ επιλέξτε μια πληρωμή");
	alert("Μπορείτε να επεξεργαστείτε μόνο μια πληρωμή τη φορά");
});

const textSetup = {
	add: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Προσθήκη Νεας Πληρωμής";
		dialog.querySelector("button").innerText = "Προσθήκη";
	},
	edit: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Ενημέρωση Πληρωμής";
		dialog.querySelector("button").innerText = "Ενημέρωση";
	},
	complete: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Είστε σίγουροι για την ολοκλήρωση των πληρωμών;";
		dialog.querySelector("button").innerText = "Ολοκλήρωση";
	}
};
