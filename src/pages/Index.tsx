import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilters } from "@/components/CategoryFilters";
import { MovieCard } from "@/components/MovieCard";
import { Loader2 } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const featured = searchParams.get("featured");
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const ITEMS_PER_PAGE = 10;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", searchTerm, featured, genre, year, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("movies")
        .select("*, categories(name)", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      if (featured) {
        query = query.gte("rating", 8);
      }

      if (genre) {
        const category = categories.find((c) => c.slug === genre);
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      if (year) {
        query = query.eq("year", year);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      query = query.range(from, to);

      const { data, error, count } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return { movies: data, count };
    },
    enabled: !!categories.length,
  });

  const movies = data?.movies || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      prev.delete("page");
      return prev;
    });
  };

  const handleSelectCategory = (category: string | null) => {
    setSearchParams((prev) => {
      if (category) {
        prev.set("genre", category);
      } else {
        prev.delete("genre");
      }
      prev.delete("page");
      return prev;
    });
  };

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar categories={categories} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <SearchBar
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={() => {}}
          />
          <CategoryFilters
            categories={categories}
            selectedCategory={genre}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-2xl">No movies found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            to={createPageUrl(currentPage - 1)}
                            className="hover:bg-gray-700"
                          />
                        </PaginationItem>
                      )}
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              to={createPageUrl(page)}
                              isActive={currentPage === page}
                              className={currentPage === page ? "bg-gray-700" : "hover:bg-gray-700"}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      {currentPage < pageCount && (
                        <PaginationItem>
                          <PaginationNext to={createPageUrl(currentPage + 1)} className="hover:bg-gray-700" />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
