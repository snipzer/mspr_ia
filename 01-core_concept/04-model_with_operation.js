const tf = require('@tensorflow/tfjs');

// A model is a function that given some input will produce some desired output
// Define function
function predict(input, a, b, c) {
    return tf.tidy(() => {
        // x
        const x = tf.scalar(input);
        // x^2
        const x2 = x.square();
        // a.x^2
        const ax2 = a.mul(x2);

        // b.x
        const bx = b.mul(x);

        // a.x^2 + b.x + c
        return ax2.add(bx).add(c);
    });
}

// Define constants
const a = tf.scalar(2);
const b = tf.scalar(4);
const c = tf.scalar(8);

// Predict output for input of 2
const result = predict(2, a, b, c);
result.print(); // Output: 24