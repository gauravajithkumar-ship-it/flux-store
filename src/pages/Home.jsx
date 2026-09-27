import Hero from '../components/Hero';
import Trending from '../components/Trending';
import Categories from '../components/Categories';
import BrandRow from '../components/BrandRow';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <main className="bg-[#0a0a0a] text-gray-100">
      <Hero />
      <Trending />
      <Categories />
      <BrandRow />
      <Newsletter />
    </main>
  );
};

export default Home;
