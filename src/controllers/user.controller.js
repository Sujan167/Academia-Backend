const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { REDIS_TTL } = process.env;
const { updateStudent } = require("./student.controller");
const { updateStaff } = require("./staff.controller");
const { updateCache, deleteCache, customSelect, prisma, redisClient, ApiError } = require("../utils");
// ===================================================================

// GET /api/user
const getAllUser = asyncHandler(async (req, res) => {
	const users = await prisma.User.findMany({
		select: customSelect,
	});

	const totalAdmin = users.filter((item) => item.role == "ADMIN").length; //array
	const totalStudent = users.filter((item) => item.role == "STUDENT").length;
	const totalStaff = users.filter((item) => item.role == "STAFF").length;
	const totalUser = users.length;

	const data = { totalUser, totalStaff, totalStudent, totalAdmin, users };
	const finalReply = { message: "Success", data: data };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

	res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

// GET /api/user/:id
const getUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.json({ message: "userId is required" });
	}
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: customSelect,
	});
	if (user) {
		const finalReply = { message: "Success", data: user };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);
	} else {
		throw new ApiError(404, "User not found");
	}
});

// -------------------------------------------------------------------

// PUT /api/user/:id
const updateUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.json({ message: "userId is required" });
	}
	const userData = req.body;

	const uName = userData.name.split(" ");
	const firstName = uName[0];
	const lastName = uName[uName.length - 1];

	const joiningYear = new Date(userData.joinDate).getFullYear();
	const username = `${firstName}${lastName}${joiningYear}@${userData.role.toLowerCase()}.ambition.edu.np`;

	// Generalized user data update
	const userDataToUpdate = {
		username,
		name: userData.name,
		email: userData.email,
		phoneNumber: userData.phoneNumber,
		address: userData.address,
		gender: userData.gender,
		role: userData.role.toUpperCase(),
		dateOfBirth: new Date(userData.dateOfBirth),
	};

	// If a new password is provided, hash and update the password
	if (userData.password) {
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		userDataToUpdate.password = hashedPassword;
	}

	// Update the user based on the provided user ID
	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: userDataToUpdate,
		select: customSelect,
	});

	await updateCache("/api/user/", "users", updatedUser);

	// If the user's role is "STUDENT"
	if (userData.role.toUpperCase() === "STUDENT") {
		const student = await updateStudent(req, res);
		const data = { updatedUser, student };
		const finalReply = { success: true, message: "Student Updated", data: data };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		return res.status(200).json(finalReply);
	}
	// If the user's role is "STAFF"
	else if (userData.role.toUpperCase() === "STUDENT") {
		const staff = await updateStaff(req, res);
		const data = { updatedUser, staff };
		const finalReply = { success: true, message: "Staff Updated 👻", data: data };
		return res.status(200).json(finalReply);
	} else {
		const finalReply = { success: true, message: "Admin Updated 👻", data: updatedUser };
		return res.status(200).json(finalReply);
	}
});

// -------------------------------------------------------------------
// DELETE /api/user/:userId
const deleteUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	await deleteCache("/api/user/", "users", userId);

	const userToDelete = await prisma.User.findFirst({
		where: { id: userId },
	});
	const include = {}; // Initialize an empty `include` object

	if (userToDelete.role === "student") {
		include.student = true;
	} else if (userToDelete.role === "staff") {
		include.staff = true;
	}
	const user = await prisma.User.delete({
		where: { id: userId },

		include,
	});

	return res.json({ success: true, message: `Deleted user: ${user.name} `, user });
});

// -------------------------------------------------------------------

//

module.exports = { getAllUser, getUser, updateUser, deleteUser };
