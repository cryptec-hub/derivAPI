import React, { useState, useEffect } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import PredictionComponent from "./PredictionComponent";

const Button = () => {
  const app_id = 36942; // Replace with your app_id or leave the current one for testing.
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });

  const [volatility100DataCollected, setVolatility100DataCollected] = useState(
    []
  );
  const [currentValue, setCurrentValue] = useState(0);
  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);

  const proposal_request = {
    proposal: 1,
    subscribe: 1,
    amount: 10,
    basis: "payout",
    contract_type: "CALL",
    currency: "USD",
    duration: 5,
    duration_unit: "t",
    symbol: "R_100",
    barrier: "+0.5",
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

  const getAccountDetails = async () => {
    connection.addEventListener("message", proposalResponse);
    await api.proposal(proposal_request);
    // ...rest of the code
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
  };

  const restartWebSocket = () => {
    startKeepAlive(); // Establish a new connection
  };

  console.log(volatility100DataCollected);

  return (
    <div>
      <button onClick={getAccountDetails}>Start the websocket</button>
      <button onClick={stopWebSocket}>Stop Web Socket</button>
      <button onClick={restartWebSocket}>Restart Web Socket</button>
      <div>
        <h2>{currentValue}</h2>
      </div>
      {/* <h3>Collected: {volatility100DataCollected}</h3> */}
      <BarChart width={500} height={600} data={recievedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
      <PredictionComponent data={volatility100DataCollected} />
    </div>
  );
};

export default Button;
