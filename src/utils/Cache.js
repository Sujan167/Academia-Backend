const redisClient = require("./redis");
const { REDIS_TTL } = process.env;

// ===================================================================

async function appendCache(cacheKey, targetKey, newData) {
	try {
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			const parsedData = JSON.parse(cachedData);
			// parsedData.data[targetKey].push(newData);

			// await redisClient.set(cacheKey, parsedData, "EX", 60);
			// return true;

			// Check if targetKey exists in parsedData.data and if it's an array
			if (parsedData.data.hasOwnProperty(targetKey) && Array.isArray(parsedData.data[targetKey])) {
				parsedData.data[targetKey].push(newData);
				await redisClient.set(cacheKey, JSON.stringify(parsedData), "EX", REDIS_TTL);
				return true;
			} else {
				console.log(`Target key "${targetKey}" does not exist or is not an array.`);
			}
		} else {
			// If data is not cached, continue to the route handler
			console.log("Data not found in cache for update🥶🥶🥶🥶🥶🥶");
		}
	} catch (error) {
		console.log(error);
	}
}

// -------------------------------------------------------------------

async function updateCache(cacheKey, targetKey, newData) {
	try {
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			const parsedData = JSON.parse(cachedData);

			if (parsedData.data.hasOwnProperty(targetKey) && Array.isArray(parsedData.data[targetKey])) {
				const targetArray = parsedData.data[targetKey];

				// Find the object with a matching 'id' property
				const index = targetArray.findIndex((item) => item.id === newData.id);

				if (index !== -1) {
					// Update the object's data if found
					console.log("index: ", index);
					targetArray[index] = newData;

					await redisClient.set(cacheKey, JSON.stringify(parsedData), "EX", REDIS_TTL);
					return true;
				} else {
					console.log(`Object with id "${newData.id}" not found in ${targetKey}`);
				}
			} else {
				console.log(`Target key "${newData.id}" does not exist or is not an array.`);
			}
		} else {
			console.log("Data not found in cache for update: " + cacheKey);
		}
	} catch (error) {
		console.log(error);
	}
}

// -------------------------------------------------------------------

async function deleteCache(cacheKey, targetKey, idToDelete) {
	try {
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			const parsedData = JSON.parse(cachedData);

			if (parsedData.data.hasOwnProperty(targetKey) && Array.isArray(parsedData.data[targetKey])) {
				const targetArray = parsedData.data[targetKey];

				// Find the index of the object with a matching 'id' property
				const index = targetArray.findIndex((item) => item.id === idToDelete);

				if (index !== -1) {
					// Remove the object if found
					targetArray.splice(index, 1);
					await redisClient.set(cacheKey, JSON.stringify(parsedData), "EX", REDIS_TTL);
					return true;
				} else {
					console.log(`Object with id "${idToDelete}" not found in ${targetKey}`);
				}
			} else {
				console.log(`Target key "${targetKey}" does not exist or is not an array.`);
			}
		} else {
			console.log("Data not found in cache for update: " + cacheKey);
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = { appendCache, updateCache, deleteCache };
