const asyncHandler = require("express-async-handler");
const { prisma, customSelect } = require("../utils");
// ===================================================================

const getStudentDashboard = asyncHandler(async () => {
	const students = await prisma.User.findMany({
		where: {
			role: "STUDENT",
		},
		select: customSelect,
	});
	// const totalAdmin = await prisma.User.count();
	const totalStudents = students.length; //array
	return { totalStudents, students };
});

// ===================================================================

module.exports = { getStudentDashboard };
