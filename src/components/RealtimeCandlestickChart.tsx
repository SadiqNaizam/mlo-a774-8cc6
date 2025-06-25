import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  Legend,
  Brush,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { subDays, format } from 'date-fns';

// --- Data Types ---
interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
}

interface RealtimeCandlestickChartProps {
  tradingPair?: string;
}

// --- Mock Data Generation ---
const generateInitialData = (numPoints = 60): CandleData[] => {
  const data: CandleData[] = [];
  let lastClose = 50000;
  let currentTime = new Date().getTime();

  for (let i = 0; i < numPoints; i++) {
    const open = lastClose + (Math.random() - 0.5) * 50;
    const close = open + (Math.random() - 0.5) * 100;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    const volume = Math.random() * 1000 + 200;
    
    data.unshift({
      time: subDays(currentTime, i).getTime(),
      open,
      high,
      low,
      close,
      volume,
    });
    lastClose = close;
  }
  return data;
};

// --- Helper for Moving Average ---
const calculateSMA = (data: CandleData[], period: number): CandleData[] => {
  return data.map((d, i, arr) => {
    if (i < period - 1) return d;
    const slice = arr.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    return { ...d, ma20: sum / period };
  });
};

// --- Custom Components for Recharts ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg">
        <p className="label font-bold">{format(new Date(label), 'MMM d, yyyy')}</p>
        <p className="text-sm text-green-500">O: {data.open.toFixed(2)}</p>
        <p className="text-sm text-green-500">H: {data.high.toFixed(2)}</p>
        <p className="text-sm text-red-500">L: {data.low.toFixed(2)}</p>
        <p className="text-sm text-blue-500">C: {data.close.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">Vol: {data.volume.toFixed(2)}</p>
        {data.ma20 && <p className="text-sm text-orange-500">MA20: {data.ma20.toFixed(2)}</p>}
      </div>
    );
  }
  return null;
};

const Candle = (props: any) => {
  const { x, y, width, height, open, close, low, high } = props;
  const isGrowing = close >= open;
  const color = isGrowing ? '#22c55e' : '#ef4444'; // green-500 or red-500

  return (
    <g stroke={color} fill={color} strokeWidth="1">
      {/* Wick */}
      <path d={`M ${x + width / 2},${y} L ${x + width / 2},${y + height}`} />
      {/* Body */}
      <rect
        x={x}
        y={isGrowing ? y + (open - low) : y + (close - low)}
        width={width}
        height={Math.abs(open - close)}
        fill={color}
      />
    </g>
  );
};


// --- Main Chart Component ---
const RealtimeCandlestickChart: React.FC<RealtimeCandlestickChartProps> = ({
  tradingPair = 'BTC/USD',
}) => {
  console.log('RealtimeCandlestickChart loaded');
  const [data, setData] = useState<CandleData[]>(generateInitialData());
  const [timeframe, setTimeframe] = useState('1D');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const lastCandle = prevData[prevData.length - 1];
        const newCandle = {
          time: new Date().getTime(),
          open: lastCandle.close,
          high: lastCandle.close * (1 + (Math.random() - 0.48) * 0.01),
          low: lastCandle.close * (1 - (Math.random() - 0.48) * 0.01),
          close: lastCandle.close + (Math.random() - 0.5) * 100,
          volume: Math.random() * 500 + 100,
        };
        // In a real scenario, you'd check if the new candle belongs to the current timeframe's bar or is a new bar.
        // Here we just append for demonstration.
        // Let's replace the last one to simulate a live candle tick
        const updatedData = [...prevData.slice(0, -1), newCandle];
        return updatedData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => calculateSMA(data, 20), [data]);

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{tradingPair} Chart</CardTitle>
            <CardDescription>Interactive chart with real-time price action.</CardDescription>
          </div>
          <ToggleGroup
            type="single"
            defaultValue="1D"
            variant="outline"
            value={timeframe}
            onValueChange={(value) => value && setTimeframe(value)}
            aria-label="Select timeframe"
          >
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1D">1D</ToggleGroupItem>
            <ToggleGroupItem value="4H">4H</ToggleGroupItem>
            <ToggleGroupItem value="1H">1H</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => format(new Date(time), 'MMM d')}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              domain={[0, 'dataMax * 5']}
              ticks={[0]}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            
            <Bar dataKey="close" yAxisId="price" name="Price" shape={<Candle />} />

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="ma20"
              stroke="#f97316" // orange-500
              dot={false}
              name="SMA 20"
            />
            
            <Bar yAxisId="volume" dataKey="volume" fill="#8884d8" barSize={20} name="Volume" />

            <Brush
              dataKey="time"
              height={30}
              stroke="#8884d8"
              tickFormatter={(time) => format(new Date(time), 'MM/dd')}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RealtimeCandlestickChart;