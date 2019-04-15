const tf = require('@tensorflow/tfjs');

// A layer are popular abstraction in depp learning

// Here we use layers.simpleRNN
// We can also use layers.gru or layers.lstm
const model = tf.sequential();
model.add(
    tf.layers.simpleRNN({
        units: 20,
        recurrentInitializer: 'GlorotNormal',
        inputShape: [80, 4]
    })
);

const optimizer = tf.train.sgd(LEARNING_RATE);
model.compile({optimizer, loss: 'categoricalCrossentropy'});
model.fit({x: data, y: labels});