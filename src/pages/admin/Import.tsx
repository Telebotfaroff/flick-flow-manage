import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export default function Import() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const { data, error } = await supabase.functions.invoke("tmdb-import", {
        body: { action: "search", query },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSearchResults(data.results || []);
      setIsSearching(false);
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      setIsSearching(false);
    },
  });

  const importMutation = useMutation({
    mutationFn: async ({ movieId, categoryId }: { movieId: number; categoryId: string }) => {
      const { data, error } = await supabase.functions.invoke("tmdb-import", {
        body: { action: "import", movieId, categoryId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      toast({ title: "Movie imported successfully" });
    },
    onError: (error) => {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      searchMutation.mutate(searchQuery);
    }
  };

  const handleImport = (movieId: number) => {
    if (!selectedCategory) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate({ movieId, categoryId: selectedCategory });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Import from TMDB</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Search and import movies from The Movie Database
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            <Search className="mr-2 h-4 w-4" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <>
            <div>
              <label className="text-sm font-medium">Default Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  )}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{movie.release_date?.split("-")[0]}</span>
                      <span>•</span>
                      <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleImport(movie.id)}
                      disabled={importMutation.isPending}
                    >
                      {importMutation.isPending ? "Importing..." : "Import Movie"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12 text-muted-foreground">
            No movies found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
}
