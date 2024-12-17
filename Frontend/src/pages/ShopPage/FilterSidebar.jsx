import React from "react";

const FilterSidebar = () => {
  return (
    <aside className="w-full md:w-1/4 border-r-2 border-gray-300 pr-3">
      <h3 className="text-xl font-bold mb-4">Filter</h3>

      {/* Price Filter */}
      <div className="mb-6">
        <p className="font-medium mb-2">Price</p>
        <input
          type="range"
          min="0"
          max="5000"
          className="w-full"
        />
      </div>

      {/* Availability */}
      <div className="mb-6">
        <p className="font-medium mb-2">Availability</p>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> In Stock
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Out of Stock
          </label>
        </div>
      </div>

      {/* Skin Type */}
      <div className="mb-6">
        <p className="font-medium mb-2">Skin Type</p>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Oily
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Dry
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Combination
          </label>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
