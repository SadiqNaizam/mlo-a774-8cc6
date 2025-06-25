import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Type definitions for order book data
type Order = [number, number]; // [price, size]
interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

interface OrderBookProps {
  tradingPair?: string;
}

// Initial mock data
const initialData: OrderBookData = {
  bids: [
    [29990.1, 0.5], [29988.5, 1.2], [29985.2, 2.1], [29984.0, 0.8], [29982.7, 3.5],
    [29980.3, 1.1], [29979.9, 0.9], [29978.1, 2.4], [29975.5, 5.0], [29972.0, 1.5],
  ],
  asks: [
    [30000.5, 0.8], [30001.2, 1.5], [30003.8, 2.0], [30004.3, 0.7], [30005.1, 4.2],
    [30007.6, 1.3], [30008.0, 1.0], [30009.4, 2.2], [30010.2, 3.1], [30012.8, 4.5],
  ],
};

const OrderRow = ({ price, size, cumulativeSize, maxCumulativeSize, type }: { price: number; size: number; cumulativeSize: number; maxCumulativeSize: number; type: 'bid' | 'ask' }) => {
  const depthPercentage = maxCumulativeSize > 0 ? (cumulativeSize / maxCumulativeSize) * 100 : 0;
  const priceColor = type === 'bid' ? 'text-green-500' : 'text-red-500';
  const bgColor = type === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className="relative flex justify-between items-center text-xs p-1 font-mono">
      <div
        className={cn("absolute top-0 h-full -z-10", type === 'bid' ? 'right-0' : 'left-0')}
        style={{ width: `${depthPercentage}%`, backgroundColor: bgColor.split('/')[0] + '1A' }} // Using direct color value for safety
      />
      <span className={cn(priceColor, "w-1/3 text-left")}>{price.toFixed(2)}</span>
      <span className="w-1/3 text-right">{size.toFixed(4)}</span>
      <span className="w-1/3 text-right">{(price * size).toFixed(2)}</span>
    </div>
  );
};

const OrderBook: React.FC<OrderBookProps> = ({ tradingPair = "BTC/USD" }) => {
  const [data, setData] = useState<OrderBookData>(initialData);

  useEffect(() => {
    console.log('OrderBook loaded');
    const interval = setInterval(() => {
      setData(prevData => {
        const newBids = [...prevData.bids];
        const newAsks = [...prevData.asks];

        // Simulate a price change
        const bidIndex = Math.floor(Math.random() * newBids.length);
        newBids[bidIndex] = [newBids[bidIndex][0] + (Math.random() - 0.5), newBids[bidIndex][1] * (0.9 + Math.random() * 0.2)];

        const askIndex = Math.floor(Math.random() * newAsks.length);
        newAsks[askIndex] = [newAsks[askIndex][0] + (Math.random() - 0.5), newAsks[askIndex][1] * (0.9 + Math.random() * 0.2)];

        return {
          bids: newBids.sort((a, b) => b[0] - a[0]),
          asks: newAsks.sort((a, b) => a[0] - b[0]),
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const { processedBids, processedAsks, maxCumulativeSize, spread } = useMemo(() => {
    let cumulativeBidSize = 0;
    const processedBids = data.bids.slice(0, 15).map(order => {
      cumulativeBidSize += order[1];
      return { price: order[0], size: order[1], cumulativeSize: cumulativeBidSize };
    });

    let cumulativeAskSize = 0;
    const processedAsks = data.asks.slice(0, 15).map(order => {
      cumulativeAskSize += order[1];
      return { price: order[0], size: order[1], cumulativeSize: cumulativeAskSize };
    });

    const maxCumulativeSize = Math.max(cumulativeBidSize, cumulativeAskSize);
    
    const lowestAsk = data.asks.length > 0 ? data.asks[0][0] : 0;
    const highestBid = data.bids.length > 0 ? data.bids[0][0] : 0;
    const spread = lowestAsk > 0 && highestBid > 0 ? (lowestAsk - highestBid).toFixed(2) : 'N/A';

    return { processedBids, processedAsks, maxCumulativeSize, spread };
  }, [data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
        <CardDescription>{tradingPair}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground font-mono p-1">
          <span className="w-1/3 text-left">Price (USD)</span>
          <span className="w-1/3 text-right">Size (BTC)</span>
          <span className="w-1/3 text-right">Total</span>
        </div>
        <div className="flex-grow space-y-1 overflow-y-auto">
          {processedAsks.slice(0, 15).reverse().map((ask) => (
            <OrderRow key={ask.price} {...ask} maxCumulativeSize={maxCumulativeSize} type="ask" />
          ))}
        </div>
        <div className="text-center font-bold text-lg py-2 border-y">
            Spread: {spread}
        </div>
        <div className="flex-grow space-y-1 overflow-y-auto">
          {processedBids.slice(0, 15).map((bid) => (
            <OrderRow key={bid.price} {...bid} maxCumulativeSize={maxCumulativeSize} type="bid" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;