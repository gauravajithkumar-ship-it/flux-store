const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Premium Support' },
  { value: '100+', label: 'Awards Won' },
];

const Stats = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-goldlux-orange/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center md:text-left">
              <h4 className="text-3xl sm:text-4xl md:text-6xl font-bold text-cyan-400 mb-2 tracking-tighter">
                {stat.value}
              </h4>
              <p className="text-xs sm:text-sm md:text-base text-goldlux-orange font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;