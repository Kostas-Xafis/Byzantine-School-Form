const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_API_KEY);

module.exports = {
	sendMail: async student => {
		const msg = {
			from: "koxafis@gmail.com", // Use the email address or domain you verified above
			to: "byzscholemousikhs@gmail.com",
			subject: `Νέα Αίτηση του/της ${student.FirstName + " " + student.LastName}`,
			html: `<strong>Νέα αίτηση του/της ${student.FirstName + " " + student.LastName} με καθηγητή/τρια τον/την ${
				student.Teacher
			} </strong>`
		};
		try {
			await sgMail.send(msg);
		} catch (error) {
			console.error(error);
			if (error.response) {
				console.error(error.response.body);
			}
		}
	}
};
