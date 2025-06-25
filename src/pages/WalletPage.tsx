import React from 'react';
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Footer from '@/components/layout/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, QrCode } from 'lucide-react';
import { toast } from "sonner";

// --- Mock Data ---
interface WalletAsset {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  balanceTotal: number;
  balanceAvailable: number;
  depositAddress: string;
}

const walletAssets: WalletAsset[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
    balanceTotal: 0.75,
    balanceAvailable: 0.5,
    depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    balanceTotal: 12.5,
    balanceAvailable: 10.0,
    depositAddress: '0x12B3E14A8F2cE6B5d4d3e3eE7C1f2a3b4c5D6F78',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    balanceTotal: 250,
    balanceAvailable: 250,
    depositAddress: 'SoL11111111111111111111111111111111111111112',
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032',
    balanceTotal: 15000,
    balanceAvailable: 12500,
    depositAddress: '0x98aBcdE2F3aBcDe3f4AbCDE4F5abcDEF56aBcdEf',
  },
];

const WalletPage = () => {
  console.log('WalletPage loaded');

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const handleWithdrawal = () => {
    toast.success("Withdrawal initiated", {
      description: "Your request has been submitted and is being processed.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Total Balance</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">In Order</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={asset.logoUrl} alt={`${asset.name} logo`} />
                            <AvatarFallback>{asset.symbol}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{asset.balanceTotal.toLocaleString(undefined, { minimumFractionDigits: 4 })}</TableCell>
                      <TableCell className="text-right font-mono">{asset.balanceAvailable.toLocaleString(undefined, { minimumFractionDigits: 4 })}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{(asset.balanceTotal - asset.balanceAvailable).toLocaleString(undefined, { minimumFractionDigits: 4 })}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* Deposit Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Deposit</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Deposit {asset.name} ({asset.symbol})</DialogTitle>
                                <DialogDescription>
                                  Only send {asset.symbol} to this address. Sending any other asset may result in the loss of your deposit.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <div className="flex justify-center p-4 bg-muted rounded-md">
                                  <QrCode className="w-32 h-32" />
                                </div>
                                <Label htmlFor="deposit-address">Your {asset.symbol} Deposit Address</Label>
                                <div className="flex items-center gap-2">
                                  <Input id="deposit-address" value={asset.depositAddress} readOnly />
                                  <Button variant="ghost" size="icon" onClick={() => handleCopy(asset.depositAddress)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {/* Withdraw Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Withdraw</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Withdraw {asset.name} ({asset.symbol})</DialogTitle>
                                <DialogDescription>
                                  Available for withdrawal: {asset.balanceAvailable.toLocaleString()} {asset.symbol}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="recipient-address" className="text-right">
                                    Address
                                  </Label>
                                  <Input id="recipient-address" placeholder={`Enter ${asset.symbol} address`} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="amount" className="text-right">
                                    Amount
                                  </Label>
                                  <Input id="amount" type="number" placeholder="0.00" className="col-span-3" />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleWithdrawal}>Submit Withdrawal</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WalletPage;