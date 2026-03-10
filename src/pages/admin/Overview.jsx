import {
  Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useData } from '../../context/DataContext';
import { useEffect } from 'react';

const Overview = () => {
  const { stats, fetchStats } = useData();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatPKR = (val) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const revenueData = stats.monthlyData && stats.monthlyData.length > 0 ? stats.monthlyData : [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
  ];

  const userRoleData = [
    { name: 'Clients', value: stats.clientCount || 0, color: '#84cc16' },
    { name: 'Vendors', value: stats.vendorCount || 0, color: '#f97316' },
    { name: 'Admins', value: stats.adminCount || 0, color: '#8b5cf6' },
  ];

  const overviewStats = [
    { label: 'Total Revenue', value: formatPKR(stats.totalRevenue), icon: <DollarSign />, trend: '+12.5%', isUp: true },
    { label: 'Platform Users', value: stats.totalUsers.toString(), icon: <Users />, trend: '+4.2%', isUp: true },
    { label: 'Successful Repairs', value: stats.successfulRepairs.toString(), icon: <Wrench />, trend: '-2.1%', isUp: false },
    { label: 'Active Vendors', value: stats.totalVendors.toString(), icon: <ShieldCheck />, trend: '+8.0%', isUp: true },
  ];

  const hasNoData = !stats.totalRevenue && !stats.totalUsers && !stats.successfulRepairs && !stats.totalVendors;

  return (
    <>
      {hasNoData && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-medium">
          Connect your backend API (VITE_API_BASE_URL) to see live stats. Showing placeholder data until then.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-navy-50 shadow-2xl shadow-navy-900/5">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-navy-50 text-navy-500 rounded-2xl">{stat.icon}</div>
              <div className={`flex items-center text-xs font-black ${stat.isUp ? 'text-lime-600' : 'text-red-500'}`}>
                {stat.trend} {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-navy-200 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-navy-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-gray-900 mb-6">User Distribution</h3>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center pb-8">
                <div className="text-3xl font-black text-navy-900">{stats.totalUsers || 0}</div>
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
