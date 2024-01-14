const router = require("express").Router();
const { getAllSubject } = require("../controllers/subject.controller");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole.middleware");

router.route("/").get(getAllSubject);
// router.route("/").get(authenticate, checkRole(["ADMIN"]), getAllSubject);

module.exports = router;
