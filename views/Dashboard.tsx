
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, MousePointerClick, DollarSign, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { AnalyticsData, Product } from '../types';

interface DashboardProps {
  analytics: AnalyticsData[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ analytics, products }) => {
  const totalVisitors = analytics.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalClicks = analytics.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalSales = analytics.reduce((acc, curr) => acc + curr.sales, 0);
  const avgCTR = (totalClicks / totalVisitors * 100).toFixed(1);

  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
        <p className="text-gray-500">Real-time performance metrics for your Noon Seller account.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Total Store Visitors</p>
          <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Noon Click-throughs</p>
          <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {avgCTR}% CTR
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900">3.4%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            {lowStockCount > 0 && (
              <span className="flex items-center text-sm font-medium text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                {lowStockCount} alerts
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-500">Total SKUs</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitor Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Traffic Over Time</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVis)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Progress */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Conversion Efficiency</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Product Alerts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Inventory Monitoring</h3>
          <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View All Stock</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{p.sku}</td>
                <td className="px-6 py-4 text-gray-900 font-semibold">{p.stock} units</td>
                <td className="px-6 py-4">
                  {p.stock < 10 ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">CRITICAL</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">HEALTHY</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Update Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
