import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const viewport = { once: true, margin: '-80px' };

const Newsletter = () => {
  return (
    <section className="px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-16">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gray-500">
                <span className="text-cyan-400/80">03</span>
                <span className="h-px w-6 bg-white/15" />
                Newsletter
              </p>

              <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                Be First To Know.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
                Exclusive offers, early access to new releases, and the latest in tech — delivered
                quietly, once in a while.
              </p>
            </div>

            <div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-300 focus:border-cyan-400/50"
                  required
                />
                <button
                  type="submit"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 hover:bg-cyan-300"
                >
                  Subscribe
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>

              <p className="mt-5 text-xs text-gray-600">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
