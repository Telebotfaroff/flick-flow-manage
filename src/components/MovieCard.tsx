import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  poster_url?: string;
  year?: number;
  rating?: number;
  created_at: string;
}

export const MovieCard = ({ id, title, poster_url, year, rating, created_at }: MovieCardProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/movie/${id}`)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-secondary">
        {poster_url ? (
          <img
            src={poster_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
          WEB-DL
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
            <Star className="w-3 h-3 mr-1" />
            {rating || "N/A"}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase mb-2">{formattedDate}</p>
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {year && <p className="text-xs text-muted-foreground mt-1">Year: {year}</p>}
      </div>
    </Card>
  );
};
