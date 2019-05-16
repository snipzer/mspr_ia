const CsvHandler = require('./handler/CsvHandler');
const CsvDataFilter = require('./CsvDataFilter');

class CsvDataReplacer {
    static async execute(dataHolder, csvToReplacePath, finalFileReplacedPath) {
        console.log(`Starting to replace data for  ${csvToReplacePath}`);
        let datas = await CsvHandler.getCsvData(csvToReplacePath);
        CsvDataReplacer._replaceData(datas, dataHolder);
        await CsvHandler.writeCsv(finalFileReplacedPath, datas);
        console.log("Done !")
    }

    static _deleteRows(datas) {
        const toDelete = ['num_private', 'population', 'recorded_by', 'amount_tsh'];
        toDelete.forEach((propertie) => {
            delete datas[propertie];
        });
    }

    static _replaceData(datas, dataHolder) {
        for(let i = 0; i < datas.length; i++) {
            console.log(`Replacing row ${i} on ${datas.length-1}`);
            for (let property in datas[i]) {
                if (datas[i].hasOwnProperty(property)) {
                    CsvDataReplacer._deleteRows(datas[i]);
                    CsvDataReplacer._handleConstructionYear(property, dataHolder, datas[i]);
                    CsvDataReplacer._handleCoordinate(property, dataHolder, datas[i]);
                    CsvDataReplacer._handleStringProperties(property, dataHolder, datas[i]);
                    CsvDataReplacer._handleBoolean(property, dataHolder, datas[i]);
                    CsvDataReplacer._handleDate(property, dataHolder, datas[i]);
                }
            }
        }
    }

    static _handleDate(property, dataHolder, data) {
        if(property === "date_recorded") {
            data[property] = new Date(data[property]).getTime();
        }
    }

    static _handleConstructionYear(property, dataHolder, data) {
        if(property === "construction_year") {
            if(data[property] === null || data[property] === "0") {
                data[property] = dataHolder[property];
            }
        }
    }

    static _handleCoordinate(property, dataHolder, data) {
        const coordinates = dataHolder["coordinates"];
        if(property === "region") {
            coordinates.forEach(coordinate => {
                if(data[property] === coordinate.name) {
                    if(data["latitude"] === "0" || data["latitude"] === "-0") {
                        data["latitude"] = coordinate.moyenne_latitude;
                    }
                    if(data["longitude"] === "0" || data["longitude"] === "-0") {
                        data["longitude"] = coordinate.moyenne_longitude;
                    }
                    if(data["height"] === "0" || data["height"] === "-0") {
                        data["height"] = coordinate.moyenne_height;
                    }
                }
            });
        }
    }

    static _handleBoolean(property, dataHolder, data) {
        const properties = CsvDataFilter.getBooleanProperty();
        const isBooleanProperty = property === properties[0] || property === properties[1];
        if(isBooleanProperty) {
            if(data[property] === 'True') {
                data[property] = 1;
            } else if (data[property] === 'False') {
                data[property] = 0;
            } else {
                data[property] = dataHolder[property].moyenne;
            }
        }
    }

    static _handleStringProperties(property, dataHolder, data) {
        const isPropertieToRank = CsvDataFilter.getPropertieToRank().filter(string => string === property).length !== 0;
        if (isPropertieToRank) {
            const dataValue = data[property];
            const dataHolderObjects = dataHolder[property+"s"];
            if(dataHolderObjects !== undefined) {
                let isHandled = false;
                dataHolderObjects.forEach(dataHolderObject => {
                    if(dataHolderObject.name === dataValue) {
                        isHandled = true;
                        data[property] = dataHolderObject.id;
                    }
                });
                if(!isHandled) {
                    data[property] = dataHolderObjects[dataHolderObjects.length - 1].id;
                }
            }
        }
    }
}

module.exports = CsvDataReplacer;