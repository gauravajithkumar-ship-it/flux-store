import { useState, useEffect } from 'react';
import { Search, Building2, Phone, Mail, Link as LinkIcon, DollarSign, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminB2BEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('b2b_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching B2B enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('b2b_enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => 
    enq.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.work_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">B2B Enquiries</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Total Enquiries:</span>
          <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-bold">
            {enquiries.length}
          </span>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by company, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-20 bg-[#0f0f0f] border border-white/5 rounded-xl">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Enquiries Found</h3>
          <p className="text-gray-500">There are no B2B enquiries matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredEnquiries.map((enq) => (
            <div key={enq.id} className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors flex flex-col">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 size={18} className="text-cyan-400" />
                    {enq.company_name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                    {enq.full_name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => updateStatus(enq.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full appearance-none cursor-pointer outline-none ${
                      enq.status === 'Pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      enq.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <option value="Pending" className="bg-gray-900 text-white">Pending</option>
                    <option value="Contacted" className="bg-gray-900 text-white">Contacted</option>
                    <option value="Resolved" className="bg-gray-900 text-white">Resolved</option>
                  </select>
                  <span className="text-xs text-gray-600">
                    {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-500 shrink-0" />
                  <a href={`mailto:${enq.work_email}`} className="text-gray-300 hover:text-cyan-400 truncate">{enq.work_email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-500 shrink-0" />
                  <a href={`tel:${enq.mobile_number}`} className="text-gray-300 hover:text-cyan-400">{enq.mobile_number}</a>
                </div>
                {enq.landline && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-500 shrink-0" />
                    <span className="text-gray-300">{enq.landline} (Landline)</span>
                  </div>
                )}
                {enq.company_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <LinkIcon size={16} className="text-gray-500 shrink-0" />
                    <a href={enq.company_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 truncate">{enq.company_url}</a>
                  </div>
                )}
                {enq.target_budget && (
                  <div className="flex items-center gap-3 text-sm md:col-span-2">
                    <DollarSign size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded">Budget: {enq.target_budget}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 mt-auto">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2 block">Enquiry Details</span>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{enq.enquiry}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminB2BEnquiries;
