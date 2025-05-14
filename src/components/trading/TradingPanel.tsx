
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { EXPIRATION_TIMES, DEFAULT_PROFIT_PERCENT } from "@/lib/constants";

interface TradingPanelProps {
  balance: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  selectedExpiration: string;
  onExpirationChange: (expiration: string) => void;
  onPlaceTrade: (direction: "up" | "down") => void;
}

export const TradingPanel = ({
  balance,
  betAmount,
  onBetAmountChange,
  selectedExpiration,
  onExpirationChange,
  onPlaceTrade
}: TradingPanelProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      onBetAmountChange(0);
    } else {
      onBetAmountChange(Math.min(value, balance));
    }
  };

  const setBetPercentage = (percentage: number) => {
    const amount = Math.floor((balance * percentage) / 100);
    onBetAmountChange(amount);
  };

  return (
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
              onChange={handleInputChange}
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
              onValueChange={onExpirationChange}
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
              onClick={() => onPlaceTrade("up")}
              disabled={betAmount <= 0 || betAmount > balance}
            >
              <div className="flex flex-col items-center">
                <Icon name="ArrowUpCircle" className="h-6 w-6 mb-1" />
                <span>ВВЕРХ</span>
              </div>
            </button>
            <button 
              className="trade-btn trade-btn-down"
              onClick={() => onPlaceTrade("down")}
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
  );
};
