import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Tag, Copy, Trash2, Edit, Check, X, Filter, Calendar, Percent, IndianRupee, TicketPercent } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ITEMS_PER_PAGE = 8;

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editCoupon, setEditCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCouponStatus = (coupon) => {
    if (new Date(coupon.expiry_date) < new Date()) return 'Expired';
    if (!coupon.is_active) return 'Inactive';
    return 'Active';
  };

  // Stats
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => getCouponStatus(c) === 'Active').length;
    const expired = coupons.filter(c => getCouponStatus(c) === 'Expired').length;
    const totalUsage = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);
    return { total, active, expired, totalUsage };
  }, [coupons]);

  // Filter & Search
  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const status = getCouponStatus(c);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, coupons]);

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditCoupon(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon.');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', coupon.id);
      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

  const handleCopyCode = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const couponData = {
      code: formData.get('code').toUpperCase().trim(),
      discount_type: formData.get('discount_type'),
      discount_value: parseFloat(formData.get('discount_value')),
      min_order_amount: parseFloat(formData.get('min_order_amount') || 0),
      expiry_date: new Date(formData.get('expiry_date')).toISOString(),
      usage_limit: formData.get('usage_limit') ? parseInt(formData.get('usage_limit'), 10) : null,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      if (modalMode === 'add') {
        const { error } = await supabase.from('coupons').insert([couponData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('coupons').update(couponData).eq('id', editCoupon.id);
        if (error) throw error;
      }
      fetchCoupons();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon. ' + (error.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatValue = (coupon) => {
    return coupon.discount_type === 'percentage'
      ? `${coupon.discount_value}%`
      : `₹${Number(coupon.discount_value).toLocaleString('en-IN')}`;
  };

  const formatMinSpend = (amount) => {
    return amount > 0 ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} coupons in database</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', value: stats.total, icon: TicketPercent, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'Active', value: stats.active, icon: Check, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Expired', value: stats.expired, icon: Calendar, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Total Usage', value: stats.totalUsage.toLocaleString(), icon: Tag, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search coupons by code..."
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
          <button className="bg-black/50 border border-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Coupon Code</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Min Spend</th>
                <th className="px-6 py-4 font-medium">Validity</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCoupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-cyan-400" />
                        <span className="text-white font-mono font-medium">{coupon.code}</span>
                        <button
                          onClick={() => handleCopyCode(coupon.code, coupon.id)}
                          className="text-gray-500 hover:text-cyan-400 ml-1 transition-colors"
                          title="Copy Code"
                        >
                          {copiedId === coupon.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent size={13} className="text-gray-500" />
                        ) : (
                          <IndianRupee size={13} className="text-gray-500" />
                        )}
                        <span className="capitalize">{coupon.discount_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{formatValue(coupon)}</td>
                    <td className="px-6 py-4">{formatMinSpend(coupon.min_order_amount)}</td>
                    <td className="px-6 py-4">{formatDate(coupon.expiry_date)}</td>
                    <td className="px-6 py-4">
                      {coupon.used_count} / {coupon.usage_limit ?? '∞'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        status === 'Active' ? 'text-emerald-400 bg-emerald-400/10' :
                        status === 'Inactive' ? 'text-amber-400 bg-amber-400/10' :
                        'text-red-400 bg-red-400/10'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`p-1.5 transition-colors ${
                            coupon.is_active
                              ? 'text-emerald-400 hover:text-emerald-300'
                              : 'text-gray-500 hover:text-amber-400'
                          }`}
                          title={coupon.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            coupon.is_active ? 'bg-emerald-500/30' : 'bg-gray-700'
                          }`}>
                            <div className={`w-4 h-4 rounded-full transition-all ${
                              coupon.is_active ? 'translate-x-4 bg-emerald-400' : 'translate-x-0 bg-gray-500'
                            }`} />
                          </div>
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No results */}
        {paginatedCoupons.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No coupons found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredCoupons.length > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
            <p>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCoupons.length)} of {filteredCoupons.length} coupons</p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    page === currentPage
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Create New Coupon' : `Edit: ${editCoupon?.code}`}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Coupon Code</label>
                  <input
                    name="code"
                    type="text"
                    required
                    defaultValue={editCoupon?.code || ''}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none uppercase font-mono"
                    placeholder="e.g. SUMMER2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Discount Type</label>
                  <select
                    name="discount_type"
                    defaultValue={editCoupon?.discount_type || 'percentage'}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Discount Value</label>
                  <input
                    name="discount_value"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editCoupon?.discount_value || ''}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="e.g. 15 for 15% or 500 for ₹500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Minimum Order Amount (₹)</label>
                  <input
                    name="min_order_amount"
                    type="number"
                    step="0.01"
                    defaultValue={editCoupon?.min_order_amount || '0'}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Expiry Date</label>
                  <input
                    name="expiry_date"
                    type="date"
                    required
                    defaultValue={editCoupon ? new Date(editCoupon.expiry_date).toISOString().split('T')[0] : ''}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Usage Limit (leave empty for unlimited)</label>
                  <input
                    name="usage_limit"
                    type="number"
                    defaultValue={editCoupon?.usage_limit ?? ''}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    name="is_active"
                    type="checkbox"
                    defaultChecked={editCoupon ? editCoupon.is_active : true}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500/40 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:peer-checked:bg-emerald-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <span className="text-sm text-gray-300">Active</span>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : modalMode === 'add' ? 'Create Coupon' : 'Update Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
