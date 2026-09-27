import { Save, User, Store, Shield, Bell } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          {[
            { name: 'Store Details', icon: Store, active: true },
            { name: 'Account Settings', icon: User, active: false },
            { name: 'Security', icon: Shield, active: false },
            { name: 'Notifications', icon: Bell, active: false },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 bg-[#0f0f0f] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Store Details</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Store Name</label>
                <input type="text" defaultValue="Flux Electronics" className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Support Email</label>
                <input type="email" defaultValue="support@fluxelectronics.in" className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Support Phone</label>
                <input type="text" defaultValue="+91 1800-123-4567" className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Company GSTIN</label>
                <input type="text" defaultValue="27AADCB2230M1Z2" className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white font-mono focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-sm text-gray-400">Store Address</label>
              <textarea rows="3" defaultValue="123, Cyber Hub, Phase 2, Gurugram, Haryana - 122002" className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"></textarea>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-sm font-medium text-white mb-4">Currency & Locale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Default Currency</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Timezone</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50">
                    <option>Asia/Kolkata (IST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
