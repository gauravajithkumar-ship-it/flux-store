import { motion } from 'framer-motion';

const ReturnPolicy = () => {
  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">Return <span className="text-cyan-400">Policy</span></h1>
            <p className="text-gray-400">Last updated: July 4, 2026</p>
          </div>
          
          <div className="glass p-5 sm:p-8 md:p-12 rounded-3xl border border-white/10 text-gray-300">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">1. Return Window</h2>
            <p className="mb-8 leading-relaxed">
              We offer a 30-day return policy for all unused and unworn items. If 30 days have passed since your purchase, unfortunately, we cannot offer you a refund or exchange.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">2. Condition of Returned Items</h2>
            <p className="mb-8 leading-relaxed">
              To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with all tags attached.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">3. Non-Returnable Items</h2>
            <p className="mb-8 leading-relaxed">
              Several types of goods are exempt from being returned, such as gift cards, personalized items, and clearance merchandise. Please contact our support team if you are unsure if your item qualifies.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">4. Process for Returns</h2>
            <p className="mb-8 leading-relaxed">
              To complete your return, please follow these steps:
              <br /><br />
              1. Contact our support team at <a href="mailto:support@fluxstore.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@fluxstore.com</a> to initiate the return process.<br />
              2. You will receive a Return Merchandise Authorization (RMA) number and shipping instructions.<br />
              3. Pack the item securely and include the RMA number inside the package.<br />
              4. Ship the item back to us using a trackable shipping method.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">5. Refunds</h2>
            <p className="mb-8 leading-relaxed">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about how to return your item to us, please contact us at <a href="mailto:support@fluxstore.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@fluxstore.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
