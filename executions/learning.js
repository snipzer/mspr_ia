require('@tensorflow/tfjs-node');
const CsvHandler = require('../src/handler/CsvHandler');
const tf = require('@tensorflow/tfjs');
const csv = require('csvtojson');
const dataHolder = require('./dataHolder.json');

const pathToLeaningFile = "./data/training_set_final.csv";
const pathToTestSet = "./data/test_set_final.csv";
const pathToFinalResult = "./data/final_result.csv";

const execute = async () => {
    try {
        const datas = await csv({ output: 'csv' }).fromFile(pathToLeaningFile);
        const tests = await csv({ output: 'csv' }).fromFile(pathToTestSet);

        const labels = [];
        datas.forEach(element => {
            labels.push(convert(element.pop()));
        });

        const model = tf.sequential({
            layers: [
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu', useBias: true}),
                tf.layers.dense({units: 128, activation: 'relu', useBias: true}),
                tf.layers.dense({units: 128, activation: 'relu', useBias: true}),
                tf.layers.dense({units: 3, activation: 'softmax', batchInputShape: [null, 128]}),
            ]
        });

        const learningRate = 0.0001;
        model.compile({
            optimizer: tf.train.sgd(learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        const xs = tf.tensor2d(datas, [datas.length, datas[0].length]);
        const ys = tf.tensor2d(labels, [labels.length, labels[0].length]);

        model.fit(xs, ys, {
            epochs: 5,
            batchSize: 256,
        }).then(info => {
            console.log('Final accuracy', info.history.acc);
            const tensor = model.predict(tf.tensor2d(tests, [tests.length, tests[0].length]), {
                batchSize: 256
            });
            const results = generate(getResultFromTensor(tensor.dataSync()), tests);
            CsvHandler.writeCsv(pathToFinalResult, results);
        }).catch(err => console.log(err));
    } catch(err) {
        console.log(err);
    }

    function generate(results, tests) {
        console.log("Generating result...");
        const objectHolder = [];
        for(let i = 0; i < tests.length; i++) {
            objectHolder.push({
                id: tests[i][0],
                status_group: results[i]
            })
        }
        return objectHolder;
    }

    function convert(input) {
        switch(input) {
            case "1":
                return [0, 0, 1];
            case "2":
                return [0, 1, 0];
            case "3":
                return [1, 0, 0];
            default:
                break;
        }
        return null;
    }

    function getResultFromTensor(results) {
        const final = [];
        let intermediate = [];
        for(let i = 0; i < results.length; i++) {
            intermediate.push(results[i]);
            if(intermediate.length === 3) {
                final.push(revert(intermediate));
                intermediate = [];
            }
        }
        return final;
    }

    function revert(arrayValue) {
        const isOne = arrayValue[0] === 0 && arrayValue[1] === 0 && arrayValue[2] === 1;
        const isTwo = arrayValue[0] === 0 && arrayValue[1] === 1 && arrayValue[2] === 0;
        const isThree = arrayValue[0] === 1 && arrayValue[1] === 0 && arrayValue[2] === 0;
        const statusGroup = dataHolder.status_groups;
        if(isOne) {
            return statusGroup.filter(object => object.id === 1)[0].name;
        } else if(isTwo) {
            return statusGroup.filter(object => object.id === 2)[0].name;
        } else if (isThree) {
            return statusGroup.filter(object => object.id === 3)[0].name;
        }
    }
};

execute();