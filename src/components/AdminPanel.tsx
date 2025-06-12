
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, Package, MessageSquare, BarChart3 } from 'lucide-react';
import ProductManager from './ProductManager';
import ReviewManager from './ReviewManager';
import AdminDashboard from './AdminDashboard';

interface AdminPanelProps {
  user: any;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">M.R. Store Admin</h1>
                <p className="text-sm text-slate-600">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {user.first_name} {user.last_name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Product Management</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Review Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
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
