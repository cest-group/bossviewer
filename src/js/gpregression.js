/**
 * This class mimics the funtionality of the GPRegression class in the GPy
 * python library. The following restrictions apply:
 * - Only 1D output is supported
 * - No output normalization
 */
export class GPRegression {
    /**
     * @param {function} kernel - Kernel function
     * @param {number} noise_var - Gaussian noise variance
     * @param {number} mean - Constant mean used as a mean function
     */
    constructor(kernel, noise_var, mean) {
        this.kernel = kernel;
        this.noise_var = noise_var;
        this.mean = mean;
    }

    /**
     * Trains the model with the given set of training inputs and outputs.
     *
     * @param {Array} x_train - Training inputs.
     * @param {Array} y_train - Training outputs.
     */
    fit(x_train, y_train) {
        this.x_train = x_train
        let n_samples = y_train.length;
        let K_matrix = this.K(x_train, this.kernel);
        let y_train_trans = math.transpose(y_train)
        let y_train_trans_minus_mean = math.subtract(y_train_trans, this.mean)
        let inverse = math.inv(math.add(K_matrix, math.dotMultiply(this.noise_var, math.identity(n_samples))))
        this.y_train_trans_minus_mean_times_inverse = math.multiply(y_train_trans_minus_mean, inverse);
    }

    /**
     * Calculates the Gaussian process regression prediction.
     *
     * @param {Array} x - New input for which prediction is calculated.
     * @return {number} The predicted output.
     */
    predict(x) {
        let k_vec = this.k_vector(x, this.x_train, this.kernel);
        let offset = math.multiply(this.y_train_trans_minus_mean_times_inverse, k_vec);
        let y = this.mean + offset.get([0]);
        return y;
    }

    /**
     * Given an input calculates it's dot product (via the kernel) with all the
     * given training points.
     *
     * @param {Array} a - New input
     * @param {Array} x_train - Training inputs
     * @param {function} kernel - Kernel function
     * @return {Array} Vector containing the dot products with training inputs.
     */
    k_vector(a, x_train, kernel) {
        let ks = [];
        for (let i=0; i < x_train.length; ++i) {
            let x = x_train[i];
            let k = kernel(a, x);
            ks.push(k);
        };
        return ks;
    }

    /**
     * Calculates the dot products of each training sample with the other samples
     * forming the symmetric kernel matrix K.
     *
     * @param x_train - Training inputs
     * @param kernel - Kernel function
     * @return {math.DenseMatrix} Matrix containing the pairwise dot products of all training inputs.
     */
    K(x_train, kernel) {
        let normalization = kernel(x_train[0], x_train[0]);
        let ks = math.zeros(x_train.length);
        for (let i=0; i < x_train.length; ++i) {
            for (let j=0; j < x_train.length; ++j) {
                // For the diagonal we fill the precalculated normalization
                // factor
                if (i == j) {
                    ks.set([i, j], normalization);
                // Symmetry is used to reduce number of calculations.
                } else if (j > i) {
                    let k = kernel(x_train[i], x_train[j]);
                    ks.set([i, j], k);
                    ks.set([j, i], k);
                }
            };
        };
        return ks;
    }
}

/**
 * The standard periodic kernel funcion as defined in GPy.
 *
 * @param {number} std_variance - Variance parameter for the exponential.
 * @param {Array} periods - Periods for each input variable.
 * @param {Array} lengths - Length scales for each input variable.
 * @return {function} Function that given two input arrays will calculate their
 * dot product.
 */
export function std_periodic_kernel(std_variance, periods, lengths) {
    return function(a, b) {
        let arg = math.dotPow(math.dotDivide(math.sin(math.dotMultiply(math.dotDivide(Math.PI, periods), math.subtract(a, b))), lengths), 2);
        return std_variance*math.exp(-1/2*math.sum(arg))
    }
}

