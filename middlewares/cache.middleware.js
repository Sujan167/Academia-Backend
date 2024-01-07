const { redisClient, ApiResponse } = require("../utils/");

// Define a middleware to check and manage cache
const cacheMiddleware = async (req, res, next) => {
	try {
		const cacheKey = req.originalUrl; // Use the request URL as the cache key

		// Check if data exists in Redis cache
		const cachedData = await redisClient.get(cacheKey);

		if (cachedData) {
			// If cached data exists, send it as the response
			const parsedData = JSON.parse(cachedData);
			res.status(200).json(parsedData);
			// new ApiResponse(200, parsedData);
		} else {
			// If data is not cached, continue to the route handler
			console.log("--- Data not found in cache ❗️❗️❗️---");
			next();
		}
	} catch (err) {
		console.error("🔥Error in cache middleware:❗️❗️\n", err);
		next(); // Continue to the route handler in case of an error
	}
};

module.exports = cacheMiddleware;
