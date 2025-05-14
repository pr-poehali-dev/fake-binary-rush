import { TradingHeader } from "@/components/trading/TradingHeader";
import { AssetChart } from "@/components/trading/AssetChart";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { TradeHistory } from "@/components/trading/TradeHistory";
import { StatisticCards } from "@/components/trading/StatisticCards";
import { useTradingPlatform } from "@/hooks/useTradingPlatform";

export default function TradingPlatform() {
  const {
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
    placeTrade,
  } = useTradingPlatform();

  return (
    <div className="min-h-screen bg-background p-4 dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TradingHeader balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trading Terminal */}
          <div className="lg:col-span-2">
            <AssetChart
              priceHistory={priceHistory}
              currentPrice={currentPrice}
              selectedAsset={selectedAsset}
              onAssetChange={handleAssetChange}
            />
          </div>

          {/* Trading Panel */}
          <div>
            <TradingPanel
              balance={balance}
              betAmount={betAmount}
              onBetAmountChange={setBetAmount}
              selectedExpiration={selectedExpiration}
              onExpirationChange={setSelectedExpiration}
              onPlaceTrade={placeTrade}
            />
          </div>
        </div>

        {/* Trade History */}
        <TradeHistory trades={trades} />

        {/* Statistics */}
        <StatisticCards balance={balance} trades={trades} />
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
