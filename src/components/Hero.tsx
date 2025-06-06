
import { Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your One-Stop
                <span className="text-orange-400 block">Construction Materials Hub</span>
              </h1>
              <p className="text-xl text-slate-300">
                Premium quality building materials for all your construction needs. 
                From TMT bars to cement, we've got everything to build your dreams.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <div>
                  <div className="font-semibold">+91 86387 13719</div>
                  <div className="text-slate-400">+91 96786 53088</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span>mrstoreofficial24@gmail.com</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Quote Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                View Products
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <Building className="h-8 w-8 mx-auto mb-2 text-white" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">Projects Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm">Product Categories</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
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
