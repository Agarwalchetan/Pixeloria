import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const AdminTabs: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to main admin dashboard
  React.useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return <AdminDashboard />;
};

export default AdminTabs;