const router = require("express").Router();
const compiler = require("../service/codeCompiler.js");

router.route("/").post(compiler);

module.exports = router;
