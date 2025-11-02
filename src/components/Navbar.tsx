import { Link, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navbar = ({ categories }) => {
  const [, setSearchParams] = useSearchParams();

  const clearFilters = () => {
    setSearchParams({});
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" onClick={clearFilters} className="flex items-center gap-2 text-2xl font-bold tracking-wider">
            Telemovie
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link to="/" onClick={clearFilters} className="hover:text-primary transition-colors">
              HOME
            </Link>
            <Link to="/?featured=true" className="hover:text-primary transition-colors">
              Featured
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-primary transition-colors focus:outline-none">
                Genre
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/?genre=${category.slug}`} className="hover:bg-muted">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-primary transition-colors focus:outline-none">
                By Year
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuItem key={year} asChild>
                    <Link to={`/?year=${year}`} className="hover:bg-muted">
                      {year}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-6 p-6 text-lg font-medium">
                    <Link to="/" onClick={clearFilters} className="hover:text-primary transition-colors">
                      HOME
                    </Link>
                    <Link to="/?featured=true" className="hover:text-primary transition-colors">
                      Featured
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="hover:text-primary transition-colors focus:outline-none text-left w-full">
                        Genre
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {categories.map((category) => (
                          <DropdownMenuItem key={category.id} asChild>
                            <Link to={`/?genre=${category.slug}`} className="hover:bg-muted">
                              {category.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="hover:text-primary transition-colors focus:outline-none text-left w-full">
                        By Year
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {years.map((year) => (
                          <DropdownMenuItem key={year} asChild>
                            <Link to={`/?year=${year}`} className="hover:bg-muted">
                              {year}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
