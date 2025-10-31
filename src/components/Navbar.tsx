import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MovieHub
              </span>
            </div>
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
        </div>
      </div>
    </nav>
  );
};
