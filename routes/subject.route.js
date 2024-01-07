const router = require("express").Router();
const { getAllSubject, getSubject, getAllSubjectsOfSemester } = require("../controllers/subject.controller");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole.middleware");

// router.route("/").get(authenticate, checkRole(["ADMIN"]), getAllSubject);
router.route("/").get(getAllSubject);
router.route("/subject-of-semester").get(getAllSubjectsOfSemester);

module.exports = router;
