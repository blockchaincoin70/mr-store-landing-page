
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Plus, Minus, X, CreditCard, Banknote } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

interface ProductInventory {
  id: string;
  product_id: string;
  stock_quantity: number;
  selling_price: number;
  cost_price?: number;
  products: Product;
}

interface CartItem extends ProductInventory {
  cartQuantity: number;
}

interface POSSystemProps {
  user: any;
}

const POSSystem = ({ user }: POSSystemProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products with inventory
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['pos-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_inventory')
        .select(`
          *,
          products (
            id,
            name,
            description,
            image_url
          )
        `)
        .gt('stock_quantity', 0);

      if (error) throw error;
      return data as ProductInventory[];
    }
  });

  // Process sale mutation
  const processSaleMutation = useMutation({
    mutationFn: async () => {
      if (cart.length === 0) throw new Error('Cart is empty');

      const totalAmount = cart.reduce((sum, item) => 
        sum + (item.selling_price * item.cartQuantity), 0);

      // Create transaction
      const { data: transaction, error: transError } = await supabase
        .from('sales_transactions')
        .insert({
          transaction_number: `TXN-${Date.now()}`, // Simplified for now
          total_amount: totalAmount,
          payment_method: paymentMethod,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          created_by: user.id
        })
        .select()
        .single();

      if (transError) throw transError;

      // Create sale items
      const saleItems = cart.map(item => ({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity: item.cartQuantity,
        unit_price: item.selling_price,
        total_price: item.selling_price * item.cartQuantity
      }));

      const { error: itemsError } = await supabase
        .from('sales_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update inventory
      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('product_inventory')
          .update({
            stock_quantity: item.stock_quantity - item.cartQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      return transaction;
    },
    onSuccess: () => {
      toast({
        title: "Sale Completed",
        description: "Transaction processed successfully",
      });
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      queryClient.invalidateQueries({ queryKey: ['pos-inventory'] });
    },
    onError: (error) => {
      toast({
        title: "Sale Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const addToCart = (product: ProductInventory) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.cartQuantity < product.stock_quantity) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Stock Limit",
          description: "Cannot add more items than available in stock",
          variant: "destructive",
        });
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      const item = cart.find(item => item.id === productId);
      if (item && newQuantity <= item.stock_quantity) {
        setCart(cart.map(item =>
          item.id === productId
            ? { ...item, cartQuantity: newQuantity }
            : item
        ));
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const filteredInventory = inventory.filter(item =>
    item.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => 
    sum + (item.selling_price * item.cartQuantity), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading POS system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-200px)]">
      {/* Products Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 max-h-[600px] overflow-y-auto">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3 md:p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm md:text-base line-clamp-2">
                      {item.products.name}
                    </h3>
                    <Badge variant={item.stock_quantity > 10 ? "default" : "destructive"} className="text-xs">
                      {item.stock_quantity}
                    </Badge>
                  </div>
                  
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {item.products.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-primary">
                      ₹{item.selling_price}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={item.stock_quantity === 0}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="space-y-4">
        <Card className="h-fit max-h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Cart Items */}
            <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Cart is empty
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.products.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.selling_price} each</p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm">{item.cartQuantity}</span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                        disabled={item.cartQuantity >= item.stock_quantity}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Info */}
            <div className="space-y-2 border-t pt-4">
              <Input
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Customer phone (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Method</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex-1"
                >
                  <Banknote className="h-4 w-4 mr-1" />
                  Cash
                </Button>
                <Button
                  size="sm"
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Card
                </Button>
              </div>
            </div>

            {/* Total & Checkout */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full"
                size="lg"
                onClick={() => processSaleMutation.mutate()}
                disabled={cart.length === 0 || processSaleMutation.isPending}
              >
                {processSaleMutation.isPending ? 'Processing...' : 'Complete Sale'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POSSystem;
