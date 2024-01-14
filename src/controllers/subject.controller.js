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

		const subjectOfSemesterOfAllDepartment = await prisma.subject.findMany({
			where: { semesterRefId },
		});
		// const totalRegularSubject = subjectOfSemesterOfAllDepartment.filter((item) => item.isElective === false).length;
		// const data = { totalRegularSubject, subjectOfSemesterOfAllDepartment };
		
		const finalReply = { status: "Success", message: `All Subjects of ${semesterName} Semester`, data: subjectOfSemesterOfAllDepartment };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

		// --------------------------------------------------------------
	} else if (!semesterName && departmentName) {
		const departmentRefId = await getDepartmentId(departmentName);

		const subjectOfADepartment = await prisma.subject.findMany({
			where: { departmentRefId },
		});
		const finalReply = { status: "Success", message: `All Subjects of ${departmentName} Department`, data: subjectOfADepartment };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

		// --------------------------------------------------------------
	} else if (semesterName && departmentName) {
		// If both semesterName and departmentName are present, execute another query
		const semesterRefId = await getSemesterId(semesterName);
		const departmentRefId = await getDepartmentId(departmentName);
		// console.log(semesterRefId, departmentRefId);
		const subjectOfSemesterOfDepartment = await prisma.subject.findMany({
			where: {
				semesterRefId,
				departmentRefId,
			},
		});
		// const totalRegularSubject = subjectOfSemesssterOfDepartment.filter((item) => item.isElective === false).length;
		// const data = { totalRegularSubject, subjectOfSemesterOfDepartment };

		const finalReply = { status: "Success", message: `All Subjects of ${semesterName} Semester of ${departmentName} Department`, data: subjectOfSemesterOfDepartment };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

		res.status(200).json(finalReply);

		// --------------------------------------------------------------
	} else {
		// If neither semesterName nor departmentName are present, return all subjects
		const allSubjects = await prisma.subject.findMany({});
		const finalReply = { status: "Success", message: "All Subjects", data: allSubjects };

		await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
		res.status(200).json(finalReply);
	}
});

// =======================================================================

const getSubject = asyncHandler(async (req, res) => {
	const { semesterName } = req.query;

	if (!semesterName) {
		return res.status(404).json({ message: "semesterName and departmentName are required" });
	}

	const semesterRefId = await getSemesterId(semesterName);
	// const departmentRefId = await getDepartmentId(departmentName);
	const semData = await prisma.subject.findMany({
		where: { semesterRefId },
	});
	const data = { message: `Data of Semester: ${semesterName}👻👻👻`, semData };
	await redisClient.set(req.originalUrl, JSON.stringify(data), "EX", REDIS_TTL);
	res.status(200).json(data);
});

module.exports = { getAllSubject };
