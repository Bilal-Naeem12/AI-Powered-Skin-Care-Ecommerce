
import HeroSection from './HeroSection';
import AISection from './AISection';
import ProductList from './ProductList';
import MainLayout from '../../component/Layout/MainLayout';

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <AISection />
      <ProductList />
    </MainLayout>
  );
};

export default HomePage;
