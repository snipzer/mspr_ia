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
            labels.push(convert(element.pop()));
        });

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

        const model = tf.sequential({
            layers: [
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu'}),
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu'}),
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu'}),
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu'}),
                tf.layers.dense({inputShape: [datas[0].length], units: 36, activation: 'relu'}),
                tf.layers.dense({units: 3, activation: 'softmax', batchInputShape: [null,36]}),
            ]
        });

        model.compile({
            optimizer: 'sgd',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        function onBatchEnd(batch, logs) {
            console.log('Accuracy', logs.acc);
        }

        const xs = tf.tensor2d(datas, [datas.length, datas[0].length]);
        const ys = tf.tensor2d(labels, [labels.length, labels[0].length]);

        console.log(xs.print());
        console.log(ys.print());

        model.fit(xs, ys, {
            epochs: 1,
            batchSize: datas[0].length,
            callbacks: {onBatchEnd}
        }).then(info => {
            console.log('Final accuracy', info.history.acc);
            const prediction = model.predict(tf.tensor2d(tests, [tests.length, tests[0].length]), {
                batchSize: datas[0].length
            });
            prediction.print();
            const results = prediction.dataSync();
            // console.log(results.length);
            // console.log(tests.length)
            // results.forEach(result => {
            //     console.log(result)
            // });
        }).catch(err => console.log(err));
    } catch(err) {
        console.log(err);
    }
};

execute();