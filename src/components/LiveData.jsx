import React, { useEffect, useRef, useState } from "react";
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

function LiveData({ volatilityOption }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [propsalID, setProposalID] = useState(
    "4eea2631-8f2a-bad6-d3b5-f6a821478b5c"
  );

  const [recievedData, setRecievedData] = useState([
    { category: "Even", count: 0 },
    { category: "Odd", count: 0 },
  ]);

  const unSubscribeProposal = async () => {
    await api.forget(propsalID);
    api.logout({
      logout: 1,
    });
    console.log("Unsubscribed");

    resetData();
    setCurrentValue(0);
    // Reset the recievedData state by creating a new array with updated count values
    const updatedRecievedData = [
      { category: "Even", count: 0 },
      { category: "Odd", count: 0 },
    ];

    setRecievedData(updatedRecievedData);
  };

  const proposal = async () => {
    const proposalResponse = await api.proposal({
      proposal: 1,
      subscribe: 1,
      amount: 10,
      basis: "payout",
      contract_type: "CALL",
      currency: "USD",
      duration: 1,
      duration_unit: "m",
      symbol: `${volatilityOption}`,
      barrier: "+0.1",
    });

    const recievedProposalID = proposalResponse.subscription.id;
    setProposalID(recievedProposalID);
  };

  const proposalResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: %s ", data.error.message);
      connection.removeEventListener("message", proposalResponse, false);
      await api.disconnect();
    } else if (data.msg_type === "proposal") {
      if (
        volatilityOption === "1HZ100V" ||
        volatilityOption === "R_100" ||
        volatilityOption === "1HZ75V" ||
        volatilityOption === "1HZ50V" ||
        volatilityOption === "1HZ25V" ||
        volatilityOption === "1HZ10V"
      ) {
        console.log("Volatility Option", volatilityOption);
        let spot = Number.parseFloat(data.proposal.spot).toFixed(2);
        setCurrentValue(spot);

        // setVolatility100DataCollected((prevData) => [...prevData, parsedSpot]);

        var sampleNumber = Number.parseFloat(data.proposal.spot).toFixed(2),
          lastDigit = Number.isInteger(sampleNumber)
            ? sampleNumber % 10
            : sampleNumber.toString().slice(-1);

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

        processNumber(lastDigit);
      } else {
        console.log("Volatility not 100");
        let spot = Number.parseFloat(data.proposal.spot).toFixed(4);
        setCurrentValue(spot);

        // setVolatility100DataCollected((prevData) => [...prevData, parsedSpot]);

        var sampleNumber = Number.parseFloat(data.proposal.spot).toFixed(4),
          lastDigit = Number.isInteger(sampleNumber)
            ? sampleNumber % 10
            : sampleNumber.toString().slice(-1);

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

        processNumber(lastDigit);
      }
    }
  };

  useEffect(() => {
    connection.addEventListener("message", proposalResponse);
    return () => {
      unSubscribeProposal();
      connection.removeEventListener("message", proposalResponse, false);
    };
  }, []);
  const startTheWebsocket = () => {
    proposal();
    // console.log(`volatilityOption after proposalrequest${volatilityOption}`);
  };

  const resetData = () => {
    setRecievedData([
      { category: "Even", count: 0 },
      { category: "Odd", count: 0 },
    ]);
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
        <button className="mt-3 ml-10 p-4" onClick={startTheWebsocket}>
          Get Live Data
        </button>
        <button className="mt-3 ml-10 p-4" onClick={unSubscribeProposal}>
          Unsubscribe
        </button>
        <button className="mt-3 ml-10 p-4" onClick={resetData}>
          Reset
        </button>
        <h1 className="w-40 mt-3 ml-10 bg-white shadow-md rounded-md text-blue-600 p-4">
          {currentValue}
        </h1>
      </div>
    </div>
  );
}

export default LiveData;
