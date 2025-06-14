
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: (user: any) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Query the users table for authentication
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin');

      if (error) {
        throw error;
      }

      if (!users || users.length === 0) {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials or user not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const user = users[0];
      
      // For now, we'll do a simple password check (in production, use proper hashing)
      // This is a basic implementation - in real apps, passwords should be hashed
      if (user.password_hash !== password) {
        toast({
          title: "Login Failed",
          description: "Invalid password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
      
      onLogin(user);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-900">
            M.R. Store Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </Button>
            <div className="text-sm text-center text-slate-600 mt-4">
              <p>Use your admin account credentials to login</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
