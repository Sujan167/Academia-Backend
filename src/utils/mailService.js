const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { NODEMAILER_SECRET, NODEMAILER_USER, NODEMAILER_TYPE } = process.env;
const transporter = nodemailer.createTransport({
	service: NODEMAILER_TYPE, // Replace with your SMTP service (e.g., 'Gmail', 'Outlook', etc.)
	auth: {
		user: NODEMAILER_USER, // Your email address
		pass: NODEMAILER_SECRET, // Your email password
	},
});

// ==============================================
// Function to send an email
const sendEmail = async (subject, text, mailTo) => {
	const mailOptions = {
		from: NODEMAILER_USER,
		to: mailTo,
		subject,
		text,
	};
	
	// -------------------------------------------------------------------
	
	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};
module.exports = { sendEmail };
