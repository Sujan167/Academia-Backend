const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = process.env;
const redisClient = new Redis({
	host: REDIS_HOST || "localhost",
	port: REDIS_PORT || "6379",
});

redisClient.on("error", (err) => {
	console.error("Error connecting to Redis:", err);
});

// Wait for the client to connect before using it
redisClient.on("connect", () => {
	console.log(`||🟢 --- @ Connected to Redis server - ${REDIS_PORT}--- `);
});

module.exports = redisClient;
