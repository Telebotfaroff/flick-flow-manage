import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface IFormInput {
  title: string;
  description: string;
  poster_url: string;
  banner_url: string;
  trailer_url: string;
  download_url: string;
  category_id: string;
  year: number;
  rating: number;
  duration: number;
}

export default function AddMovie() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInput>();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("movies").insert([{
        ...data,
        year: Number(data.year),
        rating: Number(data.rating),
        duration: Number(data.duration),
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Movie added successfully." });
      reset();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Movie</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <Input placeholder="Title" {...register("title", { required: true })} />
          {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
        </div>
        <div>
          <Textarea placeholder="Description" {...register("description", { required: true })} />
          {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input placeholder="Poster URL" {...register("poster_url", { required: true })} />
            {errors.poster_url && <p className="text-red-500 text-sm mt-1">Poster URL is required</p>}
          </div>
          <div>
            <Input placeholder="Banner URL" {...register("banner_url")} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input placeholder="Trailer URL" {...register("trailer_url")} />
          </div>
          <div>
            <Input placeholder="Download URL" {...register("download_url", { required: true })} />
            {errors.download_url && <p className="text-red-500 text-sm mt-1">Download URL is required</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Input type="number" placeholder="Year" {...register("year", { required: true, valueAsNumber: true })} />
            {errors.year && <p className="text-red-500 text-sm mt-1">Valid year is required</p>}
          </div>
          <div>
            <Input type="number" step="0.1" placeholder="Rating (e.g., 7.5)" {...register("rating", { required: true, valueAsNumber: true })} />
            {errors.rating && <p className="text-red-500 text-sm mt-1">Valid rating is required</p>}
          </div>
          <div>
            <Input type="number" placeholder="Duration (minutes)" {...register("duration", { required: true, valueAsNumber: true })} />
            {errors.duration && <p className="text-red-500 text-sm mt-1">Valid duration is required</p>}
          </div>
        </div>
        <div>
          <Select onValueChange={(value) => control.setValue("category_id", value)} disabled={isLoadingCategories}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="text-red-500 text-sm mt-1">Category is required</p>}
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Movie
        </Button>
      </form>
    </div>
  );
}
