const router = require("express").Router();
const { getAllStudent, getStudent, updateStudent, deleteStudent, getAllStudentsOfSameClass } = require("../controllers/student.controller");

router.route("/").get(getAllStudent);
router.route("/semester").get(getAllStudentsOfSameClass);
router.route("/:userId").get(getStudent).put(updateStudent);

module.exports = router;
