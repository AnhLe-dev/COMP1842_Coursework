import React from "react";
import { Badge } from "../ui/badge";
import { Search, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { categories } from "../../lib/data";


const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  currentCategory = "All",
  setCategory,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-border/50 sm:flex-row sm:items-center shadow-sm">
      {/* Search Input */}
      <div className="relative w-full sm:w-72 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search issue code or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 bg-white border-border/50 focus:border-primary/50"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-end w-full">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={currentCategory === cat ? "gradient" : "outline"}
            size="sm"
            className="capitalize h-9"
            onClick={() => setCategory(cat)}
          >
            {currentCategory === cat && <Filter className="size-3 mr-1" />}
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;