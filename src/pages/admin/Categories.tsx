import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Categories() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category deleted successfully" });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl sm:text-3xl">Categories</CardTitle>
            <p className="text-muted-foreground">Manage movie categories</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingCategory(null)}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <VisuallyHidden>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </VisuallyHidden>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onClose={() => {
                  setOpen(false);
                  setEditingCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <div className="border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
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

function CategoryForm({
  category,
  onClose,
}: {
  category: any;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (category) {
        const { error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: category
          ? "Category updated successfully"
          : "Category added successfully",
      });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          required
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value;
            setFormData({
              name,
              slug: generateSlug(name),
            });
          }}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Slug</label>
        <Input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {category ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
