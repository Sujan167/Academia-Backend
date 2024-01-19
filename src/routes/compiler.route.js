const router = require("express").Router();
const compiler = require("../controllers/codeCompile.controller");

router.route("/").post(compiler);

module.exports = router;
