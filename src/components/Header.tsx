
import { Phone, Mail } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">M.R. STORE</h1>
            <span className="text-sm text-muted-foreground hidden md:block">
              Your Construction Partner Since Years
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="hidden md:flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+91 86387 13719</span>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>mrstoreofficial24@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
