const prisma = require("../utils/prismaClient");
const asyncHandler = require("express-async-handler");
const redisClient = require("../utils/redis");
const { customSelect } = require("../utils/customSelect");
const { REDIS_TTL } = process.env;
// ===================================================================

// GET /api/staff
const getAllStaff = asyncHandler(async (req, res) => {
	const staffs = await prisma.Staff.findMany({
		include: {
			user: {
				select: customSelect,
			},
		},
	});
	const totalStaff = staffs.filter((staff) => staff.length);
	const data = { totalStaff, staffs };
	const finalReply = { success: true, message: "Get All Staff", data: data };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	return res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

// GET /api/staff/:id
const getStaff = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.json({ message: "userId is required" });
	}
	const staff = await prisma.Staff.findFirst({
		where: { staffId: userId },
		include: { user: true },
	});
	staff.user.password = undefined;
	const data = { message: "Get a staff route 🚀", staff };
	const finalReply = { success: true, message: "Get Staff based on ID", data: data };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

const createStaff = asyncHandler(async (req, res) => {
	const { userId } = req.body;
	if (!userId) {
		return res.json({ status:"Failed", message: "All fields are required" });
	}
	try {
		const staff = await prisma.Staff.create({
			data: {
				staffId: userId,
			},
		});
		return staff;
	} catch (error) {
		console.error(error);
		throw new Error("Staff creation failed");
	}
});

// -------------------------------------------------------------------

// PUT /api/staff/:id
const updateStaff = asyncHandler(async (req, res) => {
	res.send({ message: "update staff route 🚀" });
});
// DELETE /api/staff/:id
const deleteStaff = asyncHandler(async (req, res) => {
	res.send({ message: "delete staff route 🚀" });
});

module.exports = { getAllStaff, getStaff, createStaff, updateStaff, deleteStaff };
