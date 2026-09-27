import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Send, Phone, Mail, User, Link as LinkIcon, Building, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const B2BEnquiry = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    work_email: '',
    company_name: '',
    company_url: '',
    landline: '',
    enquiry: '',
    target_budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from('b2b_enquiries')
        .insert([
          {
            full_name: formData.full_name,
            mobile_number: formData.mobile_number,
            work_email: formData.work_email,
            company_name: formData.company_name,
            company_url: formData.company_url,
            landline: formData.landline,
            enquiry: formData.enquiry,
            target_budget: formData.target_budget,
            status: 'Pending'
          }
        ]);

      if (error) throw error;

      setSubmitStatus({ type: 'success', message: 'Your enquiry has been submitted successfully! Our team will contact you shortly.' });
      setFormData({
        full_name: '',
        mobile_number: '',
        work_email: '',
        company_name: '',
        company_url: '',
        landline: '',
        enquiry: '',
        target_budget: ''
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="w-14 sm:w-16 h-14 sm:h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">B2B & Corporate Enquiries</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Looking for bulk orders, corporate gifting, or dealer partnerships? Fill out the form below and our dedicated B2B team will get back to you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-3xl p-5 sm:p-8 md:p-12 relative overflow-hidden"
        >
          {submitStatus && (
            <div className={`p-4 rounded-xl mb-8 ${submitStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Mobile Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="mobile_number"
                    required
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Work Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="work_email"
                    required
                    value={formData.work_email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Company Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              {/* Company URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Company URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="company_url"
                    value={formData.company_url}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              {/* Landline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Landline (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="landline"
                    value={formData.landline}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="022 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Target Budget */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Target Budget</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-gray-500" />
                  </div>
                  <select
                    name="target_budget"
                    value={formData.target_budget}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-gray-900">Select Budget Range</option>
                    <option value="Under ₹50,000" className="bg-gray-900">Under ₹50,000</option>
                    <option value="₹50,000 - ₹2,00,000" className="bg-gray-900">₹50,000 - ₹2,00,000</option>
                    <option value="₹2,00,000 - ₹10,00,000" className="bg-gray-900">₹2,00,000 - ₹10,00,000</option>
                    <option value="Above ₹10,00,000" className="bg-gray-900">Above ₹10,00,000</option>
                  </select>
                </div>
              </div>

              {/* Enquiry */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Enquiry Details *</label>
                <textarea
                  name="enquiry"
                  required
                  rows="4"
                  value={formData.enquiry}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                  placeholder="Tell us about your requirements (products, quantities, customization needs, timeline, etc.)"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Enquiry
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500">
                By submitting, you agree to our <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BEnquiry;
