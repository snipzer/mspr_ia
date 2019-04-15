const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CsvDataHandler {
    static async getCsvData(path) {
        console.log(`Getting data from ${path}`);
        return await csv().fromFile(path);
    }

    static async writeCsv(path, headers, datas) {
        console.log(`Writing final data to ${path}`);
        const csvWriter = createCsvWriter({
            path: path,
            header: headers,
        });
        await csvWriter.writeRecords(datas);
    }
}

module.exports = CsvDataHandler;