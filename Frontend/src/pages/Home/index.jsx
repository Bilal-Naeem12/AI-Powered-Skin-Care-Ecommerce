
import HeroSection from './HeroSection';
import AISection from './AISection';
import ProductShowcase from './ProductShowcase';
import MainLayout from '../../component/Layout/MainLayout';

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <AISection />
      <ProductShowcase />
    </MainLayout>
  );
};

export default HomePage;
