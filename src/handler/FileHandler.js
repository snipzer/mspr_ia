const fs = require('fs');

class FileHandler {
    static async writeFile(path, jsonString) {
        console.log(`Writing final data to ${path}`);
        fs.writeFileSync(path, jsonString)
    }
}

module.exports = FileHandler;