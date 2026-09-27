import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, Megaphone, Loader2 } from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', message: '', is_active: false });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('adminAnnouncements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('adminAnnouncements')
          .update({
            title: formData.title,
            message: formData.message,
            is_active: formData.is_active
          })
          .eq('id', formData.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('adminAnnouncements')
          .insert([{
            title: formData.title,
            message: formData.message,
            is_active: formData.is_active
          }]);
        
        if (error) throw error;
      }

      setShowForm(false);
      setFormData({ id: null, title: '', message: '', is_active: false });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setFormData(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const { error } = await supabase.from('adminAnnouncements').delete().eq('id', id);
        if (error) throw error;
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleToggleActive = async (announcement) => {
    try {
      const newStatus = !announcement.is_active;

      const { error } = await supabase
        .from('adminAnnouncements')
        .update({ is_active: newStatus })
        .eq('id', announcement.id);

      if (error) throw error;
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Megaphone className="text-cyan-400" />
            Announcement Bar
          </h1>
          <p className="text-gray-400 mt-1">Manage the scrolling marquee displayed on the website.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setFormData({ id: null, title: '', message: '', is_active: false });
              setShowForm(true);
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            New Announcement
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{formData.id ? 'Edit Announcement' : 'Create Announcement'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Title</label>
              <input 
                required 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Black Friday Sale"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Message</label>
              <input 
                required 
                type="text" 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="e.g. Get 50% off on all items! Use code BLACK50"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
                className="w-5 h-5 accent-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <span className="text-gray-300">Set as Active</span>
            </label>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                {formData.id ? 'Save Changes' : 'Create'}
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleActive(item)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          item.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:border-gray-400'
                        }`}
                      >
                        {item.is_active ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-400" />}
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4 max-w-md truncate" title={item.message}>{item.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No announcements found. Create one to get started.
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

export default AdminAnnouncements;
