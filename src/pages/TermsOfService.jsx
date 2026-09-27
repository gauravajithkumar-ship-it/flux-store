import { motion } from 'framer-motion';
import { Scale, ShieldAlert, CreditCard, Truck, RefreshCw, FileText } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "July 1, 2026";

  const sections = [
    {
      icon: <Scale className="text-cyan-400" size={24} />,
      title: "1. Acceptance of Terms",
      content: "By accessing or using Flux Store Inc. ('Flux Store', 'we', 'us', or 'our') platform, website, and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      icon: <ShieldAlert className="text-cyan-400" size={24} />,
      title: "2. User Accounts & Security",
      content: "To access certain features of our store, you may be required to register for an account. You are solely responsible for maintaining the confidentiality of your account credentials, including passwords, and for restricting access to your devices. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      icon: <CreditCard className="text-cyan-400" size={24} />,
      title: "3. Products, Pricing & Payments",
      content: "All product specifications, images, and pricing are subject to change at any time without notice. Prices listed on the platform are denominated in Indian Rupees (INR) and are inclusive of applicable taxes/GST unless stated otherwise. We reserve the right to refuse or cancel any order if fraudulent activity, pricing errors, or stock discrepancies are suspected."
    },
    {
      icon: <Truck className="text-cyan-400" size={24} />,
      title: "4. Shipping & Delivery",
      content: "Estimated delivery timelines provided at checkout (typically 3 business days) are projections and not guaranteed delivery dates. Shipping fees are dynamically calculated based on order totals, thresholds, and dimensions. Flux Store is not liable for structural logistical delays caused by carrier disruptions or incorrect addresses provided by the client."
    },
    {
      icon: <RefreshCw className="text-cyan-400" size={24} />,
      title: "5. Returns, Refunds & Cancellations",
      content: "Orders can only be cancelled prior to dispatch. Eligible products may be returned within our designated return window, provided they are in brand-new, unopened pristine condition with original packaging intact. Refunds are processed back to the original payment channel within 5-7 banking days upon successful warehouse verification."
    },
    {
      icon: <FileText className="text-cyan-400" size={24} />,
      title: "6. Limitation of Liability",
      content: "In no event shall Flux Store Inc., its directors, employees, or tech partners be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use our products or services, even if we have been explicitly advised of the possibility of such damages."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 pt-28 sm:pt-32 pb-24 selection:bg-cyan-500/30">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-cyan-950/10 blur-[140px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight"
          >
            Terms of <span className="text-cyan-400">Service.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide uppercase"
          >
            Last Updated: {lastUpdated}
          </motion.p>
        </div>

        {/* Intro Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-dark rounded-2xl p-5 sm:p-6 border border-white/5 bg-white/[0.01] mb-10 sm:mb-12 text-xs sm:text-sm leading-relaxed text-gray-400"
        >
          Please read these terms and conditions carefully before operating our platform. By accessing or using the services provided by Flux Store Inc., you confirm your alignment and contractual binding with the rules and guidelines detailed below.
        </motion.div>

        {/* Legal Sections Grid */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="border-b border-white/5 pb-8 last:border-none"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight">{section.title}</h3>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed pl-0 sm:pl-14">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Dynamic Support Contact Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center border-t border-white/10 pt-10"
        >
          <p className="text-sm text-gray-500 mb-2">Have legal questions regarding our terms?</p>
          <p className="text-sm sm:text-base text-gray-300">
            Contact our administration team at{" "}
            <a href="mailto:legal@fluxstore.com" className="text-cyan-400 hover:underline font-medium">
              legal@fluxstore.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;