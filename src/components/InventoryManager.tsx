
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Edit, Plus, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  reorder_level: number;
  products: Product;
}

const InventoryManager = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    stock_quantity: 0,
    selling_price: 0,
    cost_price: 0,
    reorder_level: 5
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory with products
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory-management'],
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductInventory[];
    }
  });

  // Fetch products without inventory
  const { data: productsWithoutInventory = [] } = useQuery({
    queryKey: ['products-without-inventory'],
    queryFn: async () => {
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const { data: inventoryProducts, error: inventoryError } = await supabase
        .from('product_inventory')
        .select('product_id');

      if (inventoryError) throw inventoryError;

      const inventoryProductIds = inventoryProducts.map(inv => inv.product_id);
      return allProducts.filter(product => !inventoryProductIds.includes(product.id));
    }
  });

  // Create/Update inventory mutation
  const saveInventoryMutation = useMutation({
    mutationFn: async (data: { productId?: string; isNew: boolean }) => {
      if (data.isNew && data.productId) {
        // Create new inventory entry
        const { error } = await supabase
          .from('product_inventory')
          .insert({
            product_id: data.productId,
            stock_quantity: formData.stock_quantity,
            selling_price: formData.selling_price,
            cost_price: formData.cost_price || null,
            reorder_level: formData.reorder_level
          });

        if (error) throw error;
      } else if (selectedProduct) {
        // Update existing inventory
        const { error } = await supabase
          .from('product_inventory')
          .update({
            stock_quantity: formData.stock_quantity,
            selling_price: formData.selling_price,
            cost_price: formData.cost_price || null,
            reorder_level: formData.reorder_level,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProduct.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Inventory Updated",
        description: "Product inventory has been saved successfully",
      });
      setIsDialogOpen(false);
      setSelectedProduct(null);
      setFormData({ stock_quantity: 0, selling_price: 0, cost_price: 0, reorder_level: 5 });
      queryClient.invalidateQueries({ queryKey: ['inventory-management'] });
      queryClient.invalidateQueries({ queryKey: ['products-without-inventory'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const openEditDialog = (item: ProductInventory) => {
    setSelectedProduct(item);
    setFormData({
      stock_quantity: item.stock_quantity,
      selling_price: item.selling_price,
      cost_price: item.cost_price || 0,
      reorder_level: item.reorder_level
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = (productId: string) => {
    setSelectedProduct(null);
    setFormData({ stock_quantity: 0, selling_price: 0, cost_price: 0, reorder_level: 5 });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedProduct) {
      saveInventoryMutation.mutate({ isNew: false });
    } else {
      // This would need product selection logic for new items
      toast({
        title: "Error",
        description: "Please select a product to add inventory for",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage stock levels and pricing</p>
        </div>
      </div>

      {/* Products without inventory */}
      {productsWithoutInventory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              Add to Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsWithoutInventory.map((product) => (
                <Card key={product.id} className="border border-dashed">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Inventory
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add {product.name} to Inventory</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={formData.stock_quantity}
                              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="selling_price">Selling Price (₹)</Label>
                            <Input
                              id="selling_price"
                              type="number"
                              step="0.01"
                              value={formData.selling_price}
                              onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cost_price">Cost Price (₹) - Optional</Label>
                            <Input
                              id="cost_price"
                              type="number"
                              step="0.01"
                              value={formData.cost_price}
                              onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="reorder">Reorder Level</Label>
                            <Input
                              id="reorder"
                              type="number"
                              value={formData.reorder_level}
                              onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 5 })}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => saveInventoryMutation.mutate({ productId: product.id, isNew: true })}
                            disabled={saveInventoryMutation.isPending}
                          >
                            {saveInventoryMutation.isPending ? 'Adding...' : 'Add to Inventory'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-2">{item.products.name}</h3>
                  {item.stock_quantity <= item.reorder_level && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Low
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <Badge variant={item.stock_quantity > item.reorder_level ? "default" : "destructive"}>
                      {item.stock_quantity} units
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selling Price:</span>
                    <span className="font-medium">₹{item.selling_price}</span>
                  </div>
                  
                  {item.cost_price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Price:</span>
                      <span>₹{item.cost_price}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reorder Level:</span>
                    <span>{item.reorder_level}</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => openEditDialog(item)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? `Edit ${selectedProduct.products.name}` : 'Add Product to Inventory'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="selling_price">Selling Price (₹)</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="cost_price">Cost Price (₹) - Optional</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="reorder">Reorder Level</Label>
              <Input
                id="reorder"
                type="number"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 5 })}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saveInventoryMutation.isPending}
            >
              {saveInventoryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
