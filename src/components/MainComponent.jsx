import React, { useState, useEffect, useRef } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

import BuySellComponent from "./BuySellComponent";
import PredictionComponent from "./PredictionComponent";
import LiveData from "./LiveData";

const MainComponent = () => {
  return (
    <div className="flex w-full">
      <BuySellComponent />
      <LiveData />
      <PredictionComponent />
    </div>
  );
};

export default MainComponent;
