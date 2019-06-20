const CsvDataFilter = require('../src/CsvDataFilter');

const finalFilePath = './data/training_set_value_and_label.csv';
const jsonFilePath = './executions/dataHolder.json';

CsvDataFilter.execute(finalFilePath, jsonFilePath);