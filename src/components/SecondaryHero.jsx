import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecondaryHero = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0d0d0d] to-[#0a0a0a] z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Pushing the Boundaries of <span className="text-goldlux-orange">Innovation</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              We don't just follow trends; we set them. Our latest lineup features revolutionary processors, mind-bending displays, and materials sourced from the edge of tomorrow. Whether you are a creator, a gamer, or a professional, experience uncompromised performance that adapts to your needs.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                { icon: Cpu, text: "Next-Gen Quantum Processing" },
                { icon: Layers, text: "Ultra-Durable Aerospace Materials" },
                { icon: Sparkles, text: "AI-Powered Adaptive Environments" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300">
                  <div className="p-2 bg-goldlux-orange/10 rounded-lg text-goldlux-orange shrink-0">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-sm sm:text-base">{item.text}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-goldlux-orange/30 hover:border-goldlux-orange/60 hover:bg-goldlux-orange/5 text-goldlux-orange transition-all duration-300 shadow-sm">
              Discover Our Story <ArrowRight size={18} />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-goldlux-orange/10 bg-white/5 p-2 relative z-10">
              <div className="w-full h-full rounded-2xl bg-[#111] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-goldlux-orange/5 to-goldlux-teal/5" />
                
                {/* Animated tech circles */}
                <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 border-[0.5px] border-goldlux-orange/20 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
                    <div className="w-36 h-36 sm:w-48 sm:h-48 border-[0.5px] border-goldlux-teal/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-goldlux-orange/10 rounded-full blur-xl absolute" />
                  <Cpu size={48} className="text-goldlux-orange drop-shadow-[0_0_15px_rgba(219,130,29,0.5)] relative z-20" />
                </div>
              </div>
            </div>
            
            {/* Decorative glows */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 bg-goldlux-orange/10 blur-3xl rounded-full z-0" />
            <div className="absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 bg-goldlux-teal/10 blur-3xl rounded-full z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryHero;

