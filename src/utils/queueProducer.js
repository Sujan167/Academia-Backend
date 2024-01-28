// // connect to rabbitmq server
// // create new channel on that connection
// // create the exchange
// // publish the message to that exchange with a routing key

const { RABBITMQ_URL, EXCHANGE_NAME } = process.env;

const amqp = require("amqplib");

async function produceToQueue(queueName, message) {
	const connection = await amqp.connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertQueue(queueName, { durable: true });

	channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

	console.log(`Message sent to the ${queueName} queue: ${message}`);
}
module.exports = produceToQueue;
