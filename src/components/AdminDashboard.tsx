
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Package, MessageSquare, TrendingUp, Users, Eye, Star, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const AdminDashboard = () => {
  const [totalViews, setTotalViews] = useState(0);

  // Set up real-time subscription for page views
  useEffect(() => {
    const fetchInitialViews = async () => {
      const { count } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      setTotalViews(count || 0);
    };

    fetchInitialViews();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('page_views_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views'
        },
        () => {
          // Increment the count when a new view is added
          setTotalViews(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsResponse, reviewsResponse] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('reviews').select('*', { count: 'exact' })
      ]);

      const products = productsResponse.data || [];
      const reviews = reviewsResponse.data || [];
      
      // Calculate average rating
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentProducts = products.filter(p => 
        new Date(p.created_at) >= sevenDaysAgo
      ).length;

      const recentReviews = reviews.filter(r => 
        new Date(r.created_at) >= sevenDaysAgo
      ).length;

      // Rating distribution for pie chart
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
        count: reviews.filter(r => r.rating === rating).length,
        value: reviews.filter(r => r.rating === rating).length
      }));

      // Activity over time (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activityData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayProducts = products.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= dayStart && createdAt <= dayEnd;
        }).length;
        
        const dayReviews = reviews.filter(r => {
          const createdAt = new Date(r.created_at);
          return createdAt >= dayStart && createdAt <= dayEnd;
        }).length;

        activityData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          products: dayProducts,
          reviews: dayReviews
        });
      }

      return {
        totalProducts: productsResponse.count || 0,
        totalReviews: reviewsResponse.count || 0,
        averageRating: Number(avgRating.toFixed(1)),
        recentProducts,
        recentReviews,
        ratingDistribution: ratingDistribution.filter(item => item.count > 0),
        activityData
      };
    }
  });

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
    products: {
      label: "Products",
      color: "hsl(var(--primary))",
    },
    reviews: {
      label: "Reviews",
      color: "hsl(var(--secondary))",
    },
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor your store's performance and activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Real-time updates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Real-time website views
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <Package className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats?.recentProducts} added this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats?.totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats?.recentReviews} added this week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.averageRating}/5</div>
            <p className="text-xs text-muted-foreground mt-1">Customer satisfaction score</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution Pie Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
            <CardDescription>How customers rate your products</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.ratingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats?.ratingDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Products and reviews added over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.activityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="products" 
                    stroke="var(--color-products)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-products)", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reviews" 
                    stroke="var(--color-reviews)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-reviews)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Summary
            </CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Website Traffic</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{totalViews.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Product Catalog</span>
              </div>
              <span className="text-lg font-bold text-green-600">{stats?.totalProducts} items</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Customer Rating</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{stats?.averageRating}/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>What's happening this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">New Products</p>
                <p className="text-sm text-muted-foreground">Added this week</p>
              </div>
              <span className="text-2xl font-bold text-green-600">+{stats?.recentProducts}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">New Reviews</p>
                <p className="text-sm text-muted-foreground">Added this week</p>
              </div>
              <span className="text-2xl font-bold text-orange-600">+{stats?.recentReviews}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Total Engagement</p>
                <p className="text-sm text-muted-foreground">Reviews & products</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{(stats?.totalReviews || 0) + (stats?.totalProducts || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
