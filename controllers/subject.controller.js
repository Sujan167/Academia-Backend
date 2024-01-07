// const { getAllSubject, getSubject, getAllSubjectsOfSemester } = require("../routes/subject.route");
const { prisma, redisClient } = require("../utils");
const asyncHandler = require("express-async-handler");
const { REDIS_TTL } = process.env;
const { getSemesterId, getDepartmentId } = require("./student.controller");

// =======================================================================

const getAllSubject = asyncHandler(async (req, res) => {
	const { semesterName, departmentName } = req.query;
	console.log(semesterName, departmentName);
	if (semesterName && !departmentName) {
		const semesterRefId = await getSemesterId(semesterName);

		const subjectOfSemesterOfAllDepartment = await prisma.subject.findMany({
			where: { semesterRefId },
		});
		console.log(`\nsubjectOfSemesterOfAllDepartment: ${JSON.stringify(subjectOfSemesterOfAllDepartment)}\n`);

		await redisClient.set(req.originalUrl, JSON.stringify(subjectOfSemesterOfAllDepartment), "EX", REDIS_TTL);

		res.status(200).json(subjectOfSemesterOfAllDepartment);

		// --------------------------------------------------------------
	} else if (!semesterName && departmentName) {
		const departmentRefId = await getDepartmentId(departmentName);

		const subjectOfADepartment = await prisma.subject.findMany({
			where: { departmentRefId },
		});
		console.log(`\nsubjectOfADepartment: ${JSON.stringify(subjectOfADepartment)}\n`);
		await redisClient.set(req.originalUrl, JSON.stringify(subjectOfADepartment), "EX", REDIS_TTL);
		res.status(200).json(subjectOfADepartment);

		// --------------------------------------------------------------
	} else if (semesterName && departmentName) {
		// If both semesterName and departmentName are present, execute another query
		const semesterRefId = await getSemesterId(semesterName);
		const departmentRefId = await getDepartmentId(departmentName);
		console.log(semesterRefId, departmentRefId);
		const subjectOfSemesterOfDepartment = await prisma.subject.findMany({
			where: {
				semesterRefId,
				departmentRefId,
			},
		});
		console.log(`\nsubjectOfSemesterOfDepartment: ${JSON.stringify(subjectOfSemesterOfDepartment)}\n`);

		await redisClient.set(req.originalUrl, JSON.stringify(subjectOfSemesterOfDepartment), "EX", REDIS_TTL);

		res.status(200).json(subjectOfSemesterOfDepartment);

		// --------------------------------------------------------------
	} else {
		// If neither semesterName nor departmentName are present, return all subjects
		const allSubjects = await prisma.subject.findMany({});
		await redisClient.set(req.originalUrl, JSON.stringify(allSubjects), "EX", REDIS_TTL);

		console.log(`\nsubjects: ${JSON.stringify(allSubjects)}\n`);
		res.status(200).json(allSubjects);
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

const getAllSubjectsOfSemester = asyncHandler(async (req, res) => {
	res.status(200).json({ message: "Get all subject of semester route" });
});
module.exports = { getAllSubject, getSubject, getAllSubjectsOfSemester };
