const tradeType = [
  { value: "DIGITEVEN", label: "DIGITEVEN" },
  { value: "DIGITODD", label: "DIGITODD" },
];

const allVolatitilityOptions = [
  { value: "1HZ100V", label: "R_100(1s)" },
  { value: "R_100", label: "R_100" },
  { value: "R_75", label: "R_75" },
  { value: "1HZ75V", label: "R_75(1s)" },
  { value: "R_50", label: "R_50" },
  { value: "1HZ50V", label: "R_50(1s)" },
  { value: "R_25", label: "R_25" },
  { value: "1HZ25V", label: "R_25(1s)" },
  { value: "R_10", label: "R_10" },
  { value: "1HZ10V", label: "R_10(1s)" },
];

const ticks = [
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
];

const advantages = [
  "Continuous Trading Opportunities: With continuous indices, traders can engage in the market whenever they wish, irrespective of traditional market hours. This flexibility enables them to seize opportunities as they arise and respond to global events impacting prices",
  "Diverse Volatility Options: Deriv provides continuous indices with various constant volatilities, ranging from 10% to 250%. Traders can choose indices that align with their risk appetite and trading strategies.",
  "Realistic Simulated Markets: Continuous indices with 100% volatility closely resemble real-world financial markets. Traders can gain valuable insights and enhance their skills by analyzing and trading in these realistic simulations.",
  "Risk Management: The fixed volatilities of continuous indices allow traders to better assess and manage risk. Traders can size their positions and implement risk management strategies more effectively.",
  "No Market Gaps: Continuous indices eliminate market gaps that often occur during weekends or significant events. This feature ensures smoother trading experiences and reduces the impact of market surprises.",
];

const disadvantages = [
  "Synthetic Nature: Continuous indices are simulated markets, and their prices are derived from mathematical models. While they mirror real-world behaviors, they may not perfectly replicate actual market movements.",
  "Higher Volatility, Higher Risk: As the volatility level increases, so does the risk. Indices with higher volatilities may lead to more substantial gains, but they also expose traders to potential losses.",
  "Influenced by External Factors: Although continuous indices are synthetic, they can still be influenced by external events and global market sentiments.",
  "Complexity for Novice Traders: Constant volatility indices may be more challenging for novice traders to navigate due to their inherent risk and fast-paced movements.",
];

export { tradeType, allVolatitilityOptions, ticks, advantages, disadvantages };
