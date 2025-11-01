import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Play, Calendar, Clock, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*, categories(name, slug)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Movie not found</h2>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Banner Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {movie.banner_url && (
          <img
            src={movie.banner_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl border-2 border-border"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              {movie.categories && (
                <Badge variant="secondary" className="mb-4">
                  {movie.categories.name}
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {movie.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration} min</span>
                </div>
              )}
              {movie.rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>
              )}
            </div>

            {/* Description */}
            {movie.description && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {movie.trailer_url && (
                <Button
                  size="lg"
                  onClick={() => window.open(movie.trailer_url, "_blank")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              {movie.download_url && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(movie.download_url, "_blank")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-32" />
    </div>
  );
}
