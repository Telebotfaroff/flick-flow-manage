import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const quickFilters = [
  { name: "Trending", color: "bg-warning hover:bg-warning/80" },
  { name: "Netflix", color: "bg-destructive hover:bg-destructive/80" },
  { name: "English", color: "bg-warning hover:bg-warning/80" },
];

export const CategoryFilters = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {quickFilters.map((filter) => (
          <Button
            key={filter.name}
            variant="secondary"
            className={`${filter.color} text-white font-semibold px-6 rounded-full`}
          >
            {filter.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm"
          onClick={() => onSelectCategory(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => onSelectCategory(category.slug)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};
