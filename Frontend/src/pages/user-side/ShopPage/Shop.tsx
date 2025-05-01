import React, { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortOptions from "./SortOptions";
import useFetchData from "@/hooks/useFetchData";
import { Product } from "@/types/Product";
import { CircularProgress, Pagination } from "@mui/material";

const Shop: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState<"asc" | "desc" |"discount" |""| undefined>(undefined);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"in" | "out" | undefined>(undefined);

  // Construct URL
  let url = `${import.meta.env.VITE_API_BACKEND_URL}/products?page=${page}&limit=12`;
  if (sortOption) url += `&sort=${sortOption}`;
  if (selectedCategory) url += `&category=${selectedCategory}`;
  if (selectedBrand) url += `&brand=${selectedBrand}`;
  if (priceRange[0] > 0) url += `&minPrice=${priceRange[0]}`;
  if (priceRange[1] < 100) url += `&maxPrice=${priceRange[1]}`;
  if (selectedSkinTypes.length > 0) url += `&skinType=${selectedSkinTypes.join(",")}`;
  if (availability) url += `&availability=${availability}`;

  const { data, loading, error } = useFetchData<{ products: Product[]; page: number; limit: number; totalCount: number }>(url);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const handleSortChange = (option: string) => {
  if (option === "low-to-high") {
    setSortOption("asc");
  } else if (option === "high-to-low") {
    setSortOption("desc");
  } else if (option === "discount") {
    setSortOption("discount");
  } else {
    setSortOption(""); // relevance (default)
  }
};


  return (
    <div className="container mx-auto my-6 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSkinTypes={selectedSkinTypes}
          setSelectedSkinTypes={setSelectedSkinTypes}
          availability={availability}
          setAvailability={setAvailability}
          resetPage={() => setPage(1)}
        />

        <div className="flex-1 p-6 border shadow-md rounded-lg">
          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Results ({data?.totalCount ?? 0})
            </h2>
            <SortOptions sortOption={sortOption??""} setSortOption={handleSortChange} />

          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <CircularProgress />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Product Grid */}
              <ProductGrid products={data?.products ?? []} />

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  count={Math.ceil((data?.totalCount ?? 0) / (data?.limit ?? 8))}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
