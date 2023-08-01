import React, { useState } from "react";
import Modal from "react-modal";
import { advantages, disadvantages, reasons } from "./functions/data";

function ModalComponent({ currentState, setCurrentState }) {
  const customStyles = {
    content: {
      backgroundcolor: "blue",
    },
  };
  const handleButtonChange = () => {
    if (currentState === true) {
      setCurrentState(false); // Set the currentState to false
    }
  };
  return (
    <div>
      <Modal
        isOpen={currentState}
        appElement={document.getElementById("root")}
        style={customStyles}
      >
        <h1 className="text-black ml-20 mr-20 mt-20 text-3xl font-serif font-bold">
          Trading Continuous Indices on Deriv: Embrace the Opportunity Amid
          Constant Volatility
        </h1>
        <p className="text-black ml-20 mt-10 mb-10 mr-28 text-lg font-serif">
          As financial markets evolve, traders seek innovative ways to
          capitalize on market opportunities. Deriv, a leading online trading
          platform, offers a unique and exciting feature - trading continuous
          indices. These indices correspond to simulated markets with constant
          volatilities, ranging from 10% to 250%. In this article, we'll explore
          the concept of continuous indices, delve into their advantages and
          disadvantages, and conclude with an encouragement to embrace the
          thrill of taking calculated risks. Continuous indices on Deriv are
          synthetic markets that mimic the behavior of real-world financial
          indices. Unlike traditional markets that open and close, continuous
          indices offer uninterrupted trading 24/7, even during weekends and
          holidays. The unique feature of these indices lies in their fixed
          volatilities, which define the rate of price fluctuations.
        </p>
        <h1 className="text-black ml-20 mb-6 text-3xl font-serif font-bold">
          Advantages of Trading Continuous Indices:
        </h1>
        <ul className="text-black ml-20 mr-20 font-serif">
          {advantages.map((advantage, index) => (
            <li key={index}>
              {index + 1}. {advantage}
            </li>
          ))}
        </ul>
        <h1 className="text-black ml-20 mb-6 mt-6 text-3xl font-serif font-bold">
          Disadvantages of Trading Continuous Indices:
        </h1>
        <ul className="text-black ml-20 mr-20 font-serif">
          {disadvantages.map((advantage, index) => (
            <li key={index}>
              {index + 1}. {advantage}
            </li>
          ))}
        </ul>
        <h1 className="text-black ml-20 mb-6 mt-6 text-3xl font-serif font-bold">
          Why deriv?
        </h1>
        <p className="text-black ml-20 mt-5 mb-10 mr-28 text-lg font-serif">
          Continuous indices on Deriv are simulated markets that mirror the
          behavior of real-world financial indices but with predefined constant
          volatilities. These simulated markets have fixed levels of volatility,
          which means the rate at which prices fluctuate remains constant at
          specific percentages. Deriv offers continuous indices with
          volatilities of 10%, 25%, 50%, 75%, 100%, 150%, and 250%. Volatility,
          in the context of financial markets, refers to the degree of variation
          or dispersion in the price of an asset over time. It is a crucial
          metric that indicates the level of risk associated with an asset or
          market. Generally, higher volatility implies greater price
          fluctuations, leading to increased risk and potential for higher
          returns. The continuous indices offered by Deriv are unique because
          they are not directly tied to real-world market fluctuations. Instead,
          they are synthetic, meaning their prices are derived from mathematical
          models based on real market data and predefined levels of volatility.
          As a result, these continuous indices are available for trading 24/7,
          even during weekends and holidays, making them ideal for traders
          seeking continuous market exposure and opportunities. Let's explore
          the different constant volatilities available for these continuous
          indices:
        </p>
        <ul className="text-black ml-20 mr-20 font-serif">
          {reasons.map((advantage, index) => (
            <li key={index}>
              {index + 1}. {advantage}
            </li>
          ))}
        </ul>
        <p className="text-black ml-20 mt-5 mb-10 mr-28 text-lg font-serif">
          {" "}
          In summary, continuous indices on Deriv with constant volatilities
          provide traders with an opportunity to engage in simulated markets
          that offer continuous trading opportunities. Traders can choose from
          various levels of volatility based on their risk appetite and
          investment objectives. However, it is essential to remember that
          higher volatility comes with increased risk, and traders should always
          practice prudent risk management and trade responsibly.
        </p>

        <h1 className="text-black ml-20 mb-6 mt-6 text-3xl font-serif font-bold">
          Conclusion: Embrace the Thrill of Taking Calculated Risks
        </h1>
        <p className="text-black ml-20 mt-5 mb-10 mr-28 text-lg font-serif">
          Trading continuous indices on Deriv offers a dynamic and rewarding
          experience for traders of all levels. With a wide range of constant
          volatilities to choose from, traders have the opportunity to tailor
          their strategies to suit their risk appetite and objectives. While
          continuous indices offer exciting possibilities, it's essential to
          remember that trading inherently involves risk. By combining
          innovative technology, such as machine learning algorithms, with
          careful analysis and risk management, traders can make informed
          decisions and maximize their potential for success. Trading, like any
          venture, involves risks, but calculated risks, coupled with skill and
          resilience, can lead to significant rewards. As you embark on your
          trading journey with continuous indices, remember to stay informed,
          stay disciplined, and stay curious. Embrace the thrill of taking
          calculated risks, and may your trading adventures be both profitable
          and enriching. Happy trading!
        </p>
        <button onClick={handleButtonChange}>Close</button>
      </Modal>
    </div>
  );
}

export default ModalComponent;
