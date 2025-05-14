
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { PriceChart } from "@/components/PriceChart";
import { generatePriceData, generateRandomPrice } from "@/lib/price-generator";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_BALANCE = 10000;
const DEFAULT_BET = 100;
const DEFAULT_PROFIT_PERCENT = 85;

const EXPIRATION_TIMES = [
  { value: "30", label: "30 сек" },
  { value: "60", label: "1 мин" },
  { value: "180", label: "3 мин" },
  { value: "300", label: "5 мин" },
  { value: "600", label: "10 мин" },
];

const ASSETS = [
  { id: "BTC/USD", name: "Bitcoin", type: "crypto", icon: "Bitcoin" },
  { id: "ETH/USD", name: "Ethereum", type: "crypto", icon: "Wallet" },
  { id: "EUR/USD", name: "EUR/USD", type: "forex", icon: "Euro" },
  { id: "AAPL", name: "Apple", type: "stock", icon: "Apple" },
  { id: "TSLA", name: "Tesla", type: "stock", icon: "Car" },
];

interface Trade {
  id: string;
  asset: string;
  direction: "up" | "down";
  amount: number;
  profit: number;
  time: Date;
  expiration: string;
  status: "active" | "win" | "lose";
}

export default function TradingPlatform() {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState(() => generatePriceData(50));
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
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

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setBetAmount(0);
    } else {
      setBetAmount(Math.min(value, balance));
    }
  };

  const setBetPercentage = (percentage: number) => {
    const amount = Math.floor((balance * percentage) / 100);
    setBetAmount(amount);
  };

  return (
    <div className="min-h-screen bg-background p-4 dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-md">
              <Icon name="BarChart" className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">БИНАРИУМ</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary flex items-center">
              <Icon name="CircleDollarSign" className="mr-1 h-4 w-4" />
              <span className="font-bold">{formatCurrency(balance)}</span>
            </Badge>
            <Button variant="outline" size="sm">
              <Icon name="User" className="mr-2 h-4 w-4" />
              Демо-аккаунт
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trading Terminal */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-dark-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedAsset.id} 
                      onValueChange={(value) => setSelectedAsset(ASSETS.find(a => a.id === value) || ASSETS[0])}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Выберите актив" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSETS.map(asset => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center gap-2">
                              <Icon name={asset.icon} className="h-4 w-4" />
                              <span>{asset.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge 
                      variant="outline" 
                      className={`asset-badge ${
                        selectedAsset.type === "crypto" 
                          ? "asset-badge-crypto" 
                          : selectedAsset.type === "forex" 
                          ? "asset-badge-forex" 
                          : "asset-badge-stock"
                      }`}
                    >
                      {selectedAsset.type === "crypto" ? "Криптовалюта" : 
                       selectedAsset.type === "forex" ? "Форекс" : "Акции"}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl tracking-wide font-mono">
                      {formatCurrency(currentPrice, true)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <PriceChart data={priceHistory} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div>
            <Card className="dark:bg-dark-card">
              <CardHeader>
                <CardTitle>Торговля</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Сумма инвестиции</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={handleBetAmountChange}
                      min={10}
                      max={balance}
                      className="mb-2"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map(percent => (
                        <Button 
                          key={percent}
                          variant="outline" 
                          size="sm"
                          onClick={() => setBetPercentage(percent)}
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Время экспирации</label>
                    <Select 
                      value={selectedExpiration}
                      onValueChange={setSelectedExpiration}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPIRATION_TIMES.map(time => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Доходность</label>
                    <div className="bg-primary/10 text-primary rounded-md p-2 text-center font-medium">
                      {DEFAULT_PROFIT_PERCENT}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button 
                      className="trade-btn trade-btn-up"
                      onClick={() => placeTrade("up")}
                      disabled={betAmount <= 0 || betAmount > balance}
                    >
                      <div className="flex flex-col items-center">
                        <Icon name="ArrowUpCircle" className="h-6 w-6 mb-1" />
                        <span>ВВЕРХ</span>
                      </div>
                    </button>
                    <button 
                      className="trade-btn trade-btn-down"
                      onClick={() => placeTrade("down")}
                      disabled={betAmount <= 0 || betAmount > balance}
                    >
                      <div className="flex flex-col items-center">
                        <Icon name="ArrowDownCircle" className="h-6 w-6 mb-1" />
                        <span>ВНИЗ</span>
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trade History */}
        <Card className="mt-4 dark:bg-dark-card">
          <CardHeader>
            <CardTitle>История сделок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="pb-2 font-medium">Актив</th>
                    <th className="pb-2 font-medium">Тип</th>
                    <th className="pb-2 font-medium">Сумма</th>
                    <th className="pb-2 font-medium">Время</th>
                    <th className="pb-2 font-medium">Экспирация</th>
                    <th className="pb-2 font-medium">Статус</th>
                    <th className="pb-2 font-medium">Прибыль</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-muted-foreground">
                        Нет активных сделок. Разместите свою первую сделку!
                      </td>
                    </tr>
                  ) : (
                    trades.map(trade => (
                      <tr key={trade.id} className="border-b last:border-0">
                        <td className="py-3">{trade.asset}</td>
                        <td className="py-3">
                          <div className={`inline-flex items-center ${trade.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                            <Icon 
                              name={trade.direction === 'up' ? 'ArrowUpCircle' : 'ArrowDownCircle'} 
                              className="h-4 w-4 mr-1" 
                            />
                            {trade.direction === 'up' ? 'Вверх' : 'Вниз'}
                          </div>
                        </td>
                        <td className="py-3">{formatCurrency(trade.amount)}</td>
                        <td className="py-3">{new Date(trade.time).toLocaleTimeString()}</td>
                        <td className="py-3">
                          {EXPIRATION_TIMES.find(t => t.value === trade.expiration)?.label || trade.expiration + 'с'}
                        </td>
                        <td className="py-3">
                          {trade.status === 'active' ? (
                            <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
                              Активна
                            </Badge>
                          ) : trade.status === 'win' ? (
                            <Badge className="trade-result trade-result-win">
                              Выигрыш
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Проигрыш
                            </Badge>
                          )}
                        </td>
                        <td className="py-3">
                          {trade.status === 'active' ? (
                            '-'
                          ) : trade.status === 'win' ? (
                            <span className="text-success font-medium">
                              +{formatCurrency(trade.profit)}
                            </span>
                          ) : (
                            <span className="text-danger font-medium">
                              -{formatCurrency(trade.amount)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card className="stat-card dark:bg-dark-card">
            <div className="stat-label">Баланс</div>
            <div className="stat-value text-primary">{formatCurrency(balance)}</div>
          </Card>
          <Card className="stat-card dark:bg-dark-card">
            <div className="stat-label">Сделок</div>
            <div className="stat-value">{trades.length}</div>
          </Card>
          <Card className="stat-card dark:bg-dark-card">
            <div className="stat-label">Выигрышных</div>
            <div className="stat-value text-success">{trades.filter(t => t.status === 'win').length}</div>
          </Card>
          <Card className="stat-card dark:bg-dark-card">
            <div className="stat-label">Прибыль</div>
            <div className="stat-value text-success">
              {formatCurrency(trades.reduce((acc, trade) => acc + (trade.status === 'win' ? trade.profit : 0), 0))}
            </div>
          </Card>
        </div>
      </div>

      {/* Success confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-success/5 animate-pulse-success"></div>
        </div>
      )}
    </div>
  );
}
