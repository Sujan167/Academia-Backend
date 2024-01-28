const path = require("path");
const dotenv = require("dotenv");

process.env.NODE_ENV === "production" ? dotenv.config({ path: path.join(__dirname, "./config/prod.env") }) : dotenv.config({ path: path.join(__dirname, "./config/dev.env") });

const { sendEmail } = require("./src/utils/mailService");
const express = require("express");
const amqp = require("amqplib");
const { RABBITMQ_URL, WORKER_PORT, WORKER_HOST } = process.env;

const port = 3003;
const app = express();

const queueName = "email_queue";

// RabbitMQ consumer
async function consumeQueue() {
	const connection = await amqp.connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertQueue(queueName, { durable: true });
	console.log(`||🟢 --- @ Worker WAITING FOR MESSAGE --- 🚀`);

	channel.consume(
		queueName,
		async (msg) => {
			const emailContent = JSON.parse(msg.content.toString());

			console.log(`\nEmailContent: ${JSON.stringify(emailContent)}\n`);

			// Send email
			await sendEmail(emailContent);

			// Acknowledge the message
			channel.ack(msg);
		},
		{ noAck: false }
	);
}

// Start consuming the RabbitMQ queue
consumeQueue();

console.log("===============================================================");
console.log(`|| --- NODE_ENV: ${process.env.NODE_ENV} --- ||`);
console.log("===============================================================");

app.listen(WORKER_PORT, "0.0.0.0", () => console.log(`||🟢 --- @ ${WORKER_HOST}:${WORKER_PORT} --- 🚀`));
