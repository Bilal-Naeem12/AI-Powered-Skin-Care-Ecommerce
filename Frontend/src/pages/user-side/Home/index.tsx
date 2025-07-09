
import HeroSection from './HeroSection';
import AISection from './AISection';
import ProductShowcase from './ProductShowcase';
import MainLayout from '../../../component/Layout/MainLayout';
import { useEffect } from 'react';
import { checkRefreshToken, useAuthStore  } from '@/store/AuthStore';
import useUserStore from '@/store/UserStore';

const HomePage = () => {

useEffect(() => {
  checkRefreshToken();
}, []);

  return (
    <MainLayout>
      <HeroSection />
      <AISection />
      <ProductShowcase />
    </MainLayout>
  );
};

export default HomePage;
