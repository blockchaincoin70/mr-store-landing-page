
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Map from "@/components/Map";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useViewTracking } from "@/hooks/useViewTracking";

const Index = () => {
  useViewTracking('/');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Products />
      <Reviews />
      <Contact />
      <Map />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
