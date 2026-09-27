import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, MailOpen, Trash2, Calendar, Phone } from 'lucide-react';

const AdminContacts = () => {
  const [messages, setMessages] = parseInt(useState([]), 10) ? useState([]) : useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('adminContacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Unread' ? 'Read' : 'Unread';
    try {
      const { error } = await supabase
        .from('adminContacts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const { error } = await supabase
        .from('adminContacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Enquiries</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and respond to customer messages.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        </div>
      </div>

      {/* Messages List / Table Grid */}
      <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No messages found</h3>
            <p className="text-gray-500 text-sm">Customer enquiries will appear here once they contact you.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={`p-6 transition-colors hover:bg-white/5 ${msg.status === 'Unread' ? 'bg-cyan-500/5' : ''}`}>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Metadata */}
                  <div className="w-full lg:w-1/4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-cyan-900/30 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/20">
                        {msg.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{msg.full_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          msg.status === 'Unread' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-400">
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={14} className="shrink-0 text-gray-500" /> 
                        <a href={`mailto:${msg.email}`} className="hover:text-cyan-400 transition-colors truncate">{msg.email}</a>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Phone size={14} className="shrink-0 text-gray-500" /> 
                        <a href={`tel:${msg.mobile_number}`} className="hover:text-cyan-400 transition-colors">{msg.mobile_number}</a>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Calendar size={14} className="shrink-0 text-gray-500" /> 
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Message Content */}
                  <div className="w-full lg:w-1/2 min-w-0 flex flex-col justify-center">
                    <h4 className="text-white font-medium mb-2 truncate">Subject: {msg.subject}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 hover:line-clamp-none transition-all">
                      {msg.message}
                    </p>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="w-full lg:w-1/4 flex lg:flex-col justify-end lg:justify-center items-end gap-3">
                    <button
                      onClick={() => toggleStatus(msg.id, msg.status)}
                      className={`flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        msg.status === 'Unread' 
                          ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                          : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                      }`}
                    >
                      {msg.status === 'Unread' ? <MailOpen size={16} /> : <Mail size={16} />}
                      Mark as {msg.status === 'Unread' ? 'Read' : 'Unread'}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
