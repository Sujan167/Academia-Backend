const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Test database connection
prisma
	.$connect()
	.then(() => {
		console.log("🟢 --- @Connected to the database --- 🚀");
	})
	.catch((error) => {
		console.error("Error connecting to the database:\n", error);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
module.exports = prisma;
