
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const AdminDashboard = () => {
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

      // Rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
        count: reviews.filter(r => r.rating === rating).length
      }));

      return {
        totalProducts: productsResponse.count || 0,
        totalReviews: reviewsResponse.count || 0,
        averageRating: Number(avgRating.toFixed(1)),
        recentProducts,
        recentReviews,
        ratingDistribution,
        totalViews: 1247 // Mock data - you can implement actual view tracking later
      };
    }
  });

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Website page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.recentProducts} added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.recentReviews} added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Distribution of customer ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Website Performance</span>
              <span className="text-sm text-muted-foreground">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Content Freshness</span>
              <span className="text-sm text-muted-foreground">
                {stats?.recentProducts || 0} new products this week
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Customer Engagement</span>
              <span className="text-sm text-muted-foreground">
                {stats?.recentReviews || 0} new reviews this week
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Rating</span>
              <span className="text-sm text-muted-foreground">
                {stats?.averageRating}/5 stars
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
