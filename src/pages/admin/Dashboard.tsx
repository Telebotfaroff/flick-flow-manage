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
      color: "text-blue-400",
      borderColor: "border-blue-400",
    },
    {
      title: "Categories",
      value: categoriesCount,
      icon: Grid3x3,
      color: "text-purple-400",
      borderColor: "border-purple-400",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-400",
      borderColor: "border-green-400",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Overview of your movie platform</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className={`bg-gray-800/50 backdrop-blur-sm border-t-4 ${stat.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
