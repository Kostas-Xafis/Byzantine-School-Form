const errorMessages = {
	"Book is out of stock": "Το βιβλίο είναι εξαντλημένο"
};

const getCheckedPayments = () => {
	const checkboxes = document.getElementById("paymentsTableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedPayments = [];

	checkboxes.forEach(payment => {
		checkedPayments.push(Number(payment.getAttribute("data-id")));
	});
	return checkedPayments.map(id => paymentList.find(payment => payment.id === id));
};

const getCheckedPayoffs = () => {
	const checkboxes = document.getElementById("payoffsTableContainer").querySelectorAll("input[type=checkbox]:checked");
	const checkedPayoffs = [];

	checkboxes.forEach(payment => {
		checkedPayoffs.push(Number(payment.getAttribute("data-id")));
	});
	return checkedPayoffs.map(id => payoffList.find(payment => payment.id === id));
};

const sleep = (ms = 1000) => new Promise(res => setTimeout(res, ms));

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
			paymentList = paymentList.filter(payment => !checkedPayments.includes(payment.id));
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
				.querySelector(`.row:has(input[data-id="${payment.id}"])`)
				.dispatchEvent(new CustomEvent("update", { detail: { payment } }));
			paymentList = paymentList.map(p => (p.id === payment.id ? Object.assign(p, payment) : p));
		}
	} catch (error) {
		console.error(error);
	}
};

//Add payment function
const addPayment = async e => {
	const form = document.forms.paymentForm.elements;
	const payment = {
		student_name: form.student_name.value,
		bookId: Number(form.book.value),
		date: new Date(form.date.value).getTime() + 10800000
	};
	try {
		// validate payment
		if (payment.student_name === "" || isNaN(payment.bookId) || isNaN(payment.date)) {
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

const completePayoff = async e => {
	try {
		let checkedPayoffs = getCheckedPayoffs();
		checkedPayoffs = checkedPayoffs.map(payoff => payoff.id);
		if (checkedPayoffs.length === 0) {
			alert("Επιλέξτε τουλάχιστον μια οφειλή για ολοκλήρωση");
			return;
		}
		const res = await fetch("/payoffs/complete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(checkedPayoffs)
		});
		if (res.status >= 200 && res.status < 300) {
			document.querySelectorAll(".row:has(input[type=checkbox]:checked)").forEach(row => {
				row.dispatchEvent(new Event("complete"));
			});
			payoffList = payoffList.filter(payoff => !checkedPayoffs.includes(payoff.id));
		}
	} catch (error) {
		console.error(error);
	}
};

const editPayoff = async e => {
	const form = document.forms.payoffForm.elements;
	const payoff = {
		amount: Number(form.amount.value),
		id: Number(document.getElementById("payoffDialog").getAttribute("data-payoff-id"))
	};
	try {
		const res = await fetch("/payoffs/updateAmount", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payoff)
		});
		console.log(payoff);
		if (res.status >= 200 && res.status < 300) {
			document
				.querySelector(`.row:has(input[data-id="${payoff.id}"])`)
				.dispatchEvent(new CustomEvent("update", { detail: { payoff } }));
			payoffList = payoffList.map(p => (p.id === payoff.id ? Object.assign(p, payoff) : p));
		}
	} catch (error) {
		console.error(error);
	}
};

const actions = {
	addPayment: addPayment,
	editPayment: editPayment,
	completePayment: completePayment,
	editPayoff: editPayoff,
	completePayoff: completePayoff
};

