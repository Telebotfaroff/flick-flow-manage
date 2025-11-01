import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <div className="flex w-full items-center space-x-2 rounded-lg bg-gray-800 p-2 shadow-md">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search ..."
          value={value}
          onChange={onChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full bg-transparent pl-10 pr-4 py-2 text-white placeholder:text-gray-400 border-none focus:ring-0"
        />
      </div>
      <Button type="submit" onClick={onSearch} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-6 rounded-md">
        Search
      </Button>
    </div>
  );
};