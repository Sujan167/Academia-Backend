const crypto = require("crypto");
const prisma = require("./prismaClient");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION } = process.env;
// ===================================================================

// Generate an access token.
async function generateAccessToken(user) {
	// const user = await findUserById(id);
	const payload = { id: user.id, email: user.email, role: user.role, isVerified: user.isVerified, isSuspended: user.isSuspended };

	const token = await jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION });
	return { token, user };
}

// -------------------------------------------------------------------

async function findUserById(id) {
	return await prisma.user.findUnique({
		where: {
			id: id,
		},
		select: customSelect,
	});
}

// -------------------------------------------------------------------

async function generateRefreshToken(user) {
	const payload = { id: user.id };
	const refreshToken = await jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
	return refreshToken;
}

// -------------------------------------------------------------------

// Generate random 6 character code:- WjRS5MY
async function generateReferenceCode(n = 6) {
	const buffer = await crypto.randomBytes(Math.ceil((n * 3) / 4));
	const base64 = await buffer.toString("base64");
	return base64.replace(/[^a-zA-Z0-9]/g, "");
}

module.exports = { generateAccessToken, generateRefreshToken, findUserById, generateReferenceCode };
