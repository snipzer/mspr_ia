const tf = require('@tensorflow/tfjs');

// Tensor are immutable => we use const

const shape = [2, 3]; // 2 rows, 3 columns
const a = tf.tensor([1.0, 2.0, 3.0, 10.0, 20.0, 30.0], shape);
a.print();

console.log("===================");

// The shape can also be inferred:
const b = tf.tensor([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
b.print();

console.log("===================");

// We should use the right tensor function for clarity
const c = tf.tensor2d([[1.0, 2.0, 3.0], [10.0, 20.0, 30.0]]);
c.print();

console.log("===================");

// 3x5 Tensor with all values set to 0
const zeros = tf.zeros([3, 5]);

zeros.print();

console.log("===================");