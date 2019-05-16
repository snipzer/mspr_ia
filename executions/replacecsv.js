const CsvDataReplacer = require('../src/CsvDataReplacer');
const dataHolder = require('./dataHolder.json');

let csvToReplacePath = './data/training_set_value_and_label.csv';
let finalFileReplacedPath = './data/training_set_final.csv';

CsvDataReplacer.execute(dataHolder, csvToReplacePath, finalFileReplacedPath);

csvToReplacePath = './data/test_set_value.csv';
finalFileReplacedPath = './data/test_set_final.csv';

CsvDataReplacer.execute(dataHolder, csvToReplacePath, finalFileReplacedPath);


