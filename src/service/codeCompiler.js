const util = require("util");
const execAsync = util.promisify(require("child_process").exec);

const compileCode = async (code, language) => {
	try {
		switch (language.toLowerCase()) {
			case "javascript":
				const { stdout, stderr } = await execAsync(`node -e "${code}"`);
				return stderr || stdout;

			case "python":
				const { stdout: pythonStdout, stderr: pythonStderr } = await execAsync(`python3 -c "${code}"`);
				return pythonStderr || pythonStdout;

			case "c":
				const { stderr: compileError } = await execAsync(`gcc -o compiledCode -x c -`, { input: code });
				if (compileError) return compileError;

				const { stdout: runStdout, stderr: runStderr } = await execAsync(`./compiledCode`);
				return runStderr || runStdout;

			default:
				return "Unsupported language";
		}
	} catch (error) {
		throw new Error(error.stderr || error.stdout || error.message);
	}
};

module.exports = compileCode;
