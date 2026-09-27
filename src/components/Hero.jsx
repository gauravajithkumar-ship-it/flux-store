import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp } from 'lucide-react';
import Galaxy from './Galaxy';

const EASE = [0.22, 1, 0.36, 1];

const Hero = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">

        <Galaxy
          hueShift={186}
          saturation={0.55}
          glowIntensity={0.42}
          starSpeed={0.45}
          twinkleIntensity={0.35}
          mouseInteraction={false}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/90 to-[#050505]" />
      </div>

      {/* Copy */}
      <div className="relative z-10 flex flex-1 items-center px-6 pt-36 pb-12 sm:px-8 sm:pt-40 sm:pb-16 lg:px-12">
        <div className="mx-auto w-full max-w-5xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-8 flex items-center justify-center gap-4 sm:mb-10"
          >
            <span className="h-px w-8 bg-cyan-400/50" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400 sm:text-[11px]">
              Premium Technology
            </span>
            <span className="h-px w-8 bg-cyan-400/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            className="text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
          >
            <span className="block text-white/35">Experience</span>
            <span className="block text-white">The Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-gray-400 sm:mt-10 sm:text-base"
          >
            State-of-the-art tech, curated to elevate the everyday. Immersive audio,
            stunning displays, and raw power.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 hover:bg-cyan-300 sm:w-auto"
            >
              Shop The Collection
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href="#categories"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-gray-300 transition-colors duration-300 hover:border-white/35 hover:text-white sm:w-auto"
            >
              Browse Categories
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex justify-center pb-10 sm:pb-12">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.4em] text-gray-600">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-cyan-400/80"
              animate={{ y: ['-100%', '300%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </div>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/60 text-gray-300 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:text-white sm:bottom-8 sm:right-8"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
