import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Footer from '@/components/layout/Footer';

// Custom UI Components
import AssetSummaryCard from '@/components/AssetSummaryCard';

// shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';

// Placeholder data for the user's assets
const userAssets = [
  {
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.75,
    price: 65432.1,
    change24h: 1.25,
  },
  {
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 10.2,
    price: 3510.45,
    change24h: -0.88,
  },
  {
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    name: 'Solana',
    symbol: 'SOL',
    balance: 150.5,
    price: 165.78,
    change24h: 3.41,
  },
  {
    logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=032',
    name: 'Cardano',
    symbol: 'ADA',
    balance: 25000,
    price: 0.45,
    change24h: -2.15,
  },
];

const DashboardPage = () => {
  console.log('DashboardPage loaded');

  const totalPortfolioValue = userAssets.reduce((acc, asset) => acc + asset.balance * asset.price, 0);
  const total24hChange = userAssets.reduce((acc, asset) => acc + (asset.balance * asset.price * (asset.change24h / 100)), 0);
  const total24hChangePercentage = (total24hChange / (totalPortfolioValue - total24hChange)) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 container mx-auto">
        <LeftSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="space-y-8">
            {/* Main Portfolio Summary Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold">My Portfolio</CardTitle>
                  <CardDescription>Welcome back, here's your portfolio overview.</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button asChild>
                    <Link to="/trading"> {/* Route from App.tsx */}
                      Trade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPortfolioValue)}
                </div>
                <p className={`text-sm ${total24hChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {total24hChange >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total24hChange)}
                  ({total24hChangePercentage.toFixed(2)}%) Today
                </p>
              </CardContent>
            </Card>

            {/* Asset List Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userAssets.map((asset) => (
                  <AssetSummaryCard
                    key={asset.symbol}
                    logoUrl={asset.logoUrl}
                    name={asset.name}
                    symbol={asset.symbol}
                    balance={asset.balance}
                    price={asset.price}
                    change24h={asset.change24h}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;