import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">Privacy <span className="text-cyan-400">Policy</span></h1>
            <p className="text-gray-400">Last updated: June 30, 2026</p>
          </div>
          
          <div className="glass p-5 sm:p-8 md:p-12 rounded-3xl border border-white/10 text-gray-300">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="mb-8 leading-relaxed">
              Welcome to Flux Store. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">2. The Data We Collect About You</h2>
            <p className="mb-4 leading-relaxed">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 sm:pl-6 mb-8 space-y-3">
              <li><strong className="text-white">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-white">Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong className="text-white">Financial Data</strong> includes bank account and payment card details.</li>
              <li><strong className="text-white">Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong className="text-white">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">3. How We Use Your Personal Data</h2>
            <p className="mb-8 leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you, where it is necessary for our legitimate interests, or where we need to comply with a legal obligation.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="mb-8 leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">5. Your Legal Rights</h2>
            <p className="mb-8 leading-relaxed">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@fluxstore.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">privacy@fluxstore.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
