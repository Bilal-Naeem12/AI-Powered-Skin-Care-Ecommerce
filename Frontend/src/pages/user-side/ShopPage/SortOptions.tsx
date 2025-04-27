import React from "react";

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-gray-600">Sort by:</p>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border px-2 py-1 rounded-sm"
      >
        <option value="relevance">Relevance</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
        <option value="discount">Discount</option>
      </select>
    </div>
  );
};

export default SortOptions;
