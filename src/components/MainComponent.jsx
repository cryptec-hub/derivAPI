import React, { useState, useEffect, useRef } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

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
import PredictionComponent from "./PredictionComponent";
import BuySellComponent from "./BuySellComponent";

const MainComponent = () => {
  const app_id = 36942;
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });

  const initialStake = 1;
  const [stake, setStake] = useState(initialStake);
  const [profit, setProfit] = useState(0);
  const [balance, setBalance] = useState(null);
  const [startTrading, setStartTrading] = useState(false);
  const [volatility100DataCollected, setVolatility100DataCollected] = useState(
    []
  );
  const [currentValue, setCurrentValue] = useState(0);
  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);

  // Use useRef to store the latest stake and profit values
  const latestStake = useRef(stake);
  const latestProfit = useRef(profit);

  const proposal_request = {
    proposal: 1,
    subscribe: 1,
    amount: 10,
    basis: "payout",
    contract_type: "CALL",
    currency: "USD",
    duration: 1,
    duration_unit: "m",
    symbol: "R_100",
    barrier: "+0.1",
  };

  const proposalResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: %s ", data.error.message);
      connection.removeEventListener("message", proposalResponse, false);
      await api.disconnect();
    } else if (data.msg_type === "proposal") {
      let spot = Number.parseFloat(data.proposal.spot).toFixed(2);
      setCurrentValue(spot);
      const parsedSpot = parseFloat(spot); // Convert spot to a floating-point number

      setVolatility100DataCollected((prevData) => [...prevData, parsedSpot]);

      var sampleNumber = Number.parseFloat(data.proposal.spot).toFixed(2),
        lastDigit = Number.isInteger(sampleNumber)
          ? sampleNumber % 10
          : sampleNumber.toString().slice(-1);
      console.log("The last digit of ", sampleNumber, " is ", lastDigit);

      // Update the data array based on incoming data
      function processNumber(number) {
        const isEven = number % 2 === 0;
        setRecievedData((prevData) => {
          const updatedData = [...prevData];
          if (isEven) {
            updatedData[0].count += 1; // Increment count for Even category
          } else {
            updatedData[1].count += 1; // Increment count for Odd category
          }
          return updatedData;
        });
      }

      console.log(typeof volatility100DataCollected);
      processNumber(lastDigit);
      console.log(recievedData);

      if (volatility100DataCollected.length === 1000) {
        connection.close();
      }
    }
  };

  const keepAlive = () => {
    const pingMessage = JSON.stringify({ ping: 1 });

    connection.send(pingMessage);
  };

  const startKeepAlive = () => {
    // Send a ping message every 30 seconds
    const keepAliveInterval = setInterval(keepAlive, 30000);

    // Handle the pong message from the server
    connection.onmessage = function (event) {
      const message = JSON.parse(event.data);
      console.log(message.data);
    };

    // Clear the keep-alive interval and close the connection on disconnect
    connection.onclose = function (event) {
      clearInterval(keepAliveInterval);
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        console.log("[close] Connection died");
      }
    };

    // Handle connection errors
    connection.onerror = function (error) {
      console.log(`[error]`);
    };
  };

  const startTheWebsocket = async () => {
    connection.addEventListener("message", proposalResponse);
    try {
      await api.proposal(proposal_request);
    } catch (error) {
      console.log("Error: ", error);
    }
    connection.onopen = function (e) {
      console.log("[open] Connection established");
      console.log("Sending to server");
      startKeepAlive();
    };
  };

  const stopWebSocket = () => {
    if (connection) {
      connection.close();
    }
    setRecievedData([
      { category: "Even", count: 0 },
      { category: "Odd", count: 0 },
    ]);
  };

  const restartWebSocket = () => {
    startKeepAlive(); // Establish a new connection
  };

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full">
        <div>
          <button className="ml-4 mb-4" onClick={startTheWebsocket}>
            Get Live Data
          </button>
          <button className="ml-4 mb-4" onClick={stopWebSocket}>
            Reset
          </button>
        </div>

        <BuySellComponent />
        <div>
          <h2>{currentValue}</h2>
        </div>
        <div className="w-8/12  p-4 bg-white shadow-md rounded-md mt-40">
          <ResponsiveContainer width="100%" height={450}>
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

      {/* <div className="w-full items-center">
        <PredictionComponent data={volatility100DataCollected} />
      </div> */}
    </div>
  );
};

export default MainComponent;
