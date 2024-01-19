const { redisClient } = require("../utils");
const { REDIS_TTL } = process.env;

const adminHandler = require("../handlers/adminHandler");
const staffHandler = require("../handlers/staffHandler");
const studentHandler = require("../handlers/studentHandler");

const getDashboardData = async (req, res) => {
	let dashboardData;
	if (req.user.role.toUpperCase() === "ADMIN") {
		dashboardData = await adminHandler.getAdminDashboard();
	} else if (req.user.role.toUpperCase() === "STAFF") {
		dashboardData = await staffHandler.getStaffDashboard();
	} else if (req.user.role.toUpperCase() === "STUDENT") {
		dashboardData = await studentHandler.getStudentDashboard();
	} else {
		return res.status(400).json({ success: false, message: "Unknown role" });
	}
	const finalReply = { success: true, data: dashboardData };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
};

module.exports = { getDashboardData };
