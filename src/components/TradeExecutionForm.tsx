import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TradeExecutionFormProps {
  asset?: string;
  quoteAsset?: string;
  userAssetBalance?: number;
  userQuoteBalance?: number;
  currentMarketPrice?: number;
}

const TradeExecutionForm: React.FC<TradeExecutionFormProps> = ({
  asset = "BTC",
  quoteAsset = "USDT",
  userAssetBalance = 0.5,
  userQuoteBalance = 50000,
  currentMarketPrice = 65000,
}) => {
  console.log('TradeExecutionForm loaded');

  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderMode, setOrderMode] = useState<'limit' | 'market'>('limit');
  
  const [price, setPrice] = useState<string>(currentMarketPrice.toString());
  const [amount, setAmount] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  
  const relevantBalance = useMemo(() => {
    return orderType === 'buy' ? userQuoteBalance : userAssetBalance;
  }, [orderType, userAssetBalance, userQuoteBalance]);

  const balanceUnit = useMemo(() => {
    return orderType === 'buy' ? quoteAsset : asset;
  }, [orderType, asset, quoteAsset]);

  useEffect(() => {
    if (orderMode === 'market') {
      setPrice(currentMarketPrice.toString());
      // For market buys, user specifies total to spend. For sells, user specifies amount to sell.
      if (orderType === 'buy' && total) {
        const numericTotal = parseFloat(total);
        if (!isNaN(numericTotal) && currentMarketPrice > 0) {
          setAmount((numericTotal / currentMarketPrice).toFixed(8));
        }
      }
    } else {
        // Recalculate if switching back to limit
        const numericPrice = parseFloat(price) || 0;
        const numericAmount = parseFloat(amount) || 0;
        if (numericPrice > 0 && numericAmount > 0) {
            setTotal((numericPrice * numericAmount).toFixed(2));
        }
    }
  }, [orderMode, currentMarketPrice, orderType, total, amount, price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    const numericPrice = parseFloat(value);
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericPrice) && !isNaN(numericAmount) && numericPrice > 0) {
      setTotal((numericPrice * numericAmount).toFixed(2));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const numericAmount = parseFloat(value);
    const effectivePrice = parseFloat(orderMode === 'market' ? currentMarketPrice.toString() : price);
    if (!isNaN(numericAmount) && !isNaN(effectivePrice) && effectivePrice > 0) {
      setTotal((effectivePrice * numericAmount).toFixed(2));
    }
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTotal(value);
    // This is primarily for market buy orders
    if (orderMode === 'market' && orderType === 'buy') {
        const numericTotal = parseFloat(value);
        if (!isNaN(numericTotal) && currentMarketPrice > 0) {
            setAmount((numericTotal / currentMarketPrice).toFixed(8));
        }
    }
  };

  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    if (orderType === 'sell') {
      const newAmount = (userAssetBalance * percentage / 100).toFixed(8);
      setAmount(newAmount);
      const effectivePrice = parseFloat(orderMode === 'market' ? currentMarketPrice.toString() : price);
      if (!isNaN(effectivePrice) && effectivePrice > 0) {
        setTotal((effectivePrice * parseFloat(newAmount)).toFixed(2));
      }
    } else { // buy
      const newTotal = (userQuoteBalance * percentage / 100).toFixed(2);
      setTotal(newTotal);
      const effectivePrice = parseFloat(orderMode === 'market' ? currentMarketPrice.toString() : price);
      if (!isNaN(effectivePrice) && effectivePrice > 0) {
        setAmount((parseFloat(newTotal) / effectivePrice).toFixed(8));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${orderMode.charAt(0).toUpperCase() + orderMode.slice(1)} ${orderType} order placed!`, {
      description: `Order to ${orderType} ${amount} ${asset} ${orderMode === 'limit' ? `@ ${price} ${quoteAsset}` : 'at market price'}.`,
    });
    // Reset form
    setAmount('');
    setTotal('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <ToggleGroup type="single" value={orderType} onValueChange={(value: 'buy' | 'sell') => { if (value) setOrderType(value) }} className="grid grid-cols-2">
          <ToggleGroupItem value="buy" aria-label="Buy" className="data-[state=on]:bg-green-100 dark:data-[state=on]:bg-green-900 data-[state=on]:text-green-700 dark:data-[state=on]:text-green-300">Buy</ToggleGroupItem>
          <ToggleGroupItem value="sell" aria-label="Sell" className="data-[state=on]:bg-red-100 dark:data-[state=on]:bg-red-900 data-[state=on]:text-red-700 dark:data-[state=on]:text-red-300">Sell</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent asChild>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ToggleGroup type="single" value={orderMode} onValueChange={(value: 'limit' | 'market') => { if (value) setOrderMode(value) }} className="w-full flex">
              <ToggleGroupItem value="limit" className="text-xs flex-1">Limit</ToggleGroupItem>
              <ToggleGroupItem value="market" className="text-xs flex-1">Market</ToggleGroupItem>
          </ToggleGroup>

          <div className="space-y-2">
            <Label htmlFor="price">Price ({quoteAsset})</Label>
            <Input id="price" type="number" placeholder="0.00" value={orderMode === 'market' ? 'Market Price' : price} onChange={handlePriceChange} disabled={orderMode === 'market'} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({asset})</Label>
            <Input id="amount" type="number" placeholder="0.00000000" value={amount} onChange={handleAmountChange} disabled={orderMode === 'market' && orderType === 'buy'} />
          </div>

          <div className="space-y-2">
            <Slider defaultValue={[0]} max={100} step={1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total">Total ({quoteAsset})</Label>
            <Input id="total" type="number" placeholder="0.00" value={total} onChange={handleTotalChange} />
          </div>
          
          <p className="text-xs text-muted-foreground pt-1">
            Available: {relevantBalance.toFixed(4)} {balanceUnit}
          </p>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          className={cn(
            "w-full",
            orderType === 'buy' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
          )}
        >
          {orderType === 'buy' ? `Buy ${asset}` : `Sell ${asset}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TradeExecutionForm;