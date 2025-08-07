import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authUtils } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use auth utility to check authentication
        if (!authUtils.isAuthenticated()) {
          setIsAuthenticated(false);
          return;
        }

        // Verify token with backend
        const isValid = await authUtils.verifyToken();
        if (isValid) {
          const user = authUtils.getUser();
          setIsAuthenticated(true);
          setUserRole(user?.role || null);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Authenticated but not admin (if admin required)
  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this area.</p>
          <button
            onClick={() => {
              authUtils.clearAuth();
              window.location.href = '/admin';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;