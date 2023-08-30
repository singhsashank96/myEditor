const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
    try {
        if (!format || !content) {
            throw new Error("Missing format or content");
        }

        const jobId = uuid();
        const filename = `${jobId}.${format}`;
        const filepath = path.join(dirCodes, filename);

        await fs.promises.writeFile(filepath, content); // Use fs.promises.writeFile for async writing

        return filepath;
    } catch (error) {
        console.error("Error generating file:", error);
        throw error; // Re-throw the error to be caught in the calling code
    }
};

module.exports = {
    generateFile,
};


