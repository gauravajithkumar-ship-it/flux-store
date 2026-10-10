import { motion } from 'framer-motion';
import { Target, Zap, ShieldCheck, Award, TrendingUp, Heart, MapPin, Navigation } from 'lucide-react';
import Stats from '../components/Stats';
import Brands from '../components/Brands';

const STORE_COORDS_DISPLAY = `22°16'08.8"N 73°11'58.8"E`;
const STORE_COORDS = '22.269111,73.199667';
const STORE_MAPS_EMBED = `https://www.google.com/maps?q=${STORE_COORDS}&hl=en&z=15&output=embed`;

const AboutUs = () => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="relative bg-[#050505] text-white min-h-screen pt-28 sm:pt-32 overflow-hidden">
      <div className="relative z-10">
      {/* Meet Our Store Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-24 sm:mb-32">
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.06] px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300 sm:text-xs">
                Our Store
              </span>
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight"
          >
            Meet Our <span className="text-cyan-400">Store.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base"
          >
            Come experience Flux Store in person — explore our collection, meet the team and see
            what premium technology feels like. Find us at the location below.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass overflow-hidden rounded-3xl border border-white/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-cyan-400" /> Where To Find Us
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/[0.06] px-4 py-2 text-sm font-medium tracking-wide text-cyan-200">
                <MapPin size={15} className="text-cyan-400" />
                {STORE_COORDS_DISPLAY}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${STORE_COORDS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500 hover:border-cyan-300/70 hover:bg-cyan-400/20 hover:shadow-[0_0_34px_rgba(34,211,238,0.35)] sm:w-auto"
            >
              <Navigation size={16} />
              Get Directions
            </a>
          </div>
          <div className="h-[300px] sm:h-[420px] w-full border-t border-white/10 bg-black/40">
            <iframe
              title="Store Location Map"
              src={STORE_MAPS_EMBED}
              className="h-full w-full grayscale-[0.3] contrast-[1.05]"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </section>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-24 sm:mb-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-tight"
        >
          Built for <span className="text-cyan-400">Tomorrow.</span>
        </motion.h1>
      </section>

      {/* Story, Mission & Vision with Glow Effect */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-3 gap-6 sm:gap-8 mb-24 sm:mb-32">
        {[
          { title: "Our Story", text: "Born from a passion for premium tech...", icon: Zap },
          { title: "Our Mission", text: "To make high-end technology accessible...", icon: Target },
          { title: "Our Vision", text: "To lead the market by setting the gold standard...", icon: ShieldCheck }
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            // Border Glow Logic:
            // border-white/10: Base subtle border
            // hover:border-cyan-500/50: Color on hover
            // hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]: The glow effect
            className="glass p-6 sm:p-8 rounded-3xl border border-white/10 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <item.icon className="text-cyan-400 mb-5 sm:mb-6" size={32} />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 text-center">Our <span className="text-cyan-400">Core Values.</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Heart, label: "Customer-First" },
              { icon: Award, label: "Quality Assured" },
              { icon: TrendingUp, label: "Constant Innovation" },
              { icon: ShieldCheck, label: "Reliable Support" }
            ].map((val, i) => (
              <motion.div 
                key={i} 
                className="glass-dark p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-4 border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <val.icon className="text-cyan-400" size={32} />
                <span className="font-semibold text-center text-sm sm:text-base">{val.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats /> 
      <Brands /> 
      </div>
    </main>
  );
};

export default AboutUs;