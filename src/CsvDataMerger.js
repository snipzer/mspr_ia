const CsvHandler = require('./handler/CsvHandler');

class CsvDataMerger {
    static _mergeData(trainingSetValue, trainingSetLabel) {
        return new Promise((resolve, reject) => {
            console.log("Starting merging data...");
            try {
                trainingSetValue.forEach(valueObject => {
                    valueObject.status_group = trainingSetLabel.filter(labelObject => labelObject.id === valueObject.id)[0].status_group;
                    console.log(`Status group for ${valueObject.id} is ${valueObject.status_group}`);
                    if (valueObject.status_group === undefined || valueObject.status_group === null) {
                        reject(new Error(`Status group error for id ${valueObject.id} finding ${valueObject.status_group}`));
                    }
                });
                console.log("Merging data done !");
                resolve(trainingSetValue);
            } catch(err) {
                reject(err);
            }
        });
    }

    static async _writeFinalFile(finalFilePath, headers, trainingSetFinal) {
        console.log(`Writing final data to ${finalFilePath}`);
        await CsvHandler.writeCsv(finalFilePath, headers, trainingSetFinal)
    }

    static async execute(training_set_value_path, training_set_label_path, finalFilePath) {
        try {
            console.log("Starting");
            let trainingSetValue = await CsvHandler.getCsvData(training_set_value_path);
            let trainingSetLabel = await CsvHandler.getCsvData(training_set_label_path);
            let trainingSetFinal = await CsvDataMerger._mergeData(trainingSetValue, trainingSetLabel);
            await CsvDataMerger._writeFinalFile(finalFilePath, trainingSetFinal);
            console.log("Done !");
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = CsvDataMerger;