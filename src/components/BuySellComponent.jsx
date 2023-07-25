import React, { useEffect, useRef, useState } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    async function getAccDetails() {
      const accDetails = await api.authorize("pTG32T60qDgtLEk");
      setBalance(accDetails.authorize.balance);
    }

    getAccDetails();
  });

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

      const simulateTrading = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const profitTableRes = await api.profitTable({
          profit_table: 1,
          description: 1,
          contract_type: ["DIGITEVEN"],
          limit: 1,
        });

        const roundedProfitMade =
          profitTableRes.profit_table.transactions[0].sell_price -
          buyResponse.buy.buy_price;

        const profitMade = parseFloat(roundedProfitMade.toFixed(2));

        if (profitMade > 0) {
          // Show toast message with doubled stake
          toast.success(`Profit Made ${profitMade}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          toast.error(`Loss Made ${profitMade}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        const newStake = profitMade <= 0 ? stake * 2 : initialStake;

        // Update the latest stake and profit values with the new values
        latestStake.current = newStake;
        latestProfit.current = latestProfit.current + profitMade;

        // Update the state with the new stake and profit
        setStake(latestStake.current);
        setProfit(latestProfit.current);
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

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

  const balanceResponse = (res) => {
    const data = JSON.parse(res.data);
    setBalance(data.balance.balance);
  };

  async function setBalanceFunction() {
    await api.authorize(token);
    connection.addEventListener("message", balanceResponse);
  }

  return (
    <div className="w-2/6">
      <div className="flex flex-col">
        <h2 className="text-right mb-4">Balance: {balance}</h2>
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
          <p className="text-xl ml-4  font-bold text-indigo-600">
            Stake: {stake}
          </p>
          <p className="text-xl ml-4  font-bold text-green-600">
            Profit: {profit}
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
