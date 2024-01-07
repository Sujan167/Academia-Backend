const { REDIS_HOST, REDIS_PORT } = process.env;
const Redis = require("ioredis");
const redisClient = new Redis({
	host: REDIS_HOST, // Redis server host
	port: REDIS_PORT, // Redis server port
});

redisClient.on("error", (err) => {
	console.error("Error connecting to Redis:", err);
});

// Wait for the client to connect before using it
redisClient.on("connect", () => {
	console.log(`🟢 --- @ Connected to Redis server - ${REDIS_PORT}--- 🔌`);
});

module.exports = redisClient;
