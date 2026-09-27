import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { error } = await supabase
        .from('adminContacts')
        .insert([formData]);

      if (error) throw error;

      setStatusMessage({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setFormData({ full_name: '', mobile_number: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage({ type: 'error', text: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Get in <span className="text-cyan-400">Touch</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
          Have a question about our products or your order? We're here to help. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 sm:space-y-10"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-cyan-400" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-medium mb-1">Store Address</h4>
                  <p className="text-gray-400 break-words">123 Electronics Hub, Tech Park<br/>Mumbai, Maharashtra 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Phone className="text-cyan-400" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-medium mb-1">Phone Number</h4>
                  <p className="text-gray-400 break-words">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Mail className="text-cyan-400" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-medium mb-1">Email Address</h4>
                  <p className="text-gray-400 break-words">support@fluxelectronics.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Clock className="text-cyan-400" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-medium mb-1">Business Hours</h4>
                  <p className="text-gray-400 break-words">Mon - Sat: 10:00 AM - 8:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-8 border-t border-white/10">
              <a 
                href="https://wa.me/919664710689" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all duration-300 font-medium"
              >
                <MessageCircle size={24} />
                Chat with us on WhatsApp
              </a>
              <p className="text-center text-sm text-gray-500 mt-3">+91 9664710689</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6">Send us a Message</h3>
            
            {statusMessage && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                statusMessage.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-400">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-400">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600 resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
