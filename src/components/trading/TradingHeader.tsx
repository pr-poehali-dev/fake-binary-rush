
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface TradingHeaderProps {
  balance: number;
}

export const TradingHeader = ({ balance }: TradingHeaderProps) => {
  return (
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
  );
};
