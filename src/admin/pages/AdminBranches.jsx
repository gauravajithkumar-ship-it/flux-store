import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, MapPin, Loader2, Building2 } from 'lucide-react';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, branch_name: '', address: '' });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const branchData = {
        branch_name: formData.branch_name.trim(),
        address: formData.address.trim(),
      };

      if (formData.id) {
        const { error } = await supabase
          .from('branches')
          .update(branchData)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('branches').insert([branchData]);
        if (error) throw error;
      }

      setShowForm(false);
      setFormData({ id: null, branch_name: '', address: '' });
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Failed to save branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (branch) => {
    setFormData(branch);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        const { error } = await supabase.from('branches').delete().eq('id', id);
        if (error) throw error;
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
        alert('Failed to delete branch');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Building2 className="text-cyan-400" />
            Branch Management
          </h1>
          <p className="text-gray-400 mt-1">Add and manage your store branches.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setFormData({ id: null, branch_name: '', address: '' });
              setShowForm(true);
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Branch
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            {formData.id ? 'Edit Branch' : 'Add Branch'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Branch Name</label>
              <input
                required
                type="text"
                value={formData.branch_name}
                onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                placeholder="e.g. Andheri West"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Address</label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 123 MG Road, Mumbai, Maharashtra - 400053"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                {formData.id ? 'Save Changes' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-cyan-400 w-8 h-8" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-black/40 text-gray-500 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Branch Name</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-cyan-400 shrink-0" />
                        {branch.branch_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md" title={branch.address}>
                      <span className="line-clamp-2">{branch.address}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(branch.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(branch)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="p-2 bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {branches.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No branches found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBranches;
