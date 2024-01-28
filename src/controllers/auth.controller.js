const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { SUPER_USER_EMAIL, FRONTEND_URL, ACCESS_TOKEN_SECRET, TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION } = process.env;
const { createStudent } = require("./student.controller");
const { createStaff } = require("./staff.controller");
const { ApiError } = require("../utils");
const { appendCache, prisma, sendEmail } = require("../utils");
const { generateAccessToken, generateRefreshToken, generateReferenceCode, emailQueue } = require("../utils");

// ===================================================================

// Hash the password
async function hashedPassword(password) {
	return await bcrypt.hash(password, 10);
}

// -------------------------------------------------------------------

// GET /api/auth/forget-password
const generateOTP = asyncHandler(async (req, res) => {
	//1. generate OTP here and send to the mail

	const otp = await generateReferenceCode(6);
	const email = req.user["email"];

	// 2. update database with newOTP for verification
	await prisma.User.update({
		where: { id: req.user.id },
		data: { referenceKey: otp },
	});
	await prisma.otp.create({
		data: {
			email: email,
			key: otp,
		},
	});

	//3. send mail

	const mailText = otp;
	// await sendEmail("OTP to reset password", mailText, email);
	// add to queue
	emailQueue.add(mailText, email);

	const data = { email, otp };
	return res.status(200).json({ success: true, message: "OTP is sent to the email", data: data });
});

// -------------------------------------------------------------------

// POST /api/auth/forget-password
const verifyOTP = asyncHandler(async (req, res) => {
	// const { otp } = req.query;
	const { otp } = req.body;
	if (!otp) {
		return res.json({ success: false, message: "OTP is required" });
	}
	const reference = await prisma.User.findFirst({
		where: {
			id: req.user.id,
		},
	});
	// const key = await prisma.otp.findFirst({
	// 	where: {
	// 		email: req.user.email,
	// 	},
	// });
	if (reference.referenceKey === otp) {
		return res.status(200).json({ success: true, message: "OTP verified" });
	}
	return res.status(403).json({ success: false, message: "Invalid OTP" });
});

// -------------------------------------------------------------------

// PUT /api/auth/forget-password
const forgetPassword = asyncHandler(async (req, res) => {
	// get OTP-Verification request from client, verify OTP and give response. get new password from user and then update to the database

	const { password } = req.body;
	if (!password) {
		return res.json({ success: false, message: "Password is required" });
	}
	const hashedPass = await hashedPassword(password);
	await prisma.User.update({
		where: { id: req.user.id },
		data: { password: hashedPass, referenceKey: "" },
	});
	// making referenceKey empty for avoiding potential future risk
	return res.status(200).json({ success: true, message: "Password Reset Successfully" });
});

// -------------------------------------------------------------------

