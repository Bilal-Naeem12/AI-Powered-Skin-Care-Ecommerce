import HeroSection from './HeroSection';
import AISection from './AISection';
import ProductShowcase from './ProductShowcase';
import MainLayout from '../../../component/Layout/MainLayout';
import { useEffect } from 'react';
import { checkRefreshToken } from '@/store/AuthStore';
import useUserStore from '@/store/UserStore';
import OnboardingModal from '@/component/UI/OnboardingModal'; // ✅ import your modal

const HomePage = () => {
  const { user } = useUserStore();

  useEffect(() => {
    checkRefreshToken();
  }, []);

  const shouldShowOnboarding = user && user.walkThroughCompleted === false;

  return (
    <MainLayout>
      <HeroSection />
      <AISection />
      <ProductShowcase />

      {/* ✅ Auto-show onboarding if needed */}
      {shouldShowOnboarding && <OnboardingModal />}
    </MainLayout>
  );
};

export default HomePage;
