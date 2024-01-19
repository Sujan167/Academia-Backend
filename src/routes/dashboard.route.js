const router = require("express").Router();
const { getDashboardData } = require("../controllers/dashboard.controller");


router.route("/").get(getDashboardData);
// router.route("/").get(authenticate, checkRole(["ADMIN"]), getAllSubject);

module.exports = router;
