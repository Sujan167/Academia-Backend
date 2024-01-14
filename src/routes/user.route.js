// route for user
const router = require("express").Router();
const { getAllUser, getUser, updateUser, deleteUser } = require("../controllers/user.controller");

router.route("/").get(getAllUser);

router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

// router.route("/send/mail").get(mailService);

module.exports = router;
