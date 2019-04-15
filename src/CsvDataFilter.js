const CsvDataHandler = require('./CsvDataHandler');

class CsvDataFilter {
    static async execute(finalFilePath) {
        let datas = await CsvDataHandler.getCsvData(finalFilePath);
        CsvDataFilter._scanData(datas);
    }

    static _scanData(datas) {
        const result = {
            funders: [],
            installers: [],
            basins: [],
            subvillages: [],
            region: [{
                name: '',
                MoyenneLat: 0,
                MoyenneLong: 0
            }]
        };
        CsvDataFilter._getRankedProperties(datas, result, 'funder');
        CsvDataFilter._getRankedProperties(datas, result, 'installer');
        CsvDataFilter._getRankedProperties(datas, result, 'basin');
        CsvDataFilter._getRankedProperties(datas, result, 'subvillage');

        // TODO Pour longiture et lattitude, faire la moyenne des régions

        console.log(result);
        return result;
    }

    static _getRankedProperties(datas, result, propertie) {
        console.log(`Starting to rank properties : ${propertie}`);
        for (let i = 0; i < datas.length; i++) {
            let filtered = result[`${propertie}s`].filter(object => object.name === datas[i][propertie]);
            let isNameAlreadyPush = filtered.length !== 0;
            if (!isNameAlreadyPush) {
                result[`${propertie}s`].push({
                    id: null,
                    name: datas[i][propertie],
                    occurence: 1
                })
            } else {
                for (let j = 0; j < result[`${propertie}s`].length; j++) {
                    if (result[`${propertie}s`][j].name === datas[i][propertie]) {
                        result[`${propertie}s`][j].occurence = result[`${propertie}s`][j].occurence + 1;
                        break;
                    }
                }
            }
        }
        result[`${propertie}s`].sort((prev, next) => next.occurence - prev.occurence);
        let k = 1;
        result[`${propertie}s`].forEach(fpropertie => {
            if (k >= 11) {
                fpropertie.id = k;
            } else if (fpropertie.name !== '' && fpropertie.name !== '0') {
                fpropertie.id = k;
                k++;
            } else if (fpropertie.name === '' || fpropertie.name === '0') {
                fpropertie.id = 11;
            }
            delete fpropertie.occurence;
        });
        console.log(`Ranking ${propertie} done !`);
        return result;
    }
}

module.exports = CsvDataFilter;
