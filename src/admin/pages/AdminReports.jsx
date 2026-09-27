import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 400000, profit: 240000 },
  { name: 'Feb', revenue: 300000, profit: 139800 },
  { name: 'Mar', revenue: 200000, profit: 98000 },
  { name: 'Apr', revenue: 278000, profit: 190800 },
  { name: 'May', revenue: 189000, profit: 48000 },
  { name: 'Jun', revenue: 239000, profit: 180000 },
  { name: 'Jul', revenue: 349000, profit: 230000 },
];

const categoryData = [
  { name: 'Smartphones', value: 45 },
  { name: 'Audio', value: 25 },
  { name: 'Wearables', value: 15 },
  { name: 'Accessories', value: 15 },
];

const COLORS = ['#22d3ee', '#3b82f6', '#10b981', '#f59e0b'];

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed analytics and financial breakdown.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-black border border-white/10 text-gray-300 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Calendar size={18} />
            This Year
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue vs Profit</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
