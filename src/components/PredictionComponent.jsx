import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import { trainModel } from "./functions/machineAlgo";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const app_id = 36942;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const PredictionComponent = () => {
  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);

  useEffect(() => {
    const fetchDataAndTrainModel = async () => {
      const ticksHistoryResponse = await api.ticksHistory({
        ticks_history: "R_100",
        adjust_start_time: 1,
        count: 100,
        end: "latest",
        start: 1,
        style: "ticks",
      });

      const data = await ticksHistoryResponse.history.prices.map(
        (tick) => tick
      );
      const modelResponse = await trainModel(data);

      const updatedData = { Even: 0, Odd: 0 };

      modelResponse.forEach((val) => {
        var sampleNumber = Number.parseFloat(val).toFixed(2);
        var lastDigit = Number.isInteger(sampleNumber)
          ? sampleNumber % 10
          : sampleNumber.toString().slice(-1);

        if (Number(lastDigit) % 2 === 0) {
          updatedData["Even"] += 1;
        } else {
          updatedData["Odd"] += 1;
        }
      });

      // Update the component state with the predictions and received data
      setRecievedData([
        { category: "Even", count: updatedData["Even"] },
        { category: "Odd", count: updatedData["Odd"] },
      ]);
    };

    fetchDataAndTrainModel();
  }, []);

  return (
    <div className="flex w-full">
      <div>
        <div className="flex-col w-full ">
          <button className="ml-4 mb-4">Get Live Data</button>
          <button className="ml-4 mb-4">Reset</button>
        </div>
      </div>

      <div className="w-3/6  p-4 bg-white shadow-md rounded-md mt-2">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={recievedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionComponent;
