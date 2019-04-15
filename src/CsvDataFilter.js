const CsvDataHandler = require('./CsvDataHandler');

class CsvDataFilter {
    static async execute(finalFilePath) {
        let datas = await CsvDataHandler.getCsvData(finalFilePath);
        CsvDataFilter._scanData(datas);
    }

    static _scanData(datas) {
        datas.forEach(data => {

        });
    }
}

module.exports = CsvDataFilter;
