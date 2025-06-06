
import { Phone, Mail, Building } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-400">M.R. STORE</h3>
            <p className="text-slate-300 mb-4">
              Your trusted partner for all construction materials. Quality products, 
              competitive prices, and exceptional service since years.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-sm">+91 86387 13719</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-sm">mrstoreofficial24@gmail.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-slate-300">
              <li>TMT Steel Bars</li>
              <li>Cement & Concrete</li>
              <li>Bricks & Blocks</li>
              <li>Roofing Materials</li>
              <li>MS Angles & Plates</li>
              <li>Hardware & Tools</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Why Choose Us</h4>
            <ul className="space-y-2 text-slate-300">
              <li>✓ Premium Quality Materials</li>
              <li>✓ Competitive Pricing</li>
              <li>✓ Fast Delivery</li>
              <li>✓ Expert Consultation</li>
              <li>✓ 24/7 Customer Support</li>
              <li>✓ Trusted by 500+ Projects</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 M.R. STORE. All rights reserved. Built with quality and trust.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
