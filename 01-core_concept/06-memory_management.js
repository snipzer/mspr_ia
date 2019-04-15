const tf = require('@tensorflow/tfjs');

// You can call dispose on a tensor or variable to purge it and free up its GPU memory
const x = tf.tensor2d([[0.0, 2.0], [4.0, 6.0]]);
const x_squared = x.square();

x.dispose();
x_squared.dispose();

// tf.tidy takes a function to tidy up after
const average = tf.tidy(() => {
    // tf.tidy will clean up all the GPU memory used by tensors inside
    // this function, other than the tensor that is returned.


    // Even in a short sequence of operations like the one below, a number
    // of intermediate tensors get created. So it is a good practice to
    // put your math ops in a tidy!
    const y = tf.tensor1d([1.0, 2.0, 3.0, 4.0]);
    const z = tf.ones([4]);

    return y.sub(z).square().mean();
});

average.print();