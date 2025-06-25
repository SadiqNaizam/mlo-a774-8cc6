import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AssetSummaryCardProps {
  logoUrl: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  change24h: number;
}

const AssetSummaryCard: React.FC<AssetSummaryCardProps> = ({
  logoUrl,
  name,
  symbol,
  balance,
  price,
  change24h,
}) => {
  console.log(`AssetSummaryCard loaded for: ${name}`);

  const isPositiveChange = change24h >= 0;
  const balanceValue = balance * price;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="w-full max-w-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={logoUrl} alt={`${name} logo`} />
            <AvatarFallback>{symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-bold">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div 
          className={`flex items-center text-sm font-semibold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}
        >
          {isPositiveChange ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{Math.abs(change24h).toFixed(2)}%</span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 pt-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Your Balance</span>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatCurrency(balanceValue)}</p>
            <p className="text-sm text-muted-foreground">{`${balance.toLocaleString()} ${symbol}`}</p>
          </div>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <p className="text-lg font-semibold">{formatCurrency(price)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetSummaryCard;