
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { formatCurrency } from "@/lib/utils";
import { Trade } from "@/types/trading";
import { EXPIRATION_TIMES } from "@/lib/constants";

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory = ({ trades }: TradeHistoryProps) => {
  return (
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
  );
};
