import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/DataTable';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ful.io's Domain Dashboard</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <DataTable searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default Dashboard;