document.querySelectorAll("dialog").forEach(dialog => {
	const closeDialog = () => dialog.dispatchEvent(new Event("close"));
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
const toggleHide = selector => {
	const element = document.querySelector(selector);
	element.classList.toggle("hidden");
};

(function () {
	const dialog = document.querySelector("#paymentDialog");
	const toggleInputs = (enabledInputs = [], toggleOn = true, fill = {}) => {
		const inputs = dialog.querySelectorAll("input, select");
		inputs.forEach(input => {
			if (toggleOn) input.disabled = enabledInputs.includes(input.name) ? false : true;
			else input.disabled = true;
			if (input.getAttribute("type") !== "date") input.value = toggleOn ? fill[input.name] || "" : "";
		});
		// Swap from dd/mm/yyyy -> mm/dd/yyyy
		let paymentDate = fill?.date?.split("/") || null;
		if (paymentDate) {
			//* 						 convert str -> num + 1 -> str
			paymentDate = [paymentDate[1], +paymentDate[0] + 1 + "", paymentDate[2]];
			paymentDate = paymentDate.join("-");
		}
		document.querySelector("input[type=date]").valueAsDate = new Date(paymentDate || Date.now());
	};

	dialog.addEventListener("close", e => {
		toggleInputs([], false, {});
		const action = dialog.getAttribute("data-action");
		toggle(action);
		toggleHide("#" + dialog.id);
		if (action === "completePayment") toggleHide("#paymentFormContainer");
	});
	dialog.addEventListener("show", e => {
		const { action, inputs, payment } = e.detail;
		if (isDisabled(action)) return;
		toggle(action);

		textSetup[action]();
		toggleHide("#" + dialog.id);
		dialog.setAttribute("data-action", action);
		if (action === "editPayment") dialog.setAttribute("data-payment-id", payment.id);
		if (action === "completePayment") toggleHide("#paymentFormContainer");
		toggleInputs(inputs, true, payment);
	});
	dialog.querySelector("form").addEventListener("submit", async e => {
		e.preventDefault();
		await actions[dialog.getAttribute("data-action")](e);
		dialog.dispatchEvent(new Event("close"));
	});
})();

(function () {
	const dialog = document.querySelector("#payoffDialog");
	const toggleInputs = (enabledInputs = [], toggleOn = true, fill = {}) => {
		const inputs = dialog.querySelectorAll("input");
		inputs.forEach(input => {
			if (toggleOn) input.disabled = enabledInputs.includes(input.name) ? false : true;
			else input.disabled = true;
			input.value = toggleOn ? fill[input.name] || "" : "";
		});
	};

	dialog.addEventListener("close", e => {
		toggleInputs([], false, {});
		const action = dialog.getAttribute("data-action");
		toggle(action);
		toggleHide("#" + dialog.id);
		if (action === "completePayoff") toggleHide("#payoffFormContainer");
	});
	dialog.addEventListener("show", e => {
		const { action, inputs, payoff } = e.detail;
		console.log("🚀 ~ file: payments.js:254 ~ payoff:", payoff);
		if (isDisabled(action)) return;
		toggle(action);

		textSetup[action]();
		toggleHide("#" + dialog.id);
		dialog.setAttribute("data-action", action);
		if (action === "editPayoff") dialog.setAttribute("data-payoff-id", payoff.id);
		if (action === "completePayoff") toggleHide("#payoffFormContainer");
		toggleInputs(inputs, true, payoff);
	});
	dialog.querySelector("form").addEventListener("submit", async e => {
		e.preventDefault();
		await actions[dialog.getAttribute("data-action")](e);
		dialog.dispatchEvent(new Event("close"));
	});
})();

// It's pointless to use button.disabled = true/false
// because the click event is triggered nonetheless
const toggleButton = {
	addPayment: false,
	editPayment: false,
	completePayment: false,
	editPayoff: false,
	completePayoff: false
};
const toggle = type => {
	toggleButton[type] = !toggleButton[type];
};
const isDisabled = type => toggleButton[type];

// PAYMENT ACTION BUTTONS LISTENERS
document.getElementById("completePaymentButton").addEventListener("click", e => {
	const checkedPayments = getCheckedPayments();
	if (checkedPayments.length === 0) return alert("Παρακαλώ επιλέξτε πληρωμές για ολοκλήρωση");
	document.getElementById("paymentDialog").dispatchEvent(new CustomEvent("show", { detail: { action: "completePayment" } }));
});
document.getElementById("editPaymentButton").addEventListener("click", e => {
	const checkedPayments = getCheckedPayments();
	if (checkedPayments.length === 1)
		return document.getElementById("paymentDialog").dispatchEvent(
			new CustomEvent("show", {
				detail: { action: "editPayment", inputs: ["amount"], payment: checkedPayments[0] }
			})
		);
	if (checkedPayments.length === 0) return alert("Παρακαλώ επιλέξτε μια πληρωμή");
	alert("Μπορείτε να επεξεργαστείτε μόνο μια πληρωμή τη φορά");
});
document.getElementById("addPaymentButton").addEventListener("click", e => {
	document.getElementById("paymentDialog").dispatchEvent(
		new CustomEvent("show", {
			detail: { action: "addPayment", inputs: ["student_name", "title", "date"] }
		})
	);
});

// PAYOFF ACTION BUTTONS LISTENERS
document.getElementById("completePayoffButton").addEventListener("click", e => {
	const checkedPayoffs = getCheckedPayoffs();
	if (checkedPayoffs.length === 0) return alert("Παρακαλώ επιλέξτε οφειλές για ολοκλήρωση");
	document.getElementById("payoffDialog").dispatchEvent(new CustomEvent("show", { detail: { action: "completePayoff" } }));
});
document.getElementById("editPayoffButton").addEventListener("click", e => {
	const checkedPayoffs = getCheckedPayoffs();
	if (checkedPayoffs.length === 1)
		return document.getElementById("payoffDialog").dispatchEvent(
			new CustomEvent("show", {
				detail: { action: "editPayoff", inputs: ["amount"], payoff: checkedPayoffs[0] }
			})
		);
	if (checkedPayoffs.length === 0) return alert("Παρακαλώ επιλέξτε μια οφειλή");
	alert("Μπορείτε να επεξεργαστείτε μόνο μια οφειλή τη φορά");
});

const textSetup = {
	addPayment: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Προσθήκη Νεας Πληρωμής";
		dialog.querySelector("button").innerText = "Προσθήκη";
	},
	editPayment: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Ενημέρωση Πληρωμής";
		dialog.querySelector("button").innerText = "Ενημέρωση";
	},
	completePayment: () => {
		const dialog = document.getElementById("paymentDialog");
		dialog.querySelector("h1").innerText = "Είστε σίγουροι για την ολοκλήρωση των πληρωμών;";
		dialog.querySelector("button").innerText = "Ολοκλήρωση";
	},
	editPayoff: () => {
		const dialog = document.getElementById("payoffDialog");
		dialog.querySelector("h1").innerText = "Ενημέρωση Οφειλής";
		dialog.querySelector("button").innerText = "Ενημέρωση";
	},
	completePayoff: () => {
		const dialog = document.getElementById("payoffDialog");
		dialog.querySelector("h1").innerText = "Είστε σίγουροι για την ολοκλήρωση των οφειλών;";
		dialog.querySelector("button").innerText = "Ολοκλήρωση";
	}
};
