import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAnnouncement();

    // Set up real-time subscription for updates
    const channel = supabase
      .channel('public:adminAnnouncements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'adminAnnouncements' }, () => {
        fetchAnnouncement();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('adminAnnouncements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching announcements:', error);
      }
      
      if (data && data.length > 0) {
        setAnnouncements(data);
        setIsVisible(true);
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.error('Failed to load announcement:', err);
    }
  };

  if (announcements.length === 0 || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white relative z-[60] overflow-hidden h-10 flex items-center border-b border-white/10 w-full">
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div className="inline-block animate-marquee hover:[animation-play-state:paused] px-4">
          <span className="font-semibold text-sm md:text-base tracking-wide flex items-center gap-8">
            {announcements.map((announcement, index) => (
              <span key={announcement.id} className="flex items-center gap-2">
                <span className="text-cyan-200">[{announcement.title}]</span>
                {announcement.message}
                {index < announcements.length - 1 && <span className="text-white/30 ml-8">•</span>}
              </span>
            ))}
          </span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-0 top-0 h-full px-3 bg-gradient-to-l from-blue-600 to-transparent hover:text-cyan-200 transition-colors flex items-center justify-center z-10"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
