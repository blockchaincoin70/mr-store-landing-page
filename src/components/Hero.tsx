
import { Phone, Mail, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight hover:scale-105 transition-transform duration-500">
                Your One-Stop
                <span className="text-orange-400 block animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  Construction Materials Hub
                </span>
              </h1>
              <p className="text-xl text-slate-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                Premium quality building materials for all your construction needs. 
                From TMT bars to cement, we've got everything to build your dreams.
              </p>
            </div>
            
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-300">
                <Phone className="h-5 w-5 text-orange-400 animate-pulse" />
                <div>
                  <div className="font-semibold">+91 86387 13719</div>
                  <div className="text-slate-400">+91 96786 53088</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-300">
                <Mail className="h-5 w-5 text-orange-400" />
                <span>mrstoreofficial24@gmail.com</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: '1.1s' }}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-110 transition-all duration-300 hover:shadow-lg">
                Get Quote Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 hover:scale-110 transition-all duration-300 group">
                <span>View Products</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
          
          <div className="relative animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <Building className="h-8 w-8 mx-auto mb-2 text-white animate-bounce" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">Projects Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.4s' }}>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm">Product Categories</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.6s' }}>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
