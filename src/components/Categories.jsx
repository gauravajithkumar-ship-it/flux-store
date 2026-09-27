import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

const EASE = [0.22, 1, 0.36, 1];

const categories = [
  {
    name: 'Mobile',
    desc: 'Your world',
    img: 'https://image01-in.oneplus.net/media/202512/12/6a170dab86cd3648d17115d7b32a8470.png?x-amz-process=image/format,webp/quality,Q_80',
  },
  {
    name: 'Audio',
    desc: 'Immersive sound',
    img: 'https://www.genesispc.in/cdn/shop/files/X9-Black.webp?v=1774094745&width=1780',
  },
  {
    name: 'TV',
    desc: 'Cinematic viewing',
    img: 'https://cdn.moglix.com/p/YAB4ksru9VzCu-xxlarge.jpg',
  },
  {
    name: 'Washing Machine',
    desc: 'Smart appliances',
    img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=400',
  },
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const Categories = () => {
  return (
    <section id="categories" className="relative scroll-mt-24 px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="02"
          eyebrow="Categories"
          title="Find Your Department."
          description="Four focused collections, each curated from top to bottom — nothing extra, nothing missing."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={cardVariants}>
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 transition-colors duration-500 hover:border-white/25"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.03]">
                  <img
                    src={category.img}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-70 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-base font-medium tracking-tight text-white sm:text-lg">
                    {category.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs text-gray-400">{category.desc}</p>
                    <ArrowRight
                      size={13}
                      className="shrink-0 -translate-x-1 text-cyan-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
