const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CsvHandler {
    static async getCsvData(path) {
        console.log(`Getting data from ${path}`);
        return await csv().fromFile(path);
    }

    static async writeCsv(path, datas) {
        console.log(`Writing final data to ${path}`);
        const csvWriter = createCsvWriter({
            path: path,
            header: CsvHandler._getHeaders(datas),
        });
        await csvWriter.writeRecords(datas);
    }

    static _getHeaders(datas) {
        console.log("Getting headers...");
        let headers = Object.keys(datas[0]);
        for(let i = 0; i < headers.length; i++) {
            headers[i] = {
                id: headers[i],
                title: headers[i]
            }
        }
        console.log("Getting headers done !");
        return headers;
    }
}

module.exports = CsvHandler;