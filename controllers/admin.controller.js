const asyncHandler = require("express-async-handler");
const { generateReferenceCode, sendEmail, prisma, customSelect } = require("../utils");
const { REDIS_TTL } = process.env;
// ===================================================================

// GET /api/admin
const getAllAdmin = asyncHandler(async (req, res) => {
	const admins = await prisma.User.findMany({
		where: {
			role: "ADMIN",
		},
		select: customSelect,
	});
	// const totalAdmin = await prisma.User.count();
	const totalAdmin = admins.length; //array

	const data = { message: "Get all admin  🚀", totalAdmin, admins };
	await redisClient.set(req.originalUrl, JSON.stringify(data), "EX", REDIS_TTL);
	return res.status(200).json(data);
});

// -------------------------------------------------------------------

// GET /api/admin/:id
const getAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.json({ message: "id is required" });
	}
	const admin = await prisma.User.findUnique({
		where: {
			id: id,
			role: "ADMIN",
		},
		select: customSelect,
	});
	const data = { message: `Get admin for id ${id} 🚀`, admin };
	await redisClient.set(req.originalUrl, JSON.stringify(data), "EX", REDIS_TTL);
	return res.status(200).json(data);
});

// -------------------------------------------------------------------

// PUT /api/admin/verify-new-registration
const verifyNewRegistration = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ message: "id is required" });
	}
	const referenceKey = await generateReferenceCode(6);

	const user = await prisma.User.update({
		where: { id },
		data: { isVerified: true, referenceKey },
		select: customSelect,
	});
	console.log(user);
	await sendEmail("Reference Key", referenceKey, user.email);
	return res.status(200).json({ message: "New User Verified", referenceKey, user });
});

// -------------------------------------------------------------------

// PUT /api/admin/suspend-user
const suspendUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ message: "id is required" });
	}
	const user = await prisma.User.update({
		where: { id },
		data: { isSuspended: true },
		select: customSelect,
	});
	await sendEmail("Suspended", "You are suspended from the system", user.email);
	return res.status(200).json({ message: "User Suspended", user });
});
// PUT /api/admin/unsuspend-user
const unSuspendUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ message: "id is required" });
	}
	const user = await prisma.User.update({
		where: { id },
		data: { isSuspended: false },
		select: customSelect,
	});
	await sendEmail("Suspension Canceled", "Welcome! Your suspension from the system is canceled.", user.email);
	return res.status(200).json({ message: "User Suspension canceled", user });
});

module.exports = { getAllAdmin, getAdmin, verifyNewRegistration, suspendUser, unSuspendUser };
