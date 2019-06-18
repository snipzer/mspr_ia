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

        // const model = tf.sequential({
        //     layers: [
        //         tf.layers.dense({inputShape: [datas[0].length], units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'relu'}),
        //         tf.layers.dense({units: 1, activation: 'softmax'}),
        //     ]
        // });

        const input = tf.input({shape: [datas[0].length]});
        const dense1 = tf.layers.dense({units: 1, activation: 'relu'}).apply(input);
        const dense2 = tf.layers.dense({units: 1, activation: 'softmax'}).apply(dense1);
        const model = tf.model({inputs: input, outputs: dense2});

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

        console.log(xs.print())
        console.log(ys.print())

        model.fit(xs, ys, {
            epochs: 2,
            batchSize: 1000,
            callbacks: {onBatchEnd}
        }).then(info => {
            // console.log('Final accuracy', info.history.acc);
            const prediction = model.predict(tf.tensor2d(tests, [tests.length, tests[0].length]), {
                batchSize: 1000
            });
            prediction.print();
            const results = prediction.dataSync();
            results.forEach(result => {
                console.log(result)
            });
        }).catch(err => console.log(err));
    } catch(err) {
        console.log(err);
    }
};

execute();