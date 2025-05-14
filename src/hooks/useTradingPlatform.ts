
import { useState, useEffect, useRef } from "react";
import { PricePoint, Trade, Asset } from "@/types/trading";
import { generatePriceData, generateRandomPrice } from "@/lib/price-generator";
import { ASSETS, DEFAULT_BALANCE, DEFAULT_BET, DEFAULT_PROFIT_PERCENT, EXPIRATION_TIMES } from "@/lib/constants";

export const useTradingPlatform = () => {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState(() => generatePriceData(50));
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [selectedExpiration, setSelectedExpiration] = useState(EXPIRATION_TIMES[0].value);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update price in real-time
  useEffect(() => {
    const updatePrice = () => {
      const newPrice = generateRandomPrice(priceHistory[priceHistory.length - 1].price);
      setCurrentPrice(newPrice);
      setPriceHistory(prev => {
        const newData = [...prev, { time: new Date(), price: newPrice }];
        if (newData.length > 100) newData.shift();
        return newData;
      });
    };

    updatePrice();
    const interval = setInterval(updatePrice, 1000);
    return () => clearInterval(interval);
  }, [priceHistory]);

  // Process trades
  useEffect(() => {
    const processTrades = () => {
      setTrades(prevTrades => 
        prevTrades.map(trade => {
          if (trade.status !== "active") return trade;
          
          const tradeTime = new Date(trade.time).getTime();
          const expirationTime = tradeTime + (parseInt(trade.expiration) * 1000);
          
          if (Date.now() >= expirationTime) {
            // Always win
            const profit = (trade.amount * DEFAULT_PROFIT_PERCENT) / 100;
            setBalance(prev => prev + trade.amount + profit);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            
            return { ...trade, status: "win", profit };
          }
          
          return trade;
        })
      );
    };

    const interval = setInterval(processTrades, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAssetChange = (assetId: string) => {
    setSelectedAsset(ASSETS.find(a => a.id === assetId) || ASSETS[0]);
  };

  const placeTrade = (direction: "up" | "down") => {
    if (betAmount <= 0 || betAmount > balance) return;

    // Deduct bet amount from balance
    setBalance(prev => prev - betAmount);

    // Create new trade
    const newTrade: Trade = {
      id: Date.now().toString(),
      asset: selectedAsset.id,
      direction,
      amount: betAmount,
      profit: 0,
      time: new Date(),
      expiration: selectedExpiration,
      status: "active",
    };

    setTrades(prev => [newTrade, ...prev]);

    // Set a timer to close the trade (with a guaranteed win)
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      const profitAmount = (betAmount * DEFAULT_PROFIT_PERCENT) / 100;
      setTrades(prev => 
        prev.map(trade => 
          trade.id === newTrade.id 
            ? { ...trade, status: "win", profit: profitAmount } 
            : trade
        )
      );
      setBalance(prev => prev + betAmount + profitAmount);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, parseInt(selectedExpiration) * 1000);
  };

  return {
    balance,
    betAmount,
    setBetAmount,
    currentPrice,
    priceHistory,
    selectedAsset,
    handleAssetChange,
    selectedExpiration,
    setSelectedExpiration,
    trades,
    showConfetti,
    placeTrade
  };
};
