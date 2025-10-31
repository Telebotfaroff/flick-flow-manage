import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Movies() {
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movies = [] } = useQuery({
    queryKey: ["admin-movies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      toast({ title: "Movie deleted successfully" });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Movies</h2>
          <p className="text-muted-foreground">Manage your movie collection</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingMovie(null)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMovie ? "Edit Movie" : "Add New Movie"}
              </DialogTitle>
            </DialogHeader>
            <MovieForm
              movie={editingMovie}
              categories={categories}
              onClose={() => {
                setOpen(false);
                setEditingMovie(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{movie.categories?.name || "N/A"}</TableCell>
                <TableCell>{movie.year || "N/A"}</TableCell>
                <TableCell>{movie.rating || "N/A"}</TableCell>
                <TableCell>{movie.views || 0}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingMovie(movie);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MovieForm({
  movie,
  categories,
  onClose,
}: {
  movie: any;
  categories: any[];
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    poster_url: movie?.poster_url || "",
    banner_url: movie?.banner_url || "",
    year: movie?.year || "",
    rating: movie?.rating || "",
    duration: movie?.duration || "",
    download_url: movie?.download_url || "",
    trailer_url: movie?.trailer_url || "",
    category_id: movie?.category_id || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (movie) {
        const { error } = await supabase
          .from("movies")
          .update(data)
          .eq("id", movie.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("movies").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      toast({
        title: movie ? "Movie updated successfully" : "Movie added successfully",
      });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Poster URL</label>
          <Input
            value={formData.poster_url}
            onChange={(e) =>
              setFormData({ ...formData, poster_url: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Banner URL</label>
          <Input
            value={formData.banner_url}
            onChange={(e) =>
              setFormData({ ...formData, banner_url: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Year</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rating</label>
          <Input
            type="number"
            step="0.1"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Duration (min)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <Select
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData({ ...formData, category_id: value })
          }
        >
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

      <div>
        <label className="text-sm font-medium">Download URL</label>
        <Input
          value={formData.download_url}
          onChange={(e) =>
            setFormData({ ...formData, download_url: e.target.value })
          }
        />
      </div>

      <div>
        <label className="text-sm font-medium">Trailer URL</label>
        <Input
          value={formData.trailer_url}
          onChange={(e) =>
            setFormData({ ...formData, trailer_url: e.target.value })
          }
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {movie ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