// PUT /api/auth/set-new-password
const setNewPassword = asyncHandler(async (req, res) => {
	const { email, referenceKey, password } = req.body;
	if (!email || !referenceKey || !password) {
		return res.json({ success: false, message: "All fields are required." });
	}
	const user = await prisma.User.findUnique({
		where: { email },
	});
	const hashPass = await hashedPassword(password);
	if (user.referenceKey === referenceKey) {
		await prisma.User.update({
			where: { id: user.id },
			data: { password: hashPass, referenceKey: "" },
		});
		return res.status(200).json({ success: true, message: "New Password is set!" });
	}
	return res.status(404).json({ success: false, message: "ReferenceKey mismatched" });
});
// -------------------------------------------------------------------

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
	const { email, role, password } = req.body;
	const { id, referenceKey } = req.query;
	if (id && referenceKey) {
		const tempUser = await prisma.User.findUnique({
			where: { id },
		});
		const hashPass = await hashedPassword(password);

		if (tempUser.referenceKey === referenceKey) {
			await prisma.User.update({
				where: { id: tempUser.id },
				data: { password: hashPass, referenceKey: "" },
			});
			return res.status(200).json({ success: true, message: "New Password is set!" });
		}
	}

	if (!email || !role || !password) {
		return res.json({ success: false, message: "All fields are required." });
	}

	// Implement user authentication and Prisma query
	const user = await prisma.User.findUnique({
		where: {
			email: email,
			role: role.toUpperCase(),
		},
		// select: customSelect, //don't do this otherwise it won't have password to compare
	});

	if (!user.verified) {
		return res.status(403).json({ success: false, message: "You are not verified yet | please wait until admin verify you" });
	}
	if (user.suspended) {
		return res.status(403).json({ success: false, message: "Access Denied. User is suspeneded" });
	}

	if (user && bcrypt.compareSync(password, user.password)) {
		//generate accessToken
		const { token } = await generateAccessToken(user);

		// generate refreshToken
		const refreshToken = await generateRefreshToken(user);

		console.log(`\n🇳🇵token: ${token}\n`);

		// save refreshToken into the database
		const newUser = await prisma.User.update({
			where: { id: user.id },
			data: { refreshToken },
		});

		// Set the refreshToken as a cookie and set the Authorization header before sending the JSON response.
		const options = {
			httpOnly: true,
			sameSite: "strict",
		};
		newUser.password = undefined; //don't send password to the client
		newUser.updated_at = undefined;
		newUser.referenceKey = undefined;
		// newUser.refreshToken = undefined;

		res.cookie("refreshToken", newUser.refreshToken, options).header("Authorization", `Bearer ${token}`);
		newUser.refreshToken = undefined;
		return res.json(newUser);
	} else {
		res.status(401).json({ success: false, message: "Authentication failed" });
	}
});

// -------------------------------------------------------------------

// // POST /api/auth/user/registration
const registration = asyncHandler(async (req, res) => {
	const userData = req.body;
	const { name, phoneNumber, email, role, dateOfBirth, address, gender, joinDate } = userData;
	if ([name, phoneNumber, email, role, dateOfBirth, address, gender].some((field) => field?.trim === "")) {
		throw new ApiError(400, "All fields are required");
	}
	const isUserExist = await prisma.User.findUnique({
		where: { email },
	});
	if (isUserExist) {
		return res.status(400).json({ success: false, message: "User Already Exist" });
	}
	const uName = name.split(" ");
	const firstName = uName[0];
	const lastName = uName[uName.length - 1];

	const joiningYear = new Date(joinDate).getFullYear();
	if (role.toUpperCase() === "STUDENT") {
		var username = `${firstName}${lastName}${userData.batch}@${role.toLowerCase()}.ambition.edu.np`;
	} else {
		var username = `${firstName}${lastName}${joiningYear}@${role.toLowerCase()}.ambition.edu.np`;
	}

	// Hash the password before saving it to the database
	if (email === SUPER_USER_EMAIL) {
		var password = "password@123";
		var verified = true;
		var suspended = false;
	} else {
		var password = await generateReferenceCode(12);
	}
	console.log(`\nPassoword:: ${password}\n`);
	const hashedPass = await hashedPassword(password);

	const userDataToCreate = { username, name, email, password: hashedPass, dateOfBirth: new Date(dateOfBirth), phoneNumber, address, gender, role: role.toUpperCase(), verified: verified ? true : false, suspended: suspended ? true : false };

	// Create the user based on the role
	const newUser = await prisma.User.create({
		data: userDataToCreate,
	});
	console.log(`\nuserID:: ${newUser.id}\n`);
	newUser.password = undefined;
	newUser.updated_at = undefined;

	// set userId inside body in order pass to other functions
	req.body.userId = newUser.id;

	//update the cached data
	await appendCache("/api/user/", "users", newUser);

	if (userData.role.toUpperCase() === "STUDENT") {
		await createStudent(req, res);
		return res.status(201).json({ message: "New Student Created 👻", newUser });
	} else if (userData.role.toUpperCase() === "STAFF") {
		await createStaff(req, res);
		return res.status(201).json({ message: "New Staff Created 👻", newUser });
	} else {
		return res.status(201).json({ message: "New Admin Created 👻", newUser });
	}
});

module.exports = { registration, generateAccessToken, login, forgetPassword, generateOTP, verifyOTP, setNewPassword };
