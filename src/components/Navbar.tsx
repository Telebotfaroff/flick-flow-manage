import { Film, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MovieHub
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                HOME
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Featured
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Genre
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                By Year
              </Button>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
