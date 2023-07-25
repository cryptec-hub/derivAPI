import * as tf from "@tensorflow/tfjs";

export const trainModel = async (data) => {
  // Define the architecture of the autoencoder
  const inputDim = 1; // Dimensionality of the input data
  const encodingDim = 128; // Dimensionality of the encoded representation
  const windowSize = 20; // Size of the moving average window

  const model = tf.sequential();

  // Encoder layers
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
      inputShape: [inputDim],
    })
  );
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: encodingDim, activation: "relu" }));

  // Decoder layers
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: inputDim, activation: "linear" }));

  // Compile the model
  model.compile({ loss: "meanSquaredError", optimizer: "adam" });

  // Train the autoencoder
  const trainAutoencoder = async (data, epochs) => {
    const tensorData = tf.tensor2d(data, [data.length, inputDim]);
    await model.fit(tensorData, tensorData, { epochs });
  };

  // Generate predictions for the next 10 values
  const predictNextValues = (inputData, numPredictions) => {
    let predictions = [];

    // Apply moving average to the input data
    const applyMovingAverage = (data) => {
      const smoothedData = [];
      const dataLength = data.length;
      const weights = [0.1, 0.2, 0.3, 0.2, 0.1]; // Custom weights for the moving average

      for (let i = 0; i < dataLength; i++) {
        let sum = 0;
        let weightIndex = 0;

        for (let j = i - windowSize + 1; j <= i; j++) {
          if (j >= 0 && j < dataLength) {
            sum += data[j] * weights[weightIndex];
            weightIndex++;
          }
        }

        smoothedData.push(sum);
      }

      return smoothedData;
    };

    // Convert inputData and smoothedInputData to tensors with shape [inputData.length, 1]
    let tensorInputData = tf.tensor2d(inputData, [inputData.length, 1]);
    let tensorSmoothedData = tf.tensor2d(applyMovingAverage(inputData), [
      inputData.length,
      1,
    ]);

    for (let i = 0; i < numPredictions; i++) {
      const encodedData = model.predict(tensorInputData);
      const decodedData = model.predict(encodedData);

      // Get the decoded values from the tensor
      const decodedValues = decodedData.arraySync().flat();
      const prediction = decodedValues[0].toFixed(2);

      predictions.push(prediction);

      // Update inputData and smoothedInputData with the new prediction
      inputData = inputData.concat(Number(prediction)).slice(-windowSize);
      tensorInputData = tf.tensor2d(inputData, [inputData.length, 1]);

      const newSmoothedValue = Number(prediction);
      tensorSmoothedData = tf.concat([
        tensorSmoothedData.slice(1),
        tf.tensor2d([[newSmoothedValue]], [1, 1]),
      ]);
    }

    return predictions;
  };

  // Example usage
  const epochs = 200; // Number of training epochs

  await trainAutoencoder(data, epochs);

  const inputForPredictions = data.slice(-windowSize); // Use the last 20 values of input data for predictions
  const predictions = predictNextValues(inputForPredictions, 50);

  return predictions;
};
