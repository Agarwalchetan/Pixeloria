import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Eye, Clock, Globe,
  Calendar, Download, RefreshCw, Activity
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your website performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.pageViews?.total?.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{analyticsData?.pageViews?.growth}% this month</p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lab Usage</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.labUsage?.total?.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{analyticsData?.labUsage?.growth}% this month</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calculator Usage</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.costCalculator?.total?.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{analyticsData?.costCalculator?.growth}% this month</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">4m 32s</p>
              <p className="text-sm text-green-600">+8% this month</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Pages</h3>
          <div className="space-y-4">
            {analyticsData?.popularPages?.map((page: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{page.page}</p>
                  <p className="text-sm text-gray-600">{page.views} views</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(page.views / Math.max(...analyticsData.popularPages.map((p: any) => p.views))) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Lab Tools */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Lab Tools</h3>
          <div className="space-y-4">
            {analyticsData?.popularLabTools?.map((tool: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{tool.name}</p>
                  <p className="text-sm text-gray-600">{tool.usage}% usage rate</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${tool.usage}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download size={16} />
            <span>Export Analytics CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span>Export Lab Usage Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download size={16} />
            <span>Export Contact Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;