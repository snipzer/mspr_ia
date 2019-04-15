const tf = require('@tensorflow/tfjs');

// Variable are mutable
// Variables are primarily used to store and then update values during model training.

const initialValues = tf.zeros([5]);
const biases = tf.variable(initialValues); // initialize biases
biases.print();

console.log("===================");

const updatedValues = tf.tensor1d([0, 1, 0, 1, 0]);
biases.assign(updatedValues); // update values of biases
biases.print();
