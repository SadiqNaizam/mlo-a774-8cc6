import React from 'react';

// Layout Components
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Footer from '@/components/layout/Footer';

// Page-specific Custom Components
import RealtimeCandlestickChart from '@/components/RealtimeCandlestickChart';
import OrderBook from '@/components/OrderBook';
import RecentTradesList from '@/components/RecentTradesList';
import TradeExecutionForm from '@/components/TradeExecutionForm';

// shadcn/ui Components for layout and data display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for the Open Orders table, as per the user journey
const openOrders = [
  { id: '1', pair: 'BTC/USDT', type: 'Buy', orderType: 'Limit', price: 64500.00, amount: 0.05, total: 3225.00, status: 'Open' },
  { id: '2', pair: 'ETH/USDT', type: 'Sell', orderType: 'Limit', price: 3500.00, amount: 1.2, total: 4200.00, status: 'Open' },
  { id: '3', pair: 'SOL/USDT', type: 'Buy', orderType: 'Limit', price: 150.50, amount: 10, total: 1505.00, status: 'Open' },
];

const orderHistory = [
    { id: '4', pair: 'BTC/USDT', type: 'Buy', orderType: 'Market', price: 65100.2, amount: 0.1, total: 6510.02, status: 'Filled' },
    { id: '5', pair: 'DOGE/USDT', type: 'Sell', orderType: 'Limit', price: 0.18, amount: 10000, total: 1800.00, status: 'Cancelled' },
];


const TradingPage = () => {
  console.log('TradingPage loaded');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <LeftSidebar />

        <main className="flex-1 flex flex-col p-2 sm:p-4 gap-4 overflow-hidden">
          {/* Main trading grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-hidden">
            
            {/* Left/Main Column */}
            <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4">
              <div className="flex-grow min-h-[400px]">
                <RealtimeCandlestickChart tradingPair="BTC/USDT" />
              </div>

              <div className="h-[350px] lg:h-auto">
                <Card className="h-full">
                  <Tabs defaultValue="open-orders" className="h-full flex flex-col">
                    <TabsList className="mx-4 mt-4">
                      <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
                      <TabsTrigger value="order-history">Order History</TabsTrigger>
                      <TabsTrigger value="trade-history">Trade History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="open-orders" className="flex-grow p-0 overflow-y-auto">
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pair</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {openOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.pair}</TableCell>
                              <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.type}</TableCell>
                              <TableCell>{order.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{order.amount}</TableCell>
                              <TableCell className="text-right">{order.total.toFixed(2)}</TableCell>
                              <TableCell className="text-center"><Badge variant="secondary">{order.status}</Badge></TableCell>
                              <TableCell className="text-right"><Button variant="destructive" size="sm">Cancel</Button></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    <TabsContent value="order-history" className="flex-grow p-0 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pair</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderHistory.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.pair}</TableCell>
                                    <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.type}</TableCell>
                                    <TableCell>{order.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{order.amount}</TableCell>
                                    <TableCell className="text-right">{order.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={order.status === 'Filled' ? 'default' : 'destructive'}>{order.status}</Badge>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    
                    <TabsContent value="trade-history" className="flex-grow p-0 overflow-hidden">
                      <RecentTradesList />
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-4">
              <div className="flex-1 min-h-[300px] h-[50vh] lg:h-auto">
                <OrderBook />
              </div>
              <div className="flex-1">
                <TradeExecutionForm />
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TradingPage;