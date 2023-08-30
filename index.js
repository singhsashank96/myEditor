const express = require('express');
const { generateFile } = require('./generateFile');
const { executeCpp, executeJavaScript, executeJava , executePy} = require('./executeCpp'); // Import the executeJava function
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require('cors');
const { default: mongoose } = require('mongoose');

app.get('/', (req, res) => {
    return res.send({ hello: "world" });
});

const corsOptions = {
    origin: 'http://localhost:3000',  
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions)); // Set up CORS middleware



app.post('/run', async (req, res) => {
    const { language, code, className, input } = req.body;

    if (!language || !code) {
        return res.status(400).json({ success: false, error: "Invalid input" });
    }

    try {
        if (language === "cpp" || language === "js") {
            const output = language === "cpp" ? await executeCpp(code) : await executeJavaScript(code);
            return res.send({ output });
        } else if (language === "java") {
            const filepath = await generateFile("java", code);

            executeJava(className, code)
                .then(output => {
                    res.send({ filepath, output });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ success: false, error: "Internal Server Error" });
                });
        } else if (language === "python") {
            const output = await executePy(code)
            return res.send({ output });
        } else {
            return res.status(400).json({ success: false, error: "Unsupported language" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});




app.listen(5000, () => {
     console.log('Server is running on port 5000');
});
