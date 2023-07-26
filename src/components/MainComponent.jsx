import React, { useState, useEffect, useRef } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

import BuySellComponent from "./BuySellComponent";
import PredictionComponent from "./PredictionComponent";
import LiveData from "./LiveData";

const MainComponent = ({ authorizationToken }) => {
  const app_id = 36942;
  const connection = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
  );
  const api = new DerivAPIBasic({ connection });
  return (
    <div className="flex w-full">
      <BuySellComponent authorizationToken={authorizationToken} />
      <LiveData authorizationToken={authorizationToken} />
      <PredictionComponent authorizationToken={authorizationToken} />
    </div>
  );
};

export default MainComponent;
