
const express = require('express');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dirCodes = path.join(__dirname, "codes");
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// C++ Code Execution Function
const executeCpp = (code) => {
    const jobId = uuid();
    const cppFilePath = path.join(dirCodes, `${jobId}.cpp`);
    const outPath = path.join(outputPath, `${jobId}.out`);

    

    fs.writeFileSync(cppFilePath, code); // Write the code to a .cpp file

    console.log(`Compiling code using g++: ${cppFilePath} -> ${outPath}`);

    return new Promise((resolve, reject) => {
        const compileCommand = `g++ "${cppFilePath}" -o "${outPath}"`;
        console.log(`Executing compile command: ${compileCommand}`);

        exec(compileCommand,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Compilation Error: ${error}`);
                    console.error(`Stderr: ${stderr}`);
                    reject({ error, stderr });
                } else {
                    console.log(`Compilation successful. Executing ${jobId}.out`);
                    const executionCommand = `"${outPath}"`;
                    console.log(`Executing: ${executionCommand}`);

                    exec(executionCommand, (execError, execStdout, execStderr) => {
                        if (execError) {
                            console.error(`Execution Error: ${execError}`);
                            console.error(`Stderr: ${execStderr}`);
                            reject({ error: execError, stderr: execStderr });
                        } else {
                            console.log(`Execution successful.`);
                            resolve({ output: execStdout }); // Returning output inside 'output' field
                        }
                    });
                }
            }
        );
    });
};
const executeJavaScript = (code) => {
    console.log("Executing JavaScript code:", code); // Debugging output
    return new Promise((resolve, reject) => {
      exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing JavaScript:", error);
          console.error("JavaScript Standard Error:", stderr);
          reject({ error, stderr });
        } else {
          const output = stdout.trim();
          console.log("JavaScript Execution Output:", output);
          resolve(output);
        }
      });
    });
  };

 
const executePy = (code) => {
    return new Promise((resolve, reject) => {
        exec(
            `"C:\\Program Files\\Python311\\python.exe" -c "${code.replace(/"/g, '\\"')}"`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                } else {
                    resolve(stdout);
                }
            }
        );
    });
};


const executeJava = async (className, code) => {
    try {
        const codePath = path.join(dirCodes, `${className}.java`);
        const classPath = dirCodes;

        console.log("Java code to be executed:", code);
        fs.writeFileSync(codePath, code);

        await new Promise((resolve, reject) => {
            exec(`javac --release 17 -d ${classPath} ${codePath}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error("Error during Java code compilation:", error);
                        console.error("Java Standard Error:", stderr);
                        reject({ error, stderr });
                    } else {
                        console.log("Java code compilation successful.");
                        resolve();
                    }
                }
            );
        });

        return new Promise((resolve, reject) => {
            exec(`java -cp ${classPath} ${className}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error("Error during Java code execution:", error);
                        console.error("Java Standard Error:", stderr);
                        reject({ error, stderr });
                    } else {
                        console.log("Java code execution successful.");
                        console.log("Java Standard Output:", stdout);
                        resolve(stdout);
                    }
                }
            );
        });
    } catch (error) {
        console.error("Error in executeJava:", error);
        throw error;
    }
};














module.exports = {
    executeJavaScript,
    executeCpp,
    executeJava,
    executePy
};





