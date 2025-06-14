
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Receipt, TrendingUp, Calendar, DollarSign, Package, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SalesTransaction {
  id: string;
  transaction_number: string;
  total_amount: number;
  payment_method: string;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
  sales_items: {
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products: {
      name: string;
      description: string;
    };
  }[];
}

interface SalesStats {
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
  currentMonth: number;
  previousYear: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  dailySales: Array<{ date: string; amount: number; transactions: number }>;
  monthlySales: Array<{ month: string; amount: number; transactions: number }>;
}

const SalesHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedTransaction, setSelectedTransaction] = useState<SalesTransaction | null>(null);

  // Fetch sales transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['sales-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select(`
          *,
          sales_items (
            id,
            quantity,
            unit_price,
            total_price,
            products (
              name,
              description
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SalesTransaction[];
    }
  });

  // Fetch sales statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['sales-stats', selectedPeriod],
    queryFn: async () => {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousYear = new Date(now.getFullYear() - 1, 0, 1);
      
      // Get all transactions for calculations
      const { data: allTransactions, error: transError } = await supabase
        .from('sales_transactions')
        .select('id, total_amount, created_at');

      if (transError) throw transError;

      // Get all sales items for product analysis
      const { data: allSalesItems, error: itemsError } = await supabase
        .from('sales_items')
        .select(`
          quantity,
          total_price,
          products (name)
        `);

      if (itemsError) throw itemsError;

      // Calculate totals
      const totalSales = allTransactions.reduce((sum, t) => sum + t.total_amount, 0);
      const transactionCount = allTransactions.length;
      const averageTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;

      // Current month sales
      const currentMonthSales = allTransactions
        .filter(t => new Date(t.created_at) >= currentMonth)
        .reduce((sum, t) => sum + t.total_amount, 0);

      // Previous year sales
      const previousYearSales = allTransactions
        .filter(t => new Date(t.created_at) >= previousYear && new Date(t.created_at) < new Date(now.getFullYear(), 0, 1))
        .reduce((sum, t) => sum + t.total_amount, 0);

      // Top products
      const productMap = new Map();
      allSalesItems.forEach(item => {
        const productName = item.products?.name || 'Unknown';
        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          existing.quantity += item.quantity;
          existing.revenue += item.total_price;
        } else {
          productMap.set(productName, {
            name: productName,
            quantity: item.quantity,
            revenue: item.total_price
          });
        }
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Daily sales for current period
      const periodStart = selectedPeriod === 'week' 
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : selectedPeriod === 'month'
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.getFullYear(), 0, 1);

      const dailySales = [];
      const daysToShow = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayTransactions = allTransactions.filter(t => {
          const transDate = new Date(t.created_at);
          return transDate >= dayStart && transDate <= dayEnd;
        });

        dailySales.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: dayTransactions.reduce((sum, t) => sum + t.total_amount, 0),
          transactions: dayTransactions.length
        });
      }

      return {
        totalSales,
        transactionCount,
        averageTransaction,
        currentMonth: currentMonthSales,
        previousYear: previousYearSales,
        topProducts,
        dailySales,
        monthlySales: [] // Simplified for now
      } as SalesStats;
    }
  });

  const chartConfig = {
    amount: {
      label: "Sales Amount",
      color: "hsl(var(--primary))",
    },
    transactions: {
      label: "Transactions",
      color: "hsl(var(--secondary))",
    },
  };

  if (transactionsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sales History & Analytics</h2>
          <p className="text-muted-foreground">Track your sales performance and trends</p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              size="sm"
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-xl md:text-2xl font-bold">₹{stats?.totalSales?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-xl md:text-2xl font-bold">{stats?.transactionCount || 0}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                <p className="text-xl md:text-2xl font-bold">₹{stats?.averageTransaction?.toFixed(2) || '0.00'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-xl md:text-2xl font-bold">₹{stats?.currentMonth?.toFixed(2) || '0.00'}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Trend ({selectedPeriod})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.dailySales || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--color-amount)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-amount)", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topProducts?.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-8">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions found</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium">{transaction.transaction_number}</p>
                      <Badge variant={transaction.payment_method === 'cash' ? 'default' : 'secondary'}>
                        {transaction.payment_method}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.customer_name && (
                        <span className="mr-4">Customer: {transaction.customer_name}</span>
                      )}
                      <span>{new Date(transaction.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{transaction.total_amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.sales_items.length} item{transaction.sales_items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p><strong>Transaction:</strong> {transaction.transaction_number}</p>
                            <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                            <p><strong>Payment:</strong> {transaction.payment_method}</p>
                            {transaction.customer_name && (
                              <p><strong>Customer:</strong> {transaction.customer_name}</p>
                            )}
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Items</h4>
                            <div className="space-y-2">
                              {transaction.sales_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <div>
                                    <p className="font-medium">{item.products.name}</p>
                                    <p className="text-muted-foreground">
                                      {item.quantity} × ₹{item.unit_price}
                                    </p>
                                  </div>
                                  <p className="font-medium">₹{item.total_price.toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total:</span>
                              <span>₹{transaction.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesHistory;
