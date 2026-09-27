const brands = [
  "Samsung", "Sony", "TCL", "JBL", "Panasonic", "boAt", "Noise", "Bosch", "LG", "Whirlpool"
];

const Brands = () => {
  return (
    <section className="py-10 sm:py-12 border-goldlux-orange/10 bg-goldlux-orange/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        <p className="text-center text-xs sm:text-sm font-medium text-goldlux-orange mb-6 sm:mb-8 uppercase tracking-widest px-2">
          Trusted by the world's most innovative teams
        </p>
        <div className="flex flex-wrap justify-center md:justify-between items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500 gap-x-8 gap-y-4 sm:gap-x-12 sm:gap-y-6 md:gap-4">
          {brands.map((brand, idx) => (
            <div key={idx} className="text-lg sm:text-xl md:text-2xl font-bold font-sans tracking-tighter text-cyan-400 hover:text-goldlux-orange transition-colors">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;