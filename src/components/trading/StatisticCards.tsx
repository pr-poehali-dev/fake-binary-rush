
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Trade } from "@/types/trading";

interface StatisticCardsProps {
  balance: number;
  trades: Trade[];
}

export const StatisticCards = ({ balance, trades }: StatisticCardsProps) => {
  const totalWins = trades.filter(t => t.status === 'win').length;
  const totalProfit = trades.reduce((acc, trade) => 
    acc + (trade.status === 'win' ? trade.profit : 0), 0
  );

  return (
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
        <div className="stat-value text-success">{totalWins}</div>
      </Card>
      <Card className="stat-card dark:bg-dark-card">
        <div className="stat-label">Прибыль</div>
        <div className="stat-value text-success">
          {formatCurrency(totalProfit)}
        </div>
      </Card>
    </div>
  );
};
