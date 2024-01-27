const { sendEmail } = require("../utils");
const { emailQueue } = require("../utils");

emailQueue.process(async (job, done) => {
	try {
		const { referenceKey, user } = job.data;
		// await sendEmail("Reference Key", referenceKey, user.email);
		console.log(referenceKey, user.email);
		setTimeout(() => {
			console.log("Queue consumed");
		}, 2000);

		done();
		console.log("Queue consumed...");
	} catch (error) {
		throw error;
	}
});
// emailQueue.on("completed", (job) => {
// 	console.log(`\nCompleted ${job.id}`);
// });
emailQueue.add("testQueue", { referenceKey: "ABC", user: { email: "itssujan167@gmail.com" } });
