import React, { useEffect, useRef, useState } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

export default function BuySellComponent() {
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
  const token = "pTG32T60qDgtLEk";

  // Use useRef to store the latest stake and profit values
  const latestStake = useRef(stake);
  const latestProfit = useRef(profit);

  useEffect(() => {});

  const makeAPurchase = async () => {
    try {
      await api.authorize(token);

      const proposalRequestResponse = await api.proposal({
        proposal: 1,
        amount: latestStake.current,
        basis: "stake",
        contract_type: "DIGITEVEN",
        currency: "USD",
        duration: 1,
        duration_unit: "t",
        symbol: "R_100",
      });

      const buyResponse = await api.buy({
        price: 100,
        buy: proposalRequestResponse.proposal.id,
      });

      console.log("Buy Amount from proposal: ", buyResponse.buy.buy_price);

      const simulateTrading = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const profitTableRes = await api.profitTable({
          profit_table: 1,
          description: 1,
          contract_type: ["DIGITEVEN"],
          limit: 1,
        });

        const profitMade =
          profitTableRes.profit_table.transactions[0].sell_price -
          buyResponse.buy.buy_price;

        console.log("Profit Table response: ", profitTableRes);
        console.log(
          "Buy Price: ",
          profitTableRes.profit_table.transactions[0].buy_price
        );
        console.log(
          "Sell Price: ",
          profitTableRes.profit_table.transactions[0].sell_price
        );

        const newStake = profitMade <= 0 ? stake * 2 : initialStake;

        // Update the latest stake and profit values with the new values
        latestStake.current = newStake;
        latestProfit.current = latestProfit.current + profitMade;

        // Update the state with the new stake and profit
        setStake(latestStake.current);
        setProfit(latestProfit.current);
        console.log(`Profit made: ${profitMade}`);
      };

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await simulateTrading();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const makeMultiplePurchases = () => {
    setBalanceFunction();
    setInterval(() => {
      makeAPurchase();
    }, 5000);
  };
  const profitTableFunction = async () => {
    try {
      await api.authorize(token);
      const profitTableRes = await api.profitTable({
        profit_table: 1,
        description: 1,
        contract_type: ["DIGITEVEN"],
        limit: 1,
      });

      console.log(
        "Response from profitTabble Function: ",
        profitTableRes.profit_table.transactions[0]
      );
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const balanceResponse = (res) => {
    const data = JSON.parse(res.data);
    setBalance(data.balance.balance);
  };

  async function setBalanceFunction() {
    await api.authorize(token);
    connection.addEventListener("message", balanceResponse);
    const balanceRes = await api.balance({
      balance: 1,
      subscribe: 1,
    });

    const bal = balanceRes.balance.balance;

    setStartTrading(true);
  }

  return (
    <div className="flex flex-col w-full">
      <div>
        <button
          onClick={makeAPurchase}
          className="mb-4 ml-4 bg-lime-300 text-emerald-950"
        >
          Make a Single Purchase.
        </button>
        <button
          onClick={makeMultiplePurchases}
          className="mb-4 ml-4 bg-lime-300 text-emerald-950"
        >
          Make multiple purchases.
        </button>
        <button
          onClick={setBalanceFunction}
          className="mb-4 ml-4 bg-lime-300 text-emerald-950"
        >
          Get Balance
        </button>

        <div className="mt-4">
          <p className="text-xl font-bold text-indigo-600">Stake: {stake}</p>
          <p className="text-xl font-bold text-green-600">Profit: {profit}</p>
        </div>

        {balance && <h2>Balance: {balance}</h2>}
      </div>
    </div>
  );
}
