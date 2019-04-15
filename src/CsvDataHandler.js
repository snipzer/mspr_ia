const csv = require('csvtojson');

class CsvDataHandler {
    static async getCsvData(path) {
        console.log(`Getting data from ${path}`);
        return await csv().fromFile(path);
    }
}

module.exports = CsvDataHandler;