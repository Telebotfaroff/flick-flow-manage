import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Grid3x3, Eye } from "lucide-react";

export default function Dashboard() {
  const { data: moviesCount = 0 } = useQuery({
    queryKey: ["movies-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("movies")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: categoriesCount = 0 } = useQuery({
    queryKey: ["categories-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: totalViews = 0 } = useQuery({
    queryKey: ["total-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("views");
      if (error) throw error;
      return data.reduce((sum, movie) => sum + (movie.views || 0), 0);
    },
  });

  const stats = [
    {
      title: "Total Movies",
      value: moviesCount,
      icon: Film,
      color: "text-primary",
    },
    {
      title: "Categories",
      value: categoriesCount,
      icon: Grid3x3,
      color: "text-accent",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your movie platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
