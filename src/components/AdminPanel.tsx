
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, Package, MessageSquare, BarChart3, Menu, ShoppingCart, Warehouse, Receipt } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProductManager from './ProductManager';
import ReviewManager from './ReviewManager';
import AdminDashboard from './AdminDashboard';
import POSSystem from './POSSystem';
import InventoryManager from './InventoryManager';
import SalesHistory from './SalesHistory';

interface AdminPanelProps {
  user: any;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const NavigationTabs = () => (
    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-1">
      <TabsTrigger value="dashboard" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Dashboard</span>
        <span className="sm:hidden">Stats</span>
      </TabsTrigger>
      <TabsTrigger value="pos" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">POS</span>
        <span className="sm:hidden">POS</span>
      </TabsTrigger>
      <TabsTrigger value="inventory" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <Warehouse className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Inventory</span>
        <span className="sm:hidden">Stock</span>
      </TabsTrigger>
      <TabsTrigger value="sales" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <Receipt className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Sales</span>
        <span className="sm:hidden">Sales</span>
      </TabsTrigger>
      <TabsTrigger value="products" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <Package className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Products</span>
        <span className="sm:hidden">Items</span>
      </TabsTrigger>
      <TabsTrigger value="reviews" className="flex flex-col items-center space-y-1 p-2 md:p-3 text-xs">
        <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Reviews</span>
        <span className="sm:hidden">Reviews</span>
      </TabsTrigger>
    </TabsList>
  );

  const MobileNavigation = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center space-x-3 pb-4 border-b">
            <Settings className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="font-semibold">M.R. Store Admin</h2>
              <p className="text-xs text-muted-foreground">CMS</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'pos' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('pos')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              POS System
            </Button>
            <Button
              variant={activeTab === 'inventory' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('inventory')}
            >
              <Warehouse className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant={activeTab === 'sales' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('sales')}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Sales History
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === 'reviews' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Reviews
            </Button>
          </nav>

          <div className="pt-4 border-t mt-auto">
            <div className="text-sm text-muted-foreground mb-2">
              {user.first_name} {user.last_name}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MobileNavigation />
              <Settings className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-slate-900">M.R. Store Admin</h1>
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:block">
                <span className="text-sm text-slate-600">
                  Welcome, {user.first_name} {user.last_name}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-1 md:space-x-2"
              >
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <div className="block">
            <NavigationTabs />
          </div>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="pos">
            <POSSystem user={user} />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="sales">
            <SalesHistory />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
