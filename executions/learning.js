const csv = require('csvtojson');

const pathToLeaningFile = "./data/training_set_final.csv";

const execute = async () => {
    const LearningData = await csv({ output: 'csv' }).fromFile(pathToLeaningFile);
    console.log(LearningData[0]);
};

execute();