import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Bell, Cpu, Layers, Package, Star } from 'lucide-react';

const HEADLINE = ['A', 'New', 'Store', 'Is'];
const HEADLINE_ACCENT = ['Coming', 'Soon'];

// Anti-gravity drift: each tile floats on its own slow, offset orbit.
const TILES = [
  { icon: Cpu, pos: 'left-0 top-[4%]', size: 40, delay: 0, duration: 9, drift: 22, tilt: 8 },
  { icon: Layers, pos: 'right-0 top-[18%]', size: 34, delay: 1.2, duration: 11, drift: 28, tilt: -10 },
  { icon: Package, pos: 'left-[1%] bottom-[14%]', size: 36, delay: 2.1, duration: 10, drift: 20, tilt: 6 },
  { icon: Star, pos: 'right-[3%] bottom-[3%]', size: 30, delay: 0.8, duration: 8.5, drift: 26, tilt: -7 },
];

// Nodes riding the concentric rings.
const ORB_NODES = [
  { inset: 'inset-[4%]', duration: 26, size: 7, bottom: false, tone: 'bg-cyan-300' },
  { inset: 'inset-[14%]', duration: 34, size: 5, bottom: true, tone: 'bg-white/60' },
];

const EASE = [0.22, 1, 0.36, 1];

const ComingSoonHero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-8 pb-20 sm:pt-10 sm:pb-24">
      {/* Ambient glow field */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-[-10%] top-[6%] h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute right-[-6%] bottom-[2%] h-[520px] w-[520px] rounded-full bg-blue-600/[0.08] blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.05] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#050505_100%)]" />
        <div className="flux-grid absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-y-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10">
        {/* ----------------------------- LEFT: COPY ----------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center lg:text-left"
        >
          {/* Eyebrow badge */}
          <div className="mb-8 flex justify-center sm:mb-10 lg:justify-start">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.06] px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300 sm:text-xs">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-[2.5rem] font-bold leading-[1.06] tracking-tighter sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            <motion.span
              className="block text-white"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
              }}
            >
              {HEADLINE.map((word) => (
                <motion.span
                  key={word}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
                  }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.span>

            <motion.span
              className="flux-shimmer block bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.45 } },
              }}
            >
              {HEADLINE_ACCENT.map((word) => (
                <motion.span
                  key={word}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
                  }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.span>
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mb-7 text-lg font-light tracking-wide text-cyan-200/80 sm:text-2xl"
          >
            Something Exciting Is On The Way
          </motion.p>

          {/* Divider */}
          <div className="mb-7 flex justify-center sm:mb-8 lg:justify-start">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.9, ease: EASE }}
              className="h-px w-40 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            />
          </div>

          {/* Intro message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
            className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-gray-400 sm:mb-12 sm:text-base lg:mx-0"
          >
            Flux Store is opening its doors — a new destination for premium technology, thoughtfully curated
            and delivered with care. Your current collection stays right where you left it, while a sharper,
            faster and more personal shopping experience is being built for you. The doors open shortly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
            className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link
              to="/products"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-cyan-400/40 bg-cyan-400/10 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-500 hover:border-cyan-300/70 hover:bg-cyan-400/20 hover:shadow-[0_0_34px_rgba(34,211,238,0.35)] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Explore The Collection
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium tracking-wide text-gray-300 backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:text-white hover:shadow-[0_0_28px_rgba(255,255,255,0.12)] sm:w-auto"
            >
              <Bell size={16} />
              Keep Me Posted
            </Link>
          </motion.div>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gray-600 lg:justify-start"
          >
            <Sparkles size={13} className="text-cyan-400/70" />
            Launching shortly
          </motion.p>
        </motion.div>

        {/* ----------------------------- CENTER: SEAM ---------------------------- */}
        <div aria-hidden="true" className="relative hidden h-[70vh] max-h-[620px] min-h-[360px] w-px self-center lg:block">
          <span className="flux-seam absolute inset-0 w-px" />
          <span className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        {/* ----------------------------- RIGHT: CAPSULE ---------------------------- */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          {/* Core glow */}
          <div className="pointer-events-none absolute inset-[8%] rounded-full bg-cyan-500/10 blur-[70px]" aria-hidden="true" />

          {/* Concentric rings */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="flux-ring absolute inset-[4%] rounded-full border border-white/[0.07]" />
            <div className="flux-ring-reverse absolute inset-[14%] rounded-full border border-dashed border-cyan-400/20" />
            <div className="absolute inset-[24%] rounded-full border border-white/[0.05]" />

            {/* Nodes riding the rings */}
            {!reduceMotion &&
              ORB_NODES.map(({ inset, duration, size, bottom, tone }, i) => (
                <motion.div
                  key={`node-${i}`}
                  className={`absolute ${inset}`}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration, repeat: Infinity, ease: 'linear' }}
                >
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 rounded-full ${tone} ${bottom ? 'bottom-0' : 'top-0'}`}
                    style={{ width: size, height: size, boxShadow: '0 0 14px rgba(34,211,238,0.9)' }}
                  />
                </motion.div>
              ))}
          </div>

          {/* Launch core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="absolute inset-[26%] flex items-center justify-center"
          >
            <div className="flux-core absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" aria-hidden="true" />
            <div className="glass-dark relative flex h-full w-full flex-col items-center justify-center rounded-full border border-cyan-300/20 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
              <span className="flux-shimmer bg-gradient-to-br from-white via-cyan-100 to-cyan-400 bg-clip-text text-5xl font-black leading-none text-transparent sm:text-6xl">
                F
              </span>
              <span className="mt-2 text-[9px] uppercase tracking-[0.42em] text-cyan-300/70">Flux</span>
            </div>
          </motion.div>

          {/* Hologram platform line */}
          <div className="pointer-events-none absolute inset-x-[16%] bottom-[6%] h-px" aria-hidden="true">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <div className="mx-auto mt-[-3px] h-1.5 w-24 rounded-full bg-cyan-400/40 blur-md" />
          </div>

          {/* Anti-gravity floating tiles */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {TILES.map(({ icon: Icon, pos, size, delay, duration, drift, tilt }, i) => (
              <motion.div
                key={i}
                className={`absolute ${pos}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  reduceMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0, 1, 1, 0.5],
                        scale: [0.6, 1, 1, 0.94],
                        y: [0, -drift, 0, -drift / 2, 0],
                        rotate: [0, tilt, 0, -tilt / 2, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.6 }
                    : { duration, delay, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.55, 0.8, 1] }
                }
              >
                <div className="glass relative flex items-center justify-center rounded-2xl p-3.5 shadow-[0_0_40px_rgba(34,211,238,0.12)] sm:p-4">
                  <Icon size={size} className="text-cyan-400/80 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <span className="absolute inset-0 rounded-2xl bg-cyan-400/5 blur-md" />
                </div>
              </motion.div>
            ))}

            {/* Drifting light motes */}
            {!reduceMotion &&
              Array.from({ length: 12 }).map((_, i) => (
                <motion.span
                  key={`mote-${i}`}
                  className="absolute h-1 w-1 rounded-full bg-cyan-300/60"
                  style={{
                    left: `${10 + ((i * 41) % 82)}%`,
                    top: `${12 + ((i * 57) % 80)}%`,
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: [0, -50 - (i % 5) * 20, -120] }}
                  transition={{ duration: 9 + (i % 6) * 1.6, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonHero;
