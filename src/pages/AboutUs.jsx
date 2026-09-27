import { motion } from 'framer-motion';
import { Target, Zap, ShieldCheck, Users, Award, TrendingUp, Heart } from 'lucide-react';
import Stats from '../components/Stats';
import Brands from '../components/Brands';
import ComingSoonHero from '../components/ComingSoonHero';

const AboutUs = () => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="relative bg-[#050505] text-white min-h-screen pt-28 sm:pt-32 overflow-hidden">
      {/* Spline Background */}
      <div className="spline-container absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <iframe
          src="https://my.spline.design/font-PoWAh7XBlgAoAcENsaYMuA9u/"
          frameborder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="Aura Spline Background"
        />
        <div className="absolute inset-0 bg-[#050505]/70" />
      </div>

      <div className="relative z-10">
      {/* Coming Soon Hero Section */}
      <ComingSoonHero />

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