import { useEffect, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";

const app_id = 36942;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const PredictionComponent = ({ volatilityOption }) => {
  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);
  const [predictionButton, setPredictionButton] = useState(false);

  const fetchDataAndTrainModel = async () => {
    setPredictionButton(true);
    const ticksHistoryResponse = await api.ticksHistory({
      ticks_history: `${volatilityOption}`,
      adjust_start_time: 1,
      count: 100,
      end: "latest",
      start: 1,
      style: "ticks",
    });

    const data = await ticksHistoryResponse.history.prices.map((tick) => tick);
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

    toast.success(`Successfully trained the model😊`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setPredictionButton(false);
  };

  useEffect(() => {
    fetchDataAndTrainModel();
  }, [volatilityOption]);

  // setInterval(fetchDataAndTrainModel, 10000);

  return (
    <div className="w-full flex flex-col">
      <div className="p-4 bg-white shadow-md rounded-md ml-10">
        <ResponsiveContainer width="100%" height={500}>
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
      <div className="text-center">
        <button
          className="mt-3 w-40"
          onClick={fetchDataAndTrainModel}
          disabled={predictionButton}
        >
          Retrain Model
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        // limit={1}
      />
    </div>
  );
};

export default PredictionComponent;
