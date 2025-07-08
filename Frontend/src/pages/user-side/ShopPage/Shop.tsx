import React, { useState, useMemo } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortOptions from "./SortOptions";
import useFetchData from "@/hooks/useFetchData";
import { Product } from "@/types/Product";
import { CircularProgress, Pagination } from "@mui/material";

const Shop: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState<
    "asc" | "desc" | "discount" | "" | undefined
  >(undefined);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // ✅ multi-select
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"in" | "out" | undefined>(
    undefined
  );

  // ✅ UseMemo for URL to re-run when any dependency changes
  const url = useMemo(() => {
    let u = `${import.meta.env.VITE_API_BACKEND_URL}/products?page=${page}&limit=12`;
    if (sortOption) u += `&sort=${sortOption}`;
    if (selectedCategory) u += `&category=${selectedCategory}`;
    if (selectedBrands.length > 0) u += `&brand=${selectedBrands.join(",")}`;
    if (priceRange[0] > 0) u += `&minPrice=${priceRange[0]}`;
    if (priceRange[1] < 100) u += `&maxPrice=${priceRange[1]}`;
    if (selectedSkinTypes.length > 0)
      u += `&skinType=${selectedSkinTypes.join(",")}`;
    if (availability) u += `&availability=${availability}`;
    return u;
  }, [
    page,
    sortOption,
    selectedCategory,
    selectedBrands,
    priceRange,
    selectedSkinTypes,
    availability,
  ]);

  const { data, loading, error } = useFetchData<{
    products: Product[];
    page: number;
    limit: number;
    totalCount: number;
  }>(url);

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
      setSortOption("");
    }
    setPage(1); // ✅ Reset page when sort changes
  };

  return (
    <div className="container mx-auto my-6 sm:px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            setPage(1); // ✅ Reset page when filter changes
          }}
          selectedBrands={selectedBrands}
          setSelectedBrands={(brands) => {
            setSelectedBrands(brands);
            setPage(1);
          }}
          priceRange={priceRange}
          setPriceRange={(range) => {
            setPriceRange(range);
            setPage(1);
          }}
          selectedSkinTypes={selectedSkinTypes}
          setSelectedSkinTypes={(types) => {
            setSelectedSkinTypes(types);
            setPage(1);
          }}
          availability={availability}
          setAvailability={(value) => {
            setAvailability(value);
            setPage(1);
          }}
          resetPage={() => setPage(1)}
        />

        <div className="flex-1 p-6 border shadow-md rounded-lg">
          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Results ({data?.totalCount ?? 0})
            </h2>
            <SortOptions
              sortOption={sortOption ?? ""}
              setSortOption={handleSortChange}
            />
          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <CircularProgress sx={{ color: "black" }} />
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
                  count={Math.ceil(
                    (data?.totalCount ?? 0) / (data?.limit ?? 8)
                  )}
                  page={page}
                  onChange={handlePageChange}
                  shape="rounded"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#333",
                      borderColor: "#ddd",
                      fontWeight: 500,
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#FF69B4",
                      color: "#fff",
                      borderColor: "#FF69B4",
                      "&:hover": {
                        backgroundColor: "#ff85c1",
                      },
                    },
                  }}
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
