import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import SectionHeader from './SectionHeader';

const EASE = [0.22, 1, 0.36, 1];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const Trending = () => {
  const { products, isLoading } = useProducts();
  const trendingProducts = products.slice(0, 4);

  if (isLoading) return null;

  return (
    <section className="relative px-6 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="01"
          eyebrow="Featured"
          title="The Shortlist."
          description="A focused edit of the pieces our team is most excited about right now."
          actionLabel="View all products"
          actionTo="/products"
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trendingProducts.map((product) => {
            const finalPrice = product.discount
              ? (product.price * (1 - product.discount / 100)).toFixed(2)
              : product.price;

            return (
              <motion.article key={product.id} variants={cardVariants} className="group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-500 group-hover:border-white/20">
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {product.discount ? (
                      <span className="absolute left-4 top-4 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cyan-300 backdrop-blur-md">
                        {product.discount}% off
                      </span>
                    ) : null}
                  </div>
                </Link>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      <span>{product.brand}</span>
                      {product.rating ? (
                        <span className="flex items-center gap-1 normal-case tracking-normal text-gray-600">
                          <Star size={10} className="fill-cyan-400/70 text-cyan-400/70" />
                          {product.rating}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-base">
                      {product.name}
                    </h3>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-white sm:text-base">₹{finalPrice}</p>
                    {product.discount ? (
                      <p className="text-xs text-gray-600 line-through">₹{product.price}</p>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Trending;
