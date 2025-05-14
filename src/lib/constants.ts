
// Финансовые константы
export const DEFAULT_BALANCE = 10000;
export const DEFAULT_BET = 100;
export const DEFAULT_PROFIT_PERCENT = 85;

// Время экспирации
export const EXPIRATION_TIMES = [
  { value: "30", label: "30 сек" },
  { value: "60", label: "1 мин" },
  { value: "180", label: "3 мин" },
  { value: "300", label: "5 мин" },
  { value: "600", label: "10 мин" },
];

// Доступные активы
export const ASSETS = [
  { id: "BTC/USD", name: "Bitcoin", type: "crypto", icon: "Bitcoin" },
  { id: "ETH/USD", name: "Ethereum", type: "crypto", icon: "Wallet" },
  { id: "EUR/USD", name: "EUR/USD", type: "forex", icon: "Euro" },
  { id: "AAPL", name: "Apple", type: "stock", icon: "Apple" },
  { id: "TSLA", name: "Tesla", type: "stock", icon: "Car" },
];
