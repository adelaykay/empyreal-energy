import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
    </MainLayout>
  );
}
