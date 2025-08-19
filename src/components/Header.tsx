import { School } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-primary text-primary-foreground shadow-primary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Colégio Zampieri</h1>
            <p className="text-primary-foreground/80 text-sm">Sistema de Rematrículas Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;