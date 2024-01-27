const { prisma, redisClient } = require("../utils");
const asyncHandler = require("express-async-handler");
const { REDIS_TTL } = process.env;
const { getSemesterId, getDepartmentId } = require("./student.controller");
// =======================================================================
const ITEMS_PER_PAGE = 10;

const getAllSubject = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const skip = (page - 1) * ITEMS_PER_PAGE;
	const { semesterName, departmentName } = req.query;
	// console.log(semesterName, departmentName);
	if (semesterName && !departmentName) {
		const semesterRefId = await getSemesterId(semesterName);

		const subject = await prisma.subject.findMany({
			where: { semesterRefId },
		});
		const totalRegularSubject = subject.filter((item) => item.isElective === false).length;
		var data = { totalRegularSubject, subject };

		// --------------------------------------------------------------
	} else if (!semesterName && departmentName) {
		const departmentRefId = await getDepartmentId(departmentName);

		var data = await prisma.subject.findMany({
			where: { departmentRefId },
		});

		// --------------------------------------------------------------
	} else if (semesterName && departmentName) {
		// If both semesterName and departmentName are present, execute another query
		const semesterRefId = await getSemesterId(semesterName);
		const departmentRefId = await getDepartmentId(departmentName);

		const subjects = await prisma.subject.findMany({
			where: {
				semesterRefId,
				departmentRefId,
			},
		});
		const totalRegularSubject = subjects.filter((item) => item.isElective === false).length;
		var data = { totalRegularSubject, subjects };

		// --------------------------------------------------------------
	} else {
		// If neither semesterName nor departmentName are present, return all subjects
		var data = await prisma.subject.findMany({
			take: ITEMS_PER_PAGE,
			skip,
		});
	}
	const finalReply = { success: true, data: data };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
});

// =======================================================================

const getSubject = asyncHandler(async (req, res) => {
	const { semesterName } = req.query;

	if (!semesterName) {
		return res.status(404).json({ status: "semesterName and departmentName are required" });
	}

	const semesterRefId = await getSemesterId(semesterName);
	// const departmentRefId = await getDepartmentId(departmentName);
	const semData = await prisma.subject.findMany({
		where: { semesterRefId },
	});
	const finalReply = { success: true, data: semData };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
});

module.exports = { getAllSubject };
