const asyncHandler = require("express-async-handler");
const { prisma, customSelect } = require("../utils");
// ===================================================================

const getStaffDashboard = asyncHandler(async () => {
	const staffs = await prisma.User.findMany({
		where: {
			role: "STAFF",
		},
		select: customSelect,
	});
	// const totalStaffs = await prisma.User.count();
	const totalStaffs = staffs.length; //array
	return { totalStaffs, staffs };
});

// ===================================================================

module.exports = { getStaffDashboard };
