const prisma = require("../utils/prismaClient");
const asyncHandler = require("express-async-handler");
const { customSelect } = require("../utils/customSelect");
const redisClient = require("../utils/redis");
const { REDIS_TTL } = process.env;
// ===================================================================

// get departmentRefId
async function getDepartmentId(departmentName) {
	try {
		const department = await prisma.Department.findFirst({
			where: { departmentName: departmentName.toUpperCase() },
		});
		if (department) {
			return department.id;
		} else {
			throw new Error("Department not found😤");
		}
	} catch (error) {
		console.log(error);
		throw new Error("Error in DepartmentId query🥶");
	}
}

// -------------------------------------------------------------------

// get semesterRefId
async function getSemesterId(semesterName) {
	try {
		const semester = await prisma.Semester.findFirst({
			where: { semesterName: semesterName.toUpperCase() },
		});
		if (semester) {
			return semester.id;
		} else {
			throw new Error("Semester not found😤");
		}
	} catch (error) {
		console.log(error);
		throw new Error("Error in Semester query🥶");
	}
}
// -------------------------------------------------------------------

// GET /api/student
const getAllStudent = asyncHandler(async (req, res) => {
	// const { role } = req.body;
	const students = await prisma.Student.findMany({});
	const totalStudent = students.length;
	const data = { totalStudent, students };
	const finalReply = { success: true, message: `Get all students👻`, data: data };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

	res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

// GET /api/student/:id
const getStudent = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.json({ message: "userId is required" });
	}
	const student = await prisma.Student.findFirst({
		where: { studentId: userId },
		include: { user: true },
	});
	student.user.password = undefined;

	const finalReply = { success: true, message: `Get student based on ID`, data: student };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);

	res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

//GET /api/student/semester?semesterName=fifth&departmentName=csit
const getAllStudentsOfSameClass = asyncHandler(async (req, res) => {
	const { semesterName, departmentName } = req.query;
	if (!departmentName || !semesterName) {
		return res.json({ success: false, message: "All fields are required" });
	}
	const semester = await getSemesterId(semesterName);
	const department = await getDepartmentId(departmentName);

	const students = await prisma.Student.findMany({
		where: { semesterRefId: semester.id, departmentRefId: department.id },
		include: {
			user: {
				select: customSelect,
			},
		},
	});
	const totalStudent = students.filter((student) => student.length);
	// const totalStudent = await prisma.Student.count({
	// where: { semesterRefId: semester.id, departmentRefId: department.id },
	// });
	const data = { totalStudent, students };
	const finalReply = { success: true, message: `All Student of ${semesterName} Semester of ${departmentName} Department`, data: data };

	await redisClient.set(req.originalUrl, JSON.stringify(finalReply), "EX", REDIS_TTL);
	res.status(200).json(finalReply);
});

// -------------------------------------------------------------------

const createStudent = asyncHandler(async (req, res) => {
	const { userId, departmentName, semesterName, batch, symbolNumber = null, registrationNumber = null } = req.body;
	if (!userId || !departmentName || !semesterName || !batch) {
		return res.json({ message: "All fields are required" });
	}

	const department = await getDepartmentId(departmentName);
	const semester = await getSemesterId(semesterName);
	console.log(req.body);
	const data = {
		studentId: userId,
		semesterRefId: semester,
		registrationNumber,
		symbolNumber,
		batch: Number(batch),
		departmentRefId: department,
	};
	console.log(data);
	try {
		const student = await prisma.Student.create({
			data: {
				studentId: userId,
				semesterRefId: semester,
				registrationNumber,
				symbolNumber,
				batch: Number(batch),
				departmentRefId: department,
			},
		});
		return student;
	} catch (error) {
		console.error(error);
		throw new Error("Student creation failed🙄");
	}
});

// -------------------------------------------------------------------
// PUT /api/student/:userId
const updateStudent = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const { departmentName, semesterName, symbolNumber = null, registrationNumber = null } = req.body;
	// handeling department
	if (!userId || !departmentName || !semesterName) {
		return res.json({ message: "All fields are required" });
	}
	const department = await getDepartmentId(departmentName);
	// handeling semester
	const semester = await getSemesterId(semesterName);

	try {
		const _updateStudent = await prisma.Student.update({
			where: { studentId: userId },
			data: {
				symbolNumber,
				registrationNumber,
				semesterRefId: semester.id,
				departmentRefId: department.id,
			},
		});
		return res.status(200).json({ message: `update user :${userId} 🚀`, _updateStudent });
	} catch (error) {
		console.error(error);
		throw new Error("Student update failed😡");
	}
});

// -------------------------------------------------------------------

module.exports = { getAllStudent, getStudent, getAllStudentsOfSameClass, createStudent, updateStudent, getDepartmentId, getSemesterId };
