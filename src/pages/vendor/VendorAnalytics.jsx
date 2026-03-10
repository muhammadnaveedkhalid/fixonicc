import { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DollarSign, Briefcase, Clock, Activity, ArrowLeft } from 'lucide-react';

const VendorAnalytics = () => {
  const { stats, fetchStats } = useData();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = stats.monthlyData || [];

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-navy-100/20 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
        {/* Trend placeholder */}
        <div className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-black text-gray-400 uppercase tracking-widest">
          This Month
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-navy-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-navy-100/50 p-10 border border-gray-100 flex items-center justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-navy-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-navy-900">Performance Analytics</h1>
          <p className="text-gray-500 font-medium mt-2">Track your revenue and job completion metrics.</p>
        </div>
        <div className="p-4 bg-navy-900 rounded-2xl">
          <Activity className="w-8 h-8 text-lime-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`${stats.totalEarnings || 0} PKR`}
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-500"
        />
        <StatCard
          label="Completed Jobs"
          value={stats.completedJobs || 0}
          icon={<Briefcase className="w-6 h-6 text-navy-600" />}
          color="bg-navy-500"
        />
        <StatCard
          label="Pending Jobs"
          value={stats.pendingJobs || 0}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          color="bg-amber-500"
        />
        <StatCard
          label="Completion Rate"
          value={`${stats.totalRepairs ? Math.round((stats.completedJobs / stats.totalRepairs) * 100) : 0}%`}
          icon={<Activity className="w-6 h-6 text-lime-600" />}
          color="bg-lime-500"
        />
      </div>

      {/* Charts */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-navy-900">Revenue Trend</h3>
            <p className="text-gray-400 text-sm font-medium">Monthly earnings overview</p>
          </div>
        </div>

        <div className="h-96 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
    </div>
  );
};

export default VendorAnalytics;
