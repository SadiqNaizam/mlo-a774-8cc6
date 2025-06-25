import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Define the shape of a single trade
interface Trade {
  id: number;
  time: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

// Function to generate a new mock trade
const generateMockTrade = (lastPrice: number): Trade => {
  const type = Math.random() > 0.5 ? 'buy' : 'sell';
  const priceChange = (Math.random() - 0.5) * 50; // Small random price fluctuation
  const newPrice = Math.max(20000, lastPrice + priceChange); // Ensure price doesn't go below a certain point
  const amount = Math.random() * 0.5; // Random amount up to 0.5 BTC
  
  return {
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    price: newPrice,
    amount: amount,
    type,
  };
};

const RecentTradesList: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(60000); // Starting price for mock data

  console.log('RecentTradesList loaded');

  useEffect(() => {
    // Initial data load
    const initialTrades: Trade[] = Array.from({ length: 20 }).map(() => {
      const newTrade = generateMockTrade(lastPrice);
      setLastPrice(newTrade.price);
      return newTrade;
    }).sort((a, b) => b.id - a.id); // sort by time desc
    setTrades(initialTrades);
    
    // Simulate live updates
    const interval = setInterval(() => {
      const newTrade = generateMockTrade(lastPrice);
      setLastPrice(newTrade.price);
      setTrades((prevTrades) => [newTrade, ...prevTrades.slice(0, 49)]); // Keep a max of 50 trades
    }, 1500); // Add a new trade every 1.5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[300px] md:h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">Amount (BTC)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {trade.time}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      trade.type === 'buy' ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {trade.amount.toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentTradesList;