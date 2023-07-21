import * as tf from "@tensorflow/tfjs";

export const trainModel = async (data) => {
  // Convert data to numeric values
  const numericData = data.map((value) => parseFloat(value));

  // Define the architecture of the autoencoder
  const inputDim = 1; // Dimensionality of the input data
  const encodingDim = 128; // Dimensionality of the encoded representation

  const model = tf.sequential();

  // Encoder layers
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
      inputShape: [inputDim],
    })
  );
  model.add(tf.layers.dense({ units: encodingDim, activation: "relu" }));

  // Decoder layers
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );
  model.add(tf.layers.dense({ units: inputDim, activation: "linear" }));

  // Compile the model
  model.compile({ loss: "meanSquaredError", optimizer: "adam" });

  // Train the autoencoder
  const trainAutoencoder = async (data, epochs) => {
    const tensorData = tf.tensor2d(numericData, [numericData.length, inputDim]);
    await model.fit(tensorData, tensorData, { epochs });
  };

  // Generate predictions for the next five values
  const predictNextValues = (inputData) => {
    let predictions = [];

    for (let i = 0; i < 5; i++) {
      const tensorInputData = tf.tensor2d([[inputData]], [1, inputDim]);
      const encodedData = model.predict(tensorInputData);
      const decodedData = model.predict(encodedData);

      const decodedValue = decodedData.arraySync()[0][0].toFixed(2);
      predictions.push(decodedValue);
      inputData = parseFloat(decodedValue);
    }

    return predictions;
  };

  // Example usage
  const epochs = 200; // Number of training epochs

  await trainAutoencoder(numericData, epochs);

  const inputForPredictions = numericData[numericData.length - 1]; // Use last value of input data for predictions
  const predictions = predictNextValues(inputForPredictions);
  const prediction = parseFloat(predictions[predictions.length - 1]);

  const predictionInt = Number.isInteger(prediction)
    ? prediction % 10
    : parseInt(prediction.toString().slice(-1));

  if (predictionInt % 2 === 0) {
    console.log(`Value received from ML Model: DIGITEVEN`);
    return "DIGITEVEN";
  } else {
    console.log(`Value received from ML Model: DIGITODD`);
    return "DIGITODD";
  }
};
