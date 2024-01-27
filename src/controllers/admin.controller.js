const asyncHandler = require("express-async-handler");
const { generateReferenceCode, sendEmail, prisma, customSelect, emailQueue } = require("../utils");
const { SUPER_USER_EMAIL, REDIS_TTL } = process.env;

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
	const data = { totalAdmin, admins };
	const finalReply = { status: "Succcess", message: "Get all admin  🚀", data: data };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	return res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

// GET /api/admin/:id
const getAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.json({ success: false, message: "id is required" });
	}
	const admin = await prisma.User.findUnique({
		where: {
			id: id,
			role: "ADMIN",
		},
		select: customSelect,
	});
	const finalReply = { success: true, message: `Get admin for id ${id} 🚀`, data: admin };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	return res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

// PUT /api/admin/verify-new-registration
const verifyNewRegistration = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ success: false, message: "id is required" });
	}
	const referenceKey = await generateReferenceCode(6);

	const user = await prisma.User.update({
		where: { id },
		data: { isVerified: true, referenceKey },
		select: customSelect,
	});
	console.log(user);
	const data = { referenceKey, user };
	const finalReply = { success: true, message: "New User Verified", data: data };
	// await sendEmail("Reference Key", referenceKey, user.email);
	console.log(referenceKey);
	emailQueue.add("emailQueue", data).then(() => {
		return res.status(200).json(finalReply);
	});
});

// -------------------------------------------------------------------

// PUT /api/admin/suspend-user
const suspendUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ success: false, message: "id is required" });
	}
	const _user = await prisma.User.findUnique({
		where: { id },
	});
	if (_user.email === SUPER_USER_EMAIL) {
		return res.json({ success: false, message: "Super User can't be suspended" });
	}
	const user = await prisma.User.update({
		where: { id },
		data: { isSuspended: true },
		select: customSelect,
	});
	await sendEmail("Suspended", "You are suspended from the system", user.email);
	return res.status(200).json({ success: true, message: "User Suspended", data: user });
});
// PUT /api/admin/unsuspend-user
const unSuspendUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.json({ success: false, message: "id is required" });
	}
	const _user = await prisma.User.findFirst({
		where: { id },
	});
	if (_user.isSuspended === false) {
		return res.json({ success: false, message: "User is not suspended." });
	}
	const user = await prisma.User.update({
		where: { id },
		data: { isSuspended: false },
		select: customSelect,
	});
	await sendEmail("Suspension Canceled", "Welcome! Your suspension from the system is canceled.", user.email);
	return res.status(200).json({ success: true, message: "User Suspension canceled", data: user });
});

module.exports = { getAllAdmin, getAdmin, verifyNewRegistration, suspendUser, unSuspendUser };
