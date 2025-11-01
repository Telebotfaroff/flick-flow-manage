import { cn } from "@/lib/utils";

export const CategoryFilters = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-4 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300",
          !selectedCategory
            ? "bg-gradient-to-r from-red-600 to-yellow-500 scale-105 shadow-lg"
            : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700",
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.slug)}
          className={cn(
            "px-4 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300",
            selectedCategory === category.slug
              ? "bg-gradient-to-r from-red-600 to-yellow-500 scale-105 shadow-lg"
              : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700",
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};