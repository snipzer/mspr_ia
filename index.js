const CsvDataMerger = require('./src/CsvDataMerger');

const training_set_value_path = './data/training_set_value.csv';
const training_set_label_path = './data/training_set_label.csv';
const finalFilePath = './data/final_value.csv';

CsvDataMerger.execute(training_set_value_path, training_set_label_path, finalFilePath)
    .then()
    .catch(error => console.log(error));