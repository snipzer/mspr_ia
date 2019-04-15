const tf = require('@tensorflow/tfjs');

// Operation allow to manipulate data from tensor
// Operation return new tensor

const d = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
const d_squared = d.square();
d_squared.print();

console.log("===================");

const e = tf.tensor2d([[1.0, 2.0], [3.0, 4.0]]);
const f = tf.tensor2d([[5.0, 6.0], [7.0, 8.0]]);

const e_plus_f = e.add(f);
e_plus_f.print();

console.log("===================");

const sq_sum = tf.square(tf.add(e, f));
sq_sum.print();