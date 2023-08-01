import React, { useState } from "react";
import Modal from "react-modal";
import { advantages, disadvantages } from "./functions/data";

function ModalComponent() {
  const [modalState, setModalState] = useState(true);
  const handleButtonChange = () => {
    if (modalState == true) {
      setModalState(false);
    }
  };
  return (
    <div>
      <Modal isOpen={modalState} appElement={document.getElementById("root")}>
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

        <button onClick={handleButtonChange}>Close Modal</button>
      </Modal>
    </div>
  );
}

export default ModalComponent;
