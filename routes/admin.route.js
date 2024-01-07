const router = require("express").Router();
const { getAllAdmin, getAdmin, verifyNewRegistration, suspendUser, unSuspendUser } = require("../controllers/admin.controller");

router.route("/").get(getAllAdmin);
router.route("/:id").get(getAdmin);
router.route("/verify-new-registration").patch(verifyNewRegistration);
router.route("/suspend-user").patch(suspendUser);
router.route("/unsuspend-user").patch(unSuspendUser);

module.exports = router;
