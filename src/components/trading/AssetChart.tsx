
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { PriceChart } from "@/components/PriceChart";
import { formatCurrency } from "@/lib/utils";
import { PricePoint, Asset } from "@/types/trading";
import { ASSETS } from "@/lib/constants";

interface AssetChartProps {
  priceHistory: PricePoint[];
  currentPrice: number;
  selectedAsset: Asset;
  onAssetChange: (assetId: string) => void;
}

export const AssetChart = ({
  priceHistory,
  currentPrice,
  selectedAsset,
  onAssetChange
}: AssetChartProps) => {
  return (
    <Card className="dark:bg-dark-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select 
              value={selectedAsset.id} 
              onValueChange={onAssetChange}
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
            <h2 className="text-xl tracking-wide font-mono">
              {formatCurrency(currentPrice, true)}
            </h2>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <PriceChart data={priceHistory} />
        </div>
      </CardContent>
    </Card>
  );
};
