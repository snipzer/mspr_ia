const CsvDataHandler = require('./CsvDataHandler');

class CsvDataFilter {
    static async execute(finalFilePath) {
        const toDelete = ['region', 'permit', 'recorded_by'];
        let datas = await CsvDataHandler.getCsvData(finalFilePath);
        CsvDataFilter._scanData(datas);
        CsvDataFilter._deleteRows(datas, toDelete);
    }

    static _deleteRows(datas, toDelete) {
        console.log(`Deleting columns : ${toDelete}`);
        toDelete.forEach((propertie) => {
            delete datas[propertie];
        });
    }

    static _scanData(datas) {
        const result = {
            funders: [],
            installers: [],
            basins: [],
            subvillages: [],
            extraction_types: [],
            extraction_type_classs: [],
            extraction_type_groups: [],
            coordinates: []
        };
        //CsvDataFilter._executeRanking(datas, result);
        // TODO Pour longiture et lattitude, faire la moyenne des régions
        CsvDataFilter._handleCoordinate(datas, result);
        // console.log(result);
        return result;
    }

    static _executeRanking(datas, result) {
        const propertieToRank = ['funder', 'installer', 'basin', 'subvillage', 'extraction_type', 'extraction_type_class', 'extraction_type_group'];
        propertieToRank.forEach((propertie) => {
            CsvDataFilter._rankProperties(datas, result, propertie);
        })
    }

    static _rankProperties(datas, result, propertie) {
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
            } else if (fpropertie.name.length > 1) {
                fpropertie.id = k;
                k++;
            } else if (fpropertie.name.length <= 1) {
                fpropertie.id = 11;
            }
            // delete fpropertie.occurence;
        });
        console.log(`Ranking ${propertie} done !`);
        return result;
    }

    static _handleCoordinate(datas, result) {
        console.log(`Handling coordinate...`);
        for (let i = 0; i < datas.length; i++) {
            let filtered = result.coordinates.filter(object => object.name === datas[i].region);
            let isNameAlreadyPush = filtered.length !== 0;
            if (!isNameAlreadyPush) {
                result.coordinates.push({
                    name: datas[i].region,
                    longitudes: [],
                    latitudes: [],
                    heights: []
                })
            } else {
                for (let j = 0; j < result.coordinates.length; j++) {
                    let isGspHeightNotZero = datas[i].gps_height !== '0' || datas[i].gps_height !== '-0';
                    let isLongitudeNotZero = datas[i].longitude !== '0' || datas[i].longitude !== '-0';
                    let isLatitudeNotZero = datas[i].latitude !== '0' || datas[i].latitude !== '-0';
                    let isValueNotZero = isGspHeightNotZero && isLongitudeNotZero && isLatitudeNotZero;
                    if (result.coordinates[j].name === datas[i].region && isValueNotZero) {
                        result.coordinates[j].longitudes.push(parseFloat(datas[i].longitude));
                        result.coordinates[j].latitudes.push(parseFloat(datas[i].latitude));
                        result.coordinates[j].heights.push(parseFloat(datas[i].gps_height));
                        break;
                    }
                }
            }
        }
        result.coordinates.forEach((object) => {
            object.moyenne_longitude = CsvDataFilter._calculateMoyenne(object.longitudes);
            object.moyenne_latitude = CsvDataFilter._calculateMoyenne(object.latitudes);
            object.moyenne_height = CsvDataFilter._calculateMoyenne(object.heights);
        });
        console.log(result.coordinates);
    }

    static _calculateMoyenne(array) {
        return array.reduce((accumulator, currentValue) => accumulator + currentValue) / array.length;
    }
}

module.exports = CsvDataFilter;
