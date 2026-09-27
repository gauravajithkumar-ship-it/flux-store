import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const viewport = { once: true, margin: '-80px' };

const SectionHeader = ({ index, eyebrow, title, description, actionLabel, actionTo }) => {
  return (
    <div className="mb-12 flex flex-col gap-8 sm:mb-16 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gray-500"
        >
          {index && <span className="text-cyan-400/80">{index}</span>}
          <span className="h-px w-6 bg-white/15" />
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
          className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="mt-5 max-w-md text-sm leading-relaxed text-gray-400"
          >
            {description}
          </motion.p>
        )}
      </div>

      {actionTo && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="shrink-0"
        >
          <Link
            to={actionTo}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-cyan-300"
          >
            {actionLabel}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default SectionHeader;
