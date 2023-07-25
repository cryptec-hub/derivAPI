import React, { useEffect, useState } from "react";
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
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 36942;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);

const api = new DerivAPIBasic({ connection });

function LiveData() {
  const [currentValue, setCurrentValue] = useState(0);
  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);
  const [volatility100DataCollected, setVolatility100DataCollected] = useState(
    []
  );

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
      // console.log("The last digit of ", sampleNumber, " is ", lastDigit);

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

      // console.log(typeof volatility100DataCollected);
      processNumber(lastDigit);
      // console.log(recievedData);

      if (volatility100DataCollected.length === 1000) {
        connection.close();
      }
    }
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

  const resetData = () => {
    setRecievedData([
      { category: "Even", count: 0 },
      { category: "Odd", count: 0 },
    ]);
  };

  const restartWebSocket = () => {
    startKeepAlive(); // Establish a new connection
  };

  const startKeepAlive = () => {
    // Send a ping message every 30 seconds
    const keepAliveInterval = setInterval(keepAlive, 30000);

    // Handle the pong message from the server
    connection.onmessage = function (event) {
      const message = JSON.parse(event.data);
      // console.log(message.data);
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

  const keepAlive = () => {
    const pingMessage = JSON.stringify({ ping: 1 });

    connection.send(pingMessage);
  };
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
      <div className="flex justify-end">
        <button className="mt-3 w-40 ml-10 p-4" onClick={startTheWebsocket}>
          Get Live Data
        </button>
        <button className="mt-3 w-40 ml-10 p-4" onClick={resetData}>
          Reset
        </button>
        <h1 className="w-20 mt-3 ml-10 bg-white shadow-md rounded-md text-blue-600 p-4">
          {currentValue}
        </h1>
      </div>
    </div>
  );
}

export default LiveData;
