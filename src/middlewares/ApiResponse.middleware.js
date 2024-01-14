const { redisClient } = require("../utils");
const asyncHandler = require("express-async-handler");
const { REDIS_TTL } = process.env;

const ApiResponse = asyncHandler(async (req, res, next) => {
	res.sendResponse = async (success, statusCode = 200, message, data) => {
		const responseData = {
			success,
			statusCode,
			message,
			data,
		};
		
		await redisClient.set(req.originalUrl, JSON.stringify(responseData), "EX", REDIS_TTL);

		res.json(responseData);
	};
	next();
});

module.exports = ApiResponse;
