
import React, { useState } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';

const Admin = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel user={user} onLogout={handleLogout} />;
};

export default Admin;
