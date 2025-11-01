import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Play, Calendar, Clock, Star, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*, categories(id, name, slug)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedMovies = [] } = useQuery({
    queryKey: ["related-movies", movie?.categories?.id, id],
    queryFn: async () => {
      if (!movie?.categories?.id) return [];
      const { data, error } = await supabase
        .from("movies")
        .select("id, title, poster_url, categories(name, slug)")
        .eq("category_id", movie.categories.id)
        .neq("id", id)
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!movie,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar categories={categories} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar categories={categories} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Movie not found</h2>
            <Button onClick={() => navigate("/")} className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black">
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar categories={categories} />
      
      <div className="relative h-[50vh] md:h-[60vh]">
        {movie.banner_url && (
          <img
            src={movie.banner_url}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        
        <Button
          variant="ghost"
          className="absolute top-24 md:top-6 left-4 text-white hover:bg-white/10 z-20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </div>

      <main className="container mx-auto px-4 pb-12 -mt-48 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-auto object-cover rounded-xl shadow-2xl border-4 border-gray-800"
              />
            )}
          </div>

          <div className="flex-1 space-y-6 pt-8 md:pt-24">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title}
              </h1>
              {movie.categories && (
                <Badge className="bg-yellow-500 text-black text-sm">{movie.categories.name}</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
              {movie.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{movie.duration} min</span>
                </div>
              )}
              {movie.rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-lg text-white">{movie.rating}/10</span>
                </div>
              )}
            </div>

            {movie.description && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {movie.trailer_url && (
                <Button
                  size="lg"
                  onClick={() => window.open(movie.trailer_url, "_blank")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg"
                >
                  <Play className="mr-2 h-6 w-6" />
                  Watch Trailer
                </Button>
              )}
              {movie.download_url && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(movie.download_url, "_blank")}
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold text-lg"
                >
                  <Download className="mr-2 h-6 w-6" />
                  Download
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("https://t.me/vegamovies", "_blank")}
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black font-bold text-lg"
              >
                <Send className="mr-2 h-6 w-6" />
                Join Telegram
              </Button>
            </div>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Related Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <div key={relatedMovie.id} className="cursor-pointer group" onClick={() => navigate(`/movie/${relatedMovie.id}`)}>
                  <div className="overflow-hidden rounded-lg">
                    {relatedMovie.poster_url && (
                      <img
                        src={relatedMovie.poster_url}
                        alt={relatedMovie.title}
                        className="w-full h-auto object-cover rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mt-2 group-hover:text-yellow-500">{relatedMovie.title}</h3>
                  {relatedMovie.categories && (
                    <p className="text-sm text-gray-400">{relatedMovie.categories.name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
