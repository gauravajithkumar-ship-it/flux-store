import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { IndianRupee, Users, ShoppingBag, TrendingUp, Eye } from 'lucide-react';

const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 35 },
  { name: 'Thu', sales: 2780, orders: 15 },
  { name: 'Fri', sales: 6890, orders: 48 },
  { name: 'Sat', sales: 8390, orders: 60 },
  { name: 'Sun', sales: 9490, orders: 75 },
];

const AdminDashboard = () => {
  const cards = [
    { title: 'Total Revenue', value: '₹24,89,400', change: '+12.5%', icon: IndianRupee, color: 'text-cyan-400' },
    { title: 'Active Customers', value: '3,240', change: '+8.2%', icon: Users, color: 'text-purple-400' },
    { title: 'Total Orders', value: '1,482', change: '+21.3%', icon: ShoppingBag, color: 'text-emerald-400' },
    { title: 'Conversion Rate', value: '3.42%', change: '+4.6%', icon: TrendingUp, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard View Control Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 w-full sm:w-auto">
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Grid Summary Analytic Cards Layout Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{card.value}</p>
                <p className="text-xs font-semibold text-emerald-400">{card.change} <span className="text-gray-500 font-normal">vs last week</span></p>
              </div>
              <div className={`p-3 rounded-lg bg-white/[0.02] border border-white/5 ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Data Charts Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Progress Chart Panel */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Revenue Progress</h3>
            <p className="text-xs text-gray-500">Daily financial growth metrics overview</p>
          </div>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} />
                <Line type="monotone" dataKey="sales" stroke="#22d3ee" strokeWidth={2.5} dot={{ fill: '#22d3ee' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart Panel */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Order Volume Metrics</h3>
            <p className="text-xs text-gray-500">Total processed daily product orders count</p>
          </div>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} />
                <Bar dataKey="orders" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scrollable Data Table Container Log Area */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Recent Orders Log</h3>
          <p className="text-xs text-gray-500">Real-time incoming product checkout items log status</p>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-400 divide-y divide-white/5">
              {[
                { id: '#ORD-9021', customer: 'Rahul Sharma', amount: '₹45,999', status: 'Delivered', date: '2 hrs ago', statusColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' },
                { id: '#ORD-9022', customer: 'Priya Patel', amount: '₹12,499', status: 'Processing', date: '4 hrs ago', statusColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/20' },
                { id: '#ORD-9023', customer: 'Amit Kumar', amount: '₹89,900', status: 'Shipped', date: '5 hrs ago', statusColor: 'text-blue-400 bg-blue-400/10 border-blue-500/20' },
                { id: '#ORD-9024', customer: 'Neha Singh', amount: '₹3,499', status: 'Pending', date: '1 day ago', statusColor: 'text-amber-400 bg-amber-400/10 border-amber-500/20' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-white font-medium">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100" aria-label="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;