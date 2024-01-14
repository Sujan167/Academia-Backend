// const { getAllSubject, getSubject, getAllSubjectsOfSemester } = require("../routes/subject.route");
const { prisma, redisClient } = require("../utils");
const asyncHandler = require("express-async-handler");
const { REDIS_TTL } = process.env;
const { getSemesterId, getDepartmentId } = require("./student.controller");
// =======================================================================

const getAllSubject = asyncHandler(async (req, res) => {
	const { semesterName, departmentName } = req.query;
	// console.log(semesterName, departmentName);
	if (semesterName && !departmentName) {
		const semesterRefId = await getSemesterId(semesterName);

		const subject = await prisma.subject.findMany({
			where: { semesterRefId },
		});
		const totalRegularSubject = subject.filter((item) => item.isElective === false).length;
		const data = { totalRegularSubject, subject };

		const finalReply = { success: true, data: data };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

		// --------------------------------------------------------------
	} else if (!semesterName && departmentName) {
		const departmentRefId = await getDepartmentId(departmentName);

		const subjectOfADepartment = await prisma.subject.findMany({
			where: { departmentRefId },
		});
		const finalReply = { success: true, data: subjectOfADepartment };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

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
		const data = { totalRegularSubject, subjects };

		const finalReply = { success: true, data: data };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

		// --------------------------------------------------------------
	} else {
		// If neither semesterName nor departmentName are present, return all subjects
		const allSubjects = await prisma.subject.findMany({});
		const finalReply = { success: true, data: allSubjects };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
		res.status(200).json(finalReply);
	}
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
	const finalReply = { success: true, data:semData };
	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
});

module.exports = { getAllSubject };
