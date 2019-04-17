const CsvDataHandler = require('./CsvDataHandler');

class CsvDataFilter {
    static async execute(finalFilePath) {
        let datas = await CsvDataHandler.getCsvData(finalFilePath);
        const result = CsvDataFilter._scanData(datas);
        // TODO remplacer les données
        CsvDataFilter._deleteRows(datas);
    }

    static _deleteRows(datas) {
        const toDelete = ['num_private', 'population'];
        console.log(`Deleting columns : ${toDelete}`);
        toDelete.forEach((propertie) => {
            delete datas[propertie];
        });
    }

    static _scanData(datas) {
        const result = {
            funders: [],
            installers: [],
            wpt_names: [],
            basins: [],
            subvillages: [],
            regions: [],
            lgas: [],
            wards: [],
            scheme_managements: [],
            scheme_names: [],
            extraction_types: [],
            extraction_type_classs: [],
            extraction_type_groups: [],
            managements: [],
            management_groups: [],
            payments: [],
            payment_types: [],
            water_qualitys: [],
            quality_groups: [],
            quantitys: [],
            quantity_groups: [],
            sources: [],
            source_types: [],
            source_classs: [],
            waterpoint_types: [],
            waterpoint_type_groups: [],
            status_groups: [],
            public_meeting: {
                occurence_true: 0,
                total_occurence: 0,
                moyenne: 0,
            },
            permit: {
                occurence_true: 0,
                total_occurence: 0,
                moyenne: 0,
            },
            construction_year: null,
            coordinates: []
        };
        CsvDataFilter._executeRanking(datas, result);
        CsvDataFilter._handleCoordinate(datas, result);
        CsvDataFilter._handleBool(datas, result);
        CsvDataFilter._getMinimumConstructionDate(datas, result);
        console.log(result);
        return result;
    }

    static _executeRanking(datas, result) {
        const propertieToRank = [
            'funder', 'installer', 'wpt_name', 'basin', 'subvillage',
            'region', 'lga', 'ward', 'scheme_management',
            'scheme_name', 'extraction_type', 'extraction_type_class', 'extraction_type_group',
            'management', 'management_group', 'payment', 'payment_type',
            'water_quality', 'quality_group', 'quantity', 'quantity_group',
            'source', 'source_type', 'source_class', 'waterpoint_type', 'waterpoint_type_group', 'status_group'
        ];
        propertieToRank.forEach((propertie) => {
            CsvDataFilter._rankProperties(datas, result, propertie);
        })
    }

    static _rankProperties(datas, result, propertie) {
        const startTime = new Date();
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
        console.log(`Sorting propertie : ${propertie}`);
        result[`${propertie}s`].sort((prev, next) => next.occurence - prev.occurence);
        console.log(`Assigning id to propertie : ${propertie}`);
        let totalOccurence = 0;
        result[`${propertie}s`].forEach((object) => {
            if(object.name.length > 1) {
                totalOccurence += parseInt(object.occurence);
            }
        });
        const heightPercentOfTotalOccurence = 0.80 * totalOccurence;
        let currentTotalOccurence = 0;
        let k = 1;
        result[`${propertie}s`].forEach(fpropertie => {
            if(result[`${propertie}s`].length >= 20 ) {
                if(fpropertie.name.length > 1) {
                    currentTotalOccurence += fpropertie.occurence;
                    if(currentTotalOccurence <= heightPercentOfTotalOccurence) {
                        fpropertie.id = k;
                        k += 1;
                    } else {
                        fpropertie.id = result[`${propertie}s`].length;
                    }
                } else {
                    fpropertie.id = result[`${propertie}s`].length;
                }
            } else {
                if (k >= 21) {
                    fpropertie.id = k;
                } else if (fpropertie.name.length > 1) {
                    fpropertie.id = k;
                    k++;
                } else if (fpropertie.name.length <= 1) {
                    fpropertie.id = 21;
                }
            }
        });
        console.log(`Ranking ${propertie} done ! duration: ${(new Date() - startTime) / 1000} s`);
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
    }

    static _calculateMoyenne(array) {
        return array.reduce((accumulator, currentValue) => accumulator + currentValue) / array.length;
    }

    static _handleBool(datas, result) {
        const properties = ['public_meeting', 'permit'];
        datas.forEach((data) => {
            properties.forEach((propertie) => {
                if(data[propertie] !== '') {
                    result[propertie].total_occurence += 1;
                    if(data[propertie] === 'True') {
                        result[propertie].occurence_true += 1;
                    }
                }
            });
        });
        properties.forEach((propertie) => {
            result[propertie].moyenne = result[propertie].occurence_true / result[propertie].total_occurence;
        })
    }

    static _getMinimumConstructionDate(datas, result) {
        datas.forEach(data => {
            if (result.construction_year === null && data.construction_year !== '0') {
                result.construction_year = parseInt(data.construction_year);
            } else if (result.construction_year > parseInt(data.construction_year) && data.construction_year !== '0') {
                result.construction_year = parseInt(data.construction_year);
            }
        })
    }
}

module.exports = CsvDataFilter;
