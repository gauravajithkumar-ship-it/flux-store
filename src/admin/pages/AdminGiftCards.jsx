import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ITEMS_PER_PAGE = 10;

const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editCard, setEditCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchGiftCards = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGiftCards(data || []);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  // Filter gift cards
  const filteredCards = useMemo(() => {
    return giftCards.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Active' ? c.status : !c.status;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, giftCards]);

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleEdit = (card) => {
    setEditCard(card);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditCard(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gift card?')) return;
    try {
      const { error } = await supabase.from('gift_cards').delete().eq('id', id);
      if (error) throw error;
      fetchGiftCards();
    } catch (error) {
      console.error('Error deleting gift card:', error);
      alert('Failed to delete gift card.');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from('gift_cards').update({ status: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchGiftCards();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCards.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${action} ${selectedIds.length} gift cards?`)) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase.from('gift_cards').delete().in('id', selectedIds);
        if (error) throw error;
      } else if (action === 'activate') {
        const { error } = await supabase.from('gift_cards').update({ status: true }).in('id', selectedIds);
        if (error) throw error;
      } else if (action === 'deactivate') {
        const { error } = await supabase.from('gift_cards').update({ status: false }).in('id', selectedIds);
        if (error) throw error;
      }
      setSelectedIds([]);
      fetchGiftCards();
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`Failed to bulk ${action} gift cards.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const denString = formData.get('denominations');
    const denArray = denString ? denString.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : [];
    
    const cardData = {
      name: formData.get('name'),
      image: formData.get('image'),
      denominations: denArray,
      allow_custom_amount: formData.get('allow_custom_amount') === 'on',
      stock: parseInt(formData.get('stock') || 0, 10),
      status: formData.get('status') === 'on'
    };

    try {
      if (modalMode === 'add') {
        const { error } = await supabase.from('gift_cards').insert([cardData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gift_cards').update(cardData).eq('id', editCard.id);
        if (error) throw error;
      }
      fetchGiftCards();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving gift card:', error);
      alert('Failed to save gift card.');
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gift Card Management</h1>
          <p className="text-sm text-gray-500 mt-1">{giftCards.length} gift cards in database</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Gift Card
        </button>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search gift cards..."
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{selectedIds.length} selected</span>
            <button onClick={() => handleBulkAction('activate')} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors">Activate</button>
            <button onClick={() => handleBulkAction('deactivate')} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-500/20 transition-colors">Deactivate</button>
            <button onClick={() => handleBulkAction('delete')} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-sm hover:bg-rose-500/20 transition-colors">Delete</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium w-12">
                  <input 
                    type="checkbox" 
                    checked={paginatedCards.length > 0 && selectedIds.length === paginatedCards.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" 
                  />
                </th>
                <th className="px-6 py-4 font-medium">Gift Card</th>
                <th className="px-6 py-4 font-medium">Denominations</th>
                <th className="px-6 py-4 font-medium">Custom Amount</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCards.map((card) => (
                <tr key={card.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(card.id)}
                      onChange={() => handleSelectOne(card.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center p-1">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{card.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{card.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {card.denominations?.map(d => (
                        <span key={d} className="bg-white/5 text-gray-300 text-[10px] px-2 py-1 rounded">₹{d}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {card.allow_custom_amount ? (
                      <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs">Allowed</span>
                    ) : (
                      <span className="text-gray-500">Not Allowed</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${card.stock > 10 ? 'bg-emerald-500' : card.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                      <span className={card.stock === 0 ? 'text-rose-400' : 'text-gray-300'}>{card.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(card.id, card.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        card.status
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                      }`}
                    >
                      {card.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {card.status ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCards.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No gift cards found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/20">
            <div className="text-sm text-gray-500">
              Showing <span className="text-gray-300 font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-gray-300 font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCards.length)}</span> of <span className="text-gray-300 font-medium">{filteredCards.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Add New Gift Card' : 'Edit Gift Card'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Gift Card Name *</label>
                  <input
                    required
                    name="name"
                    defaultValue={editCard?.name}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="e.g., Amazon Pay Gift Card"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Image URL *</label>
                  <input
                    required
                    name="image"
                    defaultValue={editCard?.image}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="https://example.com/image.png"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Denominations (comma separated) *</label>
                  <input
                    required
                    name="denominations"
                    defaultValue={editCard?.denominations?.join(', ')}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="500, 1000, 2000, 5000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Stock Count *</label>
                  <input
                    required
                    type="number"
                    name="stock"
                    min="0"
                    defaultValue={editCard?.stock ?? 100}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      name="allow_custom_amount"
                      defaultChecked={editCard?.allow_custom_amount ?? false}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-300">Allow Custom Amount</span>
                  </label>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-3 p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      name="status"
                      defaultChecked={editCard ? editCard.status : true}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-300">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  {modalMode === 'add' ? 'Create Card' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGiftCards;
