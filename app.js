const dotenv = require("dotenv");
// Load environment variables based on the current environment
if (process.env.NODE_ENV === "development") {
	dotenv.config({ path: "./config/dev.env" });
} else if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "./config/prod.env" });
}
const limiter = require("express-rate-limit");
const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authenticate = require("./middlewares/authenticate");
const ErrorHandler = require("./errors/ErrorHandler");
const cacheMiddleware = require("./middlewares/cache.middleware");
const checkRole = require("./middlewares/checkRole.middleware");
const app = express();

// ======================================================

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
// app.use(
// 	cors({
// 		origin: process.env.CORS_ORIGIN,
// 		credentials: true,
// 	})
// );

app.use(
	limiter({
		windowMs: 5000,
		max: 4,
		message: {
			code: 429,
			message: "Ruko jara sabar karo!",
		},
	})
);

app.get("/", async (req, res, next) => {
	res.json({ message: "Awesome it works 🐻" });
});

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/subject", cacheMiddleware, require("./routes/subject.route"));

app.use(authenticate); // need credintials for all the route below

app.use("/api/student", checkRole(["ADMIN", "STAFF", "STUDENT"]), cacheMiddleware, require("./routes/student.route"));

app.use("/api/staff", checkRole(["ADMIN", "STAFF"]), cacheMiddleware, require("./routes/staff.route"));

app.use("/api/admin", checkRole(["ADMIN"]), cacheMiddleware, require("./routes/admin.route"));
app.use("/api/user", checkRole(["ADMIN"]), cacheMiddleware, require("./routes/user.route"));

app.use((req, res, next) => {
	next(createError.NotFound());
});

// ERROR HANDLER MIDDLEWARE
app.use(ErrorHandler);
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "http://localhost";

console.log(`\nNODE_ENV: ${process.env.NODE_ENV}`);
app.listen(PORT, "0.0.0.0", () => console.log(`🟢 --- @ ${HOST}:${PORT} --- 🚀`));
