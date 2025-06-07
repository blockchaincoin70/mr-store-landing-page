
import { Phone, Mail, Building2 } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">M.R. STORE</h1>
                <span className="text-xs text-slate-500 font-medium">Building Materials Hub</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-orange-600 transition-colors">
              <Phone className="h-4 w-4" />
              <span>+91 86387 57425</span>
            </div>
            <div className="hidden lg:flex items-center space-x-2 text-slate-600 hover:text-orange-600 transition-colors">
              <Mail className="h-4 w-4" />
              <span>mrstoreofficial24@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
