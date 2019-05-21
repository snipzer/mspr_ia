require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const csv = require('csvtojson');

const pathToLeaningFile = "./data/training_set_final.csv";
const pathToTestSet = "./data/test_set_final.csv";

const execute = async () => {
    try {
        const datas = await csv({ output: 'csv' }).fromFile(pathToLeaningFile);
        const tests = await csv({ output: 'csv' }).fromFile(pathToTestSet);

        const labels = [];
        datas.forEach(element => {
            labels.push([].push(element.pop()));
        });

        const model = tf.sequential({
            layers: [
                tf.layers.dense({batchInputShape: [,datas[0].length], units: 1, activation: 'relu'})
            ]
        });


        model.compile({
            optimizer: 'sgd',
            loss: 'meanSquaredError',
            metrics: ['accuracy']
        });

        function onBatchEnd(batch, logs) {
            console.log('Accuracy', logs.acc);
        }

        const xs = tf.tensor2d(datas, [datas.length, datas[0].length]);
        const ys = tf.tensor1d(labels);

        model.fit(xs, ys, {
            epochs: 5,
            batchSize: datas.length,
            callbacks: {onBatchEnd}
        }).then(info => {
            // console.log('Final accuracy', info.history.acc);
            model.predict(tf.tensor(tests, [tests.length, tests[0].length]), {
                batchSize: tests.length
            }).print();
        }).catch(err => console.log(err));
    } catch(err) {
        console.log(err);
    }
};

execute();