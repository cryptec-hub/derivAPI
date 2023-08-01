import React, { useEffect, useRef, useState } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { tradeType, allVolatitilityOptions, ticks } from "./functions/data";
import ModalComponent from "./ModalComponent";

function BuySellComponent({ authorizationToken, onSaveVolatility }) {
  const app_id = 36942;
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });
  const initialStake = 0.35;
  const [stake, setStake] = useState(initialStake);
  const [profit, setProfit] = useState(0);
  const [balance, setBalance] = useState(null);
  const [loginId, setLoginId] = useState("Please wait...");
  const [selectedTradeType, setSelectedTradeType] = useState({
    value: "DIGITEVEN",
    label: "DIGITEVEN",
  });
  const [tradingButton, setTradingButton] = useState(false);
  const [selectedVolatitilityOption, setSelectedVolatitilityOption] = useState({
    value: "1HZ100V",
    label: "R_100(1s)",
  });
  const [selectedTicks, setSelectedTicks] = useState({
    value: 2,
    label: 2,
  });

  const token = authorizationToken;

  const handleTradeTypeChange = (selected) => {
    setSelectedTradeType(selected);
  };
  const handleTickChange = (selected) => {
    setSelectedTicks(selected);
  };
  const handleVolatilityTypeChange = (selected) => {
    setSelectedVolatitilityOption(selected);
    const selectedOption = selected.value;
    onSaveVolatility(selectedOption);
    // setTradeTypeButton(true);
  };

  // Use useRef to store the latest stake and profit values
  const latestStake = useRef(stake);
  const latestProfit = useRef(profit);

  useEffect(() => {
    async function getAccDetails() {
      try {
        const id = "toast";
        const accDetails = await api.authorize(token);
        setBalance(accDetails.authorize.balance);
        setLoginId(accDetails.authorize.loginid);
        toast.success(`Logged in Successfully😊`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: id,
        });
      } catch (error) {
        toast.error(`${error.error.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: `${error.error.message}`,
        });
      }
    }

    getAccDetails();
  }, []);

  useEffect(() => {
    setBalanceFunction();
  });

  const makeAPurchase = async () => {
    setTradingButton(true);
    try {
      await api.authorize(token);

      const proposalRequestResponse = await api.proposal({
        proposal: 1,
        amount: latestStake.current,
        basis: "stake",
        contract_type: selectedTradeType.value,
        currency: "USD",
        duration: selectedTicks.value,
        duration_unit: "t",
        symbol: `${selectedVolatitilityOption.value}`,
      });

      const buyResponse = await api.buy({
        price: 100,
        buy: proposalRequestResponse.proposal.id,
      });

      toast.info(`${buyResponse.buy.longcode}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      const simulateTrading = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const profitTableRes = await api.profitTable({
          profit_table: 1,
          description: 1,
          contract_type: [`${selectedTradeType.value}`],
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
            autoClose: 2500,
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
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        const newStake = profitMade <= 0 ? stake * 2.1 : initialStake;

        // Update the latest stake and profit values with the new values
        latestStake.current = newStake.toFixed(2);

        const newProfit =
          parseFloat(latestProfit.current) + parseFloat(profitMade);
        latestProfit.current = newProfit.toFixed(2);

        // Update the state with the new stake and profit
        setStake(latestStake.current);
        setProfit(latestProfit.current);
      };

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      await simulateTrading();
      setTradingButton(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const makeMultiplePurchases = () => {
    setInterval(() => {
      makeAPurchase();
    }, 5000);
  };

  const balanceResponse = async (res) => {
    const data = await JSON.parse(res.data);
    return data.balance; // Resolve the Promise with the balance value
  };

  async function setBalanceFunction() {
    // Create a Promise to wait for the balance value
    const balancePromise = new Promise((resolve) => {
      connection.addEventListener("message", async (res) => {
        const balance = await balanceResponse(res);
        if (balance !== undefined) {
          resolve(balance);
        }
      });
    });

    // Authorize and subscribe to balance
    await api.authorize(token);
    await api.balance({
      balance: 1,
      subscribe: 1,
    });

    // Wait for the balance value to be available
    const balanceValue = await balancePromise;
    setBalance(balanceValue.balance);
  }

  const logOut = () => {
    // Delete the authToken from localStorage
    localStorage.removeItem("authToken");

    // Reload the page
    window.location.reload();
  };

  return (
    <div className="w-2/6">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-left mb-4 ml-4">{loginId}</h2>
          <h2 className="text-right mb-4">Bal: {balance}</h2>
        </div>
        <button
          onClick={makeAPurchase}
          className="mb-4 ml-4 bg-lime-300 text-emerald-950"
          disabled={tradingButton}
        >
          Make a Single Purchase.
        </button>
        <button
          onClick={makeMultiplePurchases}
          className="mb-4 ml-4 bg-lime-300 text-emerald-950"
        >
          Make multiple purchases.
        </button>

        <Select
          className="mb-4 ml-4 bg-lime-300 text-emerald-950 rounded-sm"
          options={tradeType}
          value={selectedTradeType}
          onChange={handleTradeTypeChange}
        />

        <Select
          className="mb-4 ml-4 bg-lime-300 text-emerald-950 rounded-sm"
          options={allVolatitilityOptions}
          value={selectedVolatitilityOption}
          onChange={handleVolatilityTypeChange}
        />

        <div className="flex items-center justify-end">
          <h3 className="mb-4 ml-4">Ticks: </h3>
          <Select
            className="mb-4 ml-4 bg-lime-300 text-emerald-950 rounded-sm"
            options={ticks}
            value={selectedTicks}
            onChange={handleTickChange}
          />
        </div>

        <div className="mt-4">
          <p className="text-xl ml-4  font-bold text-indigo-600">
            Stake: {stake}
          </p>
          <p className="text-xl ml-4  font-bold text-green-600">
            Profit: {profit}
          </p>
        </div>
      </div>
      <ModalComponent />
      <div>
        <button className="fixed left-0 m-10 bottom-0" onClick={logOut}>
          Switch Account
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
}

export default React.memo(BuySellComponent);
