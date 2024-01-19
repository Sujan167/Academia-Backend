const expressAsyncHandler = require("express-async-handler");
const compileCode = require("../service/codeCompiler");

const compiler = expressAsyncHandler(async (req, res) => {
	const { code, language } = req.body;

	const result = await compileCode(code, language);
	return res.json({ result });
});

module.exports = compiler;
