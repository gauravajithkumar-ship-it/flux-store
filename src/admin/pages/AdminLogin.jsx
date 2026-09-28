import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight, Home } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.username === 'fluxadmin' && formData.password === 'flux@1122') {
      setIsSubmitting(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden selection:bg-cyan-500/30 px-4 sm:px-6">
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] rounded-full bg-cyan-900/20 blur-[60px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[120px] sm:w-[250px] h-[120px] sm:h-[250px] rounded-full bg-blue-900/20 blur-[60px] sm:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm z-10 my-8">
        {/* Top Header Block */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Lock className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Flux Admin Area</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Authorized personnel only</p>
        </div>

        {/* Login Panel */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 sm:py-2.5 pl-10 pr-4 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                  placeholder="fluxadmin"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 sm:py-2.5 pl-10 pr-4 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs sm:text-sm mt-2 p-2 rounded bg-red-400/10 border border-red-400/20 active:scale-[0.99] transition-transform">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl py-2 sm:py-2.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4 text-sm sm:text-base"
            >
              {isSubmitting ? 'Authenticating...' : 'Secure Login'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Back to Homepage Responsive Link Node */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl"
          >
            <Home size={14} />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;