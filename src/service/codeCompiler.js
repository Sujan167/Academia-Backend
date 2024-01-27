const { c, python, cpp, java, node } = require("compile-run");

const compileCode = async (req,res) => {
  try {
    console.log("inside controller")
    const { lang, code, input } = req.body;
    console.log(lang,code,input)
    var resultPromise;

    if (lang === "python") {
      resultPromise = python.runSource(code, { stdin: input });
    } else if (lang === "cpp") {
      resultPromise = cpp.runSource(code, { stdin: input });
    } else if (lang === "c") {
      resultPromise = c.runSource(code, { stdin: input });
    } else if (lang === "java") {
      resultPromise = java.runSource(code, { stdin: input });
    } else if (lang === "javascript") {
      resultPromise = node.runSource(code, { stdin: input });
    }
    resultPromise
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        return res.send(err);
      });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = compileCode;
