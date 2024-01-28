require("dotenv").config();
const dotenv = require("dotenv");

// Load environment variables based on the current environment
if (process.env.NODE_ENV === "development") {
	dotenv.config({ path: "../../config/dev.env" });
} else if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "../../config/prod.env" });
}
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { generateAccessToken } = require("../utils/");

// Authentication Middleware
const authenticate = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers["authorization"] || req.query.token;
	const accessToken = authHeader && authHeader.split(" ")[1];
	const refreshToken = req.cookies.refreshToken;

	// console.log(`\n\accessToken: ${accessToken}\n\n`);

	if (!accessToken) {
		return res.status(401).send("🔴Access Denied. No token provided.❌");
	}

	try {
		const decoded = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
		req.user = decoded;
		console.log(`\nMiddleware decoded: ${JSON.stringify(decoded)}\n`);
		if (!decoded.verified) {
			return res.status(403).json({ message: "You are not verified yet | please wait until admin verify you" });
		}
		if (decoded.suspended) {
			return res.status(403).json({ message: "Access Denied. User is suspeneded" });
		}
		next();
	} catch (error) {
		if (!refreshToken) {
			return res.status(401).send("🔴Access Denied. No refresh token provided.❌");
		}

		try {
			console.log("AccessToken expired, refreshing...");
			const decoded = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

			const { token, user } = await generateAccessToken(decoded);
			req.user = user;

			const options = {
				httpOnly: true,
				sameSite: "strict",
			};

			// Set the new access token as a header and refresh the refreshToken cookie.
			res.cookie("refreshToken", refreshToken, options).header("Authorization", `Bearer ${token}`);

			next();
		} catch (error) {
			return res.status(401).json({ error: "🚫Invalid refresh token. Please reauthenticate.🧨" });
		}
	}
});

module.exports = authenticate;
