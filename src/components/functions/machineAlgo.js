import * as tf from "@tensorflow/tfjs";

export const trainModel = async (data) => {
  const inputDim = 1;
  const encodingDim = 32;
  const windowSize = 10;

  const model = tf.sequential();

  // Encoder layers for capturing patterns
  model.add(
    tf.layers.dense({
      units: encodingDim,
      activation: "relu",
      inputShape: [inputDim],
    })
  );

  // Decoder layers for reconstruction
  model.add(
    tf.layers.dense({
      units: inputDim,
      activation: "linear",
    })
  );

  // Compile the model for forecasting
  model.compile({ loss: "meanSquaredError", optimizer: "adam" });

  // Train the autoencoder for pattern recognition
  const trainAutoencoder = async (data, epochs) => {
    const tensorData = tf.tensor2d(data, [data.length, inputDim]);
    await model.fit(tensorData, tensorData, { epochs });
  };

  // Generate forecasts using captured patterns
  const forecastNextValues = (inputData, numForecasts) => {
    const forecasts = [];

    // Apply moving average to the input data
    const applyMovingAverage = (data) => {
      const smoothedData = [];
      const dataLength = data.length;
      const weights = [0.1, 0.2, 0.3, 0.2, 0.1];

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

    let tensorInputData = tf.tensor2d(inputData, [inputData.length, inputDim]);
    let tensorSmoothedData = tf.tensor2d(applyMovingAverage(inputData), [
      inputData.length,
      inputDim,
    ]);

    for (let i = 0; i < numForecasts; i++) {
      const encodedData = model.predict(tensorInputData);
      const decodedData = model.predict(encodedData);

      const decodedValues = decodedData.arraySync().flat();
      const forecast = decodedValues[0].toFixed(2);

      forecasts.push(forecast);

      inputData = inputData.concat(Number(forecast)).slice(-windowSize);
      tensorInputData = tf.tensor2d(inputData, [inputData.length, inputDim]);

      const newSmoothedValue = Number(forecast);
      tensorSmoothedData = tf.concat([
        tensorSmoothedData.slice(1),
        tf.tensor2d([[newSmoothedValue]], [1, inputDim]),
      ]);
    }

    return forecasts;
  };

  const epochs = 200;

  await trainAutoencoder(data, epochs);

  const inputForForecasts = data.slice(-windowSize);
  const forecasts = forecastNextValues(inputForForecasts, 45);

  return forecasts;
};
