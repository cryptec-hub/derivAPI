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

        for (let i = 0; i < numPredictions; i++) {
          const tensorInputData = tf.tensor2d([inputData], [1, inputDim]);
          const encodedData = model.predict(tensorInputData);
          const decodedData = model.predict(encodedData);

          const decodedValues = decodedData.arraySync().flat();
          const prediction = decodedValues[0];

          predictions.push(prediction);
          inputData = prediction;
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
  }, [data]);

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
  }, [data]);

  return (
    <div>
      <h3>Predictions:</h3>
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index}>{prediction}</li>
        ))}
      </ul>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
};

export default PredictionComponent;
