
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PricePoint {
  time: Date;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const prices = data.map(point => point.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const padding = (max - min) * 0.1; // 10% padding
      
      setMinValue(min - padding);
      setMaxValue(max + padding);
      
      const newPrice = data[data.length - 1].price;
      const prevPrice = data.length > 1 ? data[data.length - 2].price : newPrice;
      
      setCurrentPrice(newPrice);
      setTrend(newPrice > prevPrice ? 'up' : newPrice < prevPrice ? 'down' : trend);
    }
  }, [data, trend]);

  // Format X-axis tick (time)
  const formatXAxis = (time: Date) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border shadow-lg rounded-md p-2">
          <p className="text-sm font-medium">{`Цена: ${formatCurrency(payload[0].value, true)}`}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(payload[0].payload.time).toLocaleTimeString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            tickFormatter={formatXAxis}
            stroke="#888"
            minTickGap={50}
          />
          <YAxis 
            domain={[minValue, maxValue]}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => formatCurrency(value, true)}
            stroke="#888"
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={currentPrice} 
            stroke={trend === 'up' ? "#00C853" : trend === 'down' ? "#FF3B30" : "#888"} 
            strokeDasharray="3 3" 
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#1E9BF4" 
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
