const path = require("path");
const dotenv = require("dotenv");

process.env.NODE_ENV === "production" ? dotenv.config({ path: path.join(__dirname, "./config/prod.env") }) : dotenv.config({ path: path.join(__dirname, "./config/dev.env") });

const compression = require("compression");

const limiter = require("express-rate-limit");
const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authenticate = require("./src/middlewares/authenticate");
const ErrorHandler = require("./src/errors/ErrorHandler");
const cacheMiddleware = require("./src/middlewares/cache.middleware");
const checkRole = require("./src/middlewares/checkRole.middleware");

const axios = require("axios");
// const Producer = require("./src/utils/queueProducer");

const app = express();
// const producer = new Producer();
// ======================================================

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
app.use(compression());

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
			message: "Please Wait! We are scaling.",
		},
	})
);

app.get("/", async (req, res, next) => {
	res.json({ message: "Awesome it works 🐻" });
});

app.use("/api/v1/auth", require("./src/routes/auth.route"));

// ----------------------------------------------------------------
// This requrest will be handled by another service -> GoLang

// app.use("/api/v1/compile", require("./src/routes/compiler.route"));
app.use("/api/v1/compile", async (req, res) => {
	// await producer.publishMessage("codeCompile", req.body);
	res.json({ status: true, message: "Item is queued" });
});

// ----------------------------------------------------------------

app.use("/api/v1/user", cacheMiddleware, require("./src/routes/user.route"));

app.use("/api/v1/subject", cacheMiddleware, require("./src/routes/subject.route"));
app.use(authenticate); // need credintials for all the route below

// -----------------------------------------------------------------------------
app.use("/api/v1/dashboard", cacheMiddleware, require("./src/routes/dashboard.route"));
app.use("/api/v1/notification", cacheMiddleware, require("./src/routes/dashboard.route"));
app.use("/api/v1/dashboard", cacheMiddleware, require("./src/routes/dashboard.route"));
// -----------------------------------------------------------------------------

app.use("/api/v1/student", checkRole(["ADMIN", "STAFF", "STUDENT"]), cacheMiddleware, require("./src/routes/student.route"));

app.use("/api/v1/staff", checkRole(["ADMIN", "STAFF"]), cacheMiddleware, require("./src/routes/staff.route"));

app.use("/api/v1/admin", checkRole(["ADMIN"]), cacheMiddleware, require("./src/routes/admin.route"));
// app.use("/api/v1/user", checkRole(["ADMIN"]), cacheMiddleware, require("./src/routes/user.route"));

app.use((req, res, next) => {
	next(createError.NotFound());
});

// ======================================================

// ERROR HANDLER MIDDLEWARE
app.use(ErrorHandler);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "http://localhost";

console.log("===============================================================");
console.log(`|| --- NODE_ENV: ${process.env.NODE_ENV} --- ||`);
console.log("===============================================================");

app.listen(PORT, "0.0.0.0", () => console.log(`||🟢 --- @ ${HOST}:${PORT} --- 🚀`));
