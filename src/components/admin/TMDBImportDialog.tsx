import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export function TMDBImportDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      setSearchResults([]);
      setSearchQuery("");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Import from TMDB
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import from TMDB</DialogTitle>
        </DialogHeader>

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
                  <SelectTrigger>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="border border-border rounded-lg p-4 flex gap-4"
                  >
                    {movie.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        className="w-20 h-30 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {movie.overview}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{movie.release_date?.split("-")[0]}</span>
                        <span>•</span>
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                      </div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleImport(movie.id)}
                        disabled={importMutation.isPending}
                      >
                        Import
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
