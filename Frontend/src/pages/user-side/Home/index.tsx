
import HeroSection from './HeroSection';
import AISection from './AISection';
import ProductShowcase from './ProductShowcase';
import MainLayout from '../../../component/Layout/MainLayout';
import { useEffect } from 'react';
import { checkRefreshToken, useAuthStore } from '@/store/useAuthStore';
import useUserStore from '@/store/useUserStore';

const HomePage = () => {

useEffect(() => {
  checkRefreshToken();
}, []);
const { isRefreshTokenValid } = useAuthStore();
const {logout} = useUserStore()
 useEffect(() => {
    if (isRefreshTokenValid === false) {
      logout(false); // Or navigate to login
    }
  }, [isRefreshTokenValid, logout]);


  return (
    <MainLayout>
      <HeroSection />
      <AISection />
      <ProductShowcase />
    </MainLayout>
  );
};

export default HomePage;
