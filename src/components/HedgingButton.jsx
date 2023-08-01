import React, { useRef, useState } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
const app_id = 36942;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HedgingButton() {
  const api = new DerivAPIBasic({ connection });
  const initialStake = 0.35;
  const [digitEvenStake, setDigitEvenStake] = useState(initialStake);
  const [digitOddStake, setDigitOddStake] = useState(initialStake);
  const [digitEvenProfit, setDigitEvenProfit] = useState(0);
  const [digitOddProfit, setDigitOddProfit] = useState(0);

  const latestDigitEvenStake = useRef(digitEvenStake);
  const latestDigitOddStake = useRef(digitOddStake);
  const latestDigitOddProfit = useRef(digitOddProfit);
  const latestDigitEvenProfit = useRef(digitEvenProfit);

  const token = "pTG32T60qDgtLEk";

  const makeDigitEvenPurchase = async () => {
    try {
      await api.authorize(token);

      const proposalRequestResponse = await api.proposal({
        proposal: 1,
        amount: latestDigitEvenStake.current,
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const profitTableRes = await api.profitTable({
          profit_table: 1,
          description: 1,
          contract_type: ["DIGITEVEN"],
          limit: 1,
        });

        console.log(profitTableRes);

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
        const newStake = profitMade <= 0 ? digitEvenStake * 2 : initialStake;

        // Update the latest stake and profit values with the new values
        latestDigitEvenStake.current = newStake;
        latestDigitEvenProfit.current =
          latestDigitEvenProfit.current + profitMade;

        // Update the state with the new stake and profit
        setDigitEvenStake(latestDigitEvenStake.current);
        setDigitEvenProfit(latestDigitEvenProfit.current);
      };

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      await simulateTrading();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  async function makeDigitOddPurchase() {
    try {
      await api.authorize(token);

      const proposalRequestResponse = await api.proposal({
        proposal: 1,
        amount: latestDigitOddStake.current,
        basis: "stake",
        contract_type: "DIGITODD",
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const profitTableRes = await api.profitTable({
          profit_table: 1,
          description: 1,
          contract_type: ["DIGITODD"],
          limit: 1,
        });

        console.log(profitTableRes);

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
        const newStake = profitMade <= 0 ? digitOddStake * 2 : initialStake;

        // Update the latest stake and profit values with the new values
        latestDigitOddStake.current = newStake;
        latestDigitOddProfit.current =
          latestDigitOddProfit.current + profitMade;

        // Update the state with the new stake and profit
        setDigitEvenStake(latestDigitOddStake.current);
        setDigitEvenProfit(latestDigitOddProfit.current);
      };

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      await simulateTrading();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const makeThePurchase = () => {
    // Call both functions without awaiting their results
    makeDigitEvenPurchase;
    makeDigitOddPurchase();

    console.log("Both Functions Called.");
  };

  return (
    <div className="mt-4">
      <button onClick={makeThePurchase}>Buy Same asset</button>
      <div className="flex flex-col">
        <div className="mt-4">
          <p className="text-xl ml-4  font-bold text-indigo-600">
            DigitEven Stake: {digitEvenStake}
          </p>
          <p className="text-xl ml-4  font-bold text-green-600">
            Digit Even Profit: {digitEvenProfit}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-xl ml-4  font-bold text-indigo-600">
            Digit Odd Stake: {digitOddStake}
          </p>
          <p className="text-xl ml-4  font-bold text-green-600">
            Digit Odd Profit: {digitOddProfit}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HedgingButton;
