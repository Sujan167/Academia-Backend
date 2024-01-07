const router = require("express").Router();
const { getAllStaff, getStaff, createStaff, updateStaff, deleteStaff } = require("../controllers/staff.controller");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole.middleware");

router.route("/").get(authenticate, getAllStaff).post(createStaff);
router.route("/:userId").get(getStaff).put(updateStaff).delete(deleteStaff);

module.exports = router;
