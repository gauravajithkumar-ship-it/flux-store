const brands = [
  'Samsung', 'Sony', 'TCL', 'JBL', 'Panasonic', 'boAt', 'Noise', 'Bosch', 'LG', 'Whirlpool',
];

const BrandRow = () => {
  return (
    <section className="border-y border-white/[0.06] px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gray-600">
          Trusted by the world&rsquo;s most innovative teams
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:mt-10 sm:gap-x-14 sm:gap-y-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="select-none text-sm font-semibold tracking-tight text-white/25 transition-colors duration-500 hover:text-white/60 sm:text-base"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandRow;
