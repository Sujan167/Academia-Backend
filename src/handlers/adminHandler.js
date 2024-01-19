const asyncHandler = require("express-async-handler");
const { prisma, customSelect } = require("../utils");
// ===================================================================

const getAdminDashboard = asyncHandler(async () => {
	const admins = await prisma.User.findMany({
		where: {
			role: "ADMIN",
		},
		select: customSelect,
	});
	// const totalAdmin = await prisma.User.count();
	const totalAdmin = admins.length; //array
	return { totalAdmin, admins };
});

// ===================================================================


module.exports = { getAdminDashboard };
