import React, { useState } from "react";
import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

import BuySellComponent from "./BuySellComponent";
import PredictionComponent from "./PredictionComponent";
import LiveData from "./LiveData";

const MainComponent = ({ authorizationToken }) => {
  const [volatilityOption, setVolatilityOption] = useState("1HZ100V");
  const volatilityOptionSelected = (selected) => {
    setVolatilityOption(selected);
  };

  return (
    <div className="flex w-full">
      <BuySellComponent
        authorizationToken={authorizationToken}
        onSaveVolatility={volatilityOptionSelected}
        volatilityOption={volatilityOption}
      />
      <LiveData
        key={volatilityOption} // Add key prop based on volatilityOption
        authorizationToken={authorizationToken}
        volatilityOption={volatilityOption}
      />
      <PredictionComponent
        authorizationToken={authorizationToken}
        volatilityOption={volatilityOption}
      />
    </div>
  );
};

export default MainComponent;
