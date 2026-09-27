// src/components/Shop/SortOptions.tsx
import React from "react";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, setSortOption }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-700 text-sm font-medium" htmlFor="sort">
        Sort by:
      </label>
      <select
        id="sort"
        value={sortOption === "asc" ? "low-to-high" : sortOption === "desc" ? "high-to-low" : sortOption || "relevance"}
     
        onChange={(e) => setSortOption(e.target.value)}
        className="border px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <option value="relevance">Relevance</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
        <option value="discount">Highest Discount</option>
      </select>
    </div>
  );
};

export default SortOptions;
