import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, movieId, categoryId } = await req.json();
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY');
    
    if (!tmdbApiKey) {
      throw new Error('TMDB API key not configured');
    }

    // Search for movies
    if (action === 'search') {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Import a specific movie
    if (action === 'import') {
      // Get movie details
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`
      );
      const movieData = await movieResponse.json();

      // Get videos (for trailer)
      const videosResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}`
      );
      const videosData = await videosResponse.json();
      const trailer = videosData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insert movie into database
      const { data: insertedMovie, error } = await supabase
        .from('movies')
        .insert({
          title: movieData.title,
          description: movieData.overview,
          poster_url: movieData.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` 
            : null,
          banner_url: movieData.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}` 
            : null,
          year: movieData.release_date ? parseInt(movieData.release_date.split('-')[0]) : null,
          rating: movieData.vote_average,
          duration: movieData.runtime,
          trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
          category_id: categoryId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting movie:', error);
        throw error;
      }

      return new Response(JSON.stringify(insertedMovie), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tmdb-import:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
