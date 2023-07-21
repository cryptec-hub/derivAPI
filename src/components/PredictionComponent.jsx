import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const PredictionComponent = ({ data }) => {
  const [predictions, setPredictions] = useState([]);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const trainModel = async () => {
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
        const tensorData = tf.tensor2d(data, [data.length, inputDim]);
        await model.fit(tensorData, tensorData, { epochs });
      };

      // Generate predictions for the next 10 values
      const predictNextValues = (inputData, numPredictions) => {
        let predictions = [];

        // Moving average parameters
        const windowSize = 5;
        const weights = [0.1, 0.2, 0.3, 0.2, 0.1]; // Custom weights for the moving average

        // Apply moving average to the input data
        const applyMovingAverage = (data) => {
          const smoothedData = [];
          const dataLength = data.length;

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

        // Apply moving average to the input data
        const smoothedInputData = applyMovingAverage(inputData);

        for (let i = 0; i < numPredictions; i++) {
          const tensorInputData = tf.tensor2d([inputData], [1, inputDim]);
          const encodedData = model.predict(tensorInputData);
          const decodedData = model.predict(encodedData);

          const decodedValues = decodedData.arraySync().flat();
          const prediction = decodedValues[0].toFixed(2);

          predictions.push(prediction);
          inputData = smoothedInputData.concat(prediction).slice(-windowSize); // Update input data with the latest prediction
        }

        return predictions;
      };

      // Example usage
      const epochs = 200; // Number of training epochs

      await trainAutoencoder(data, epochs);

      const inputForPredictions = data[data.length - 1]; // Use last value of input data for predictions
      const predictions = predictNextValues(inputForPredictions, 1);
      setPredictions(predictions);

      // Calculate accuracy
      const accuracyPercentage = calculateAccuracy(predictions, data);
      setAccuracy(accuracyPercentage);

      console.log("Predictions:", predictions);
    };

    if (data.length > 10) {
      trainModel();
    }
  });

  // Calculate accuracy percentage
  const calculateAccuracy = (predictions, originalData) => {
    const originalValue = originalData[originalData.length - 1];
    const predictedValue = predictions[0];

    const accuracy =
      Math.abs((predictedValue - originalValue) / originalValue) * 100;
    return accuracy.toFixed(2);
  };

  useEffect(() => {
    // Whenever the data prop changes, trigger the training and prediction process
    setPredictions([]); // Reset predictions
    setAccuracy(0); // Reset accuracy
  }, []);

  return (
    <div className="">
      <h3>Predictions: {predictions}</h3>

      <p>Accuracy: {accuracy}%</p>
    </div>
  );
};

export default PredictionComponent;
