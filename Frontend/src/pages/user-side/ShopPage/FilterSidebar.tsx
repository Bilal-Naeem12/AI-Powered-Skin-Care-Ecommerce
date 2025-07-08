// src/components/Shop/FilterSidebar.tsx
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Category } from "@/types/Category";
import useFetchData from "@/hooks/useFetchData";

/* available values */
const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const brands = ["CeraVe", "La Roche-Posay", "Neutrogena", "The Ordinary"];

interface FilterSidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedBrands: string[]; // ✅ UPDATED for multi-select
  setSelectedBrands: (brands: string[]) => void; // ✅ UPDATED for multi-select
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSkinTypes: string[];
  setSelectedSkinTypes: (types: string[]) => void;
  availability: "in" | "out" | undefined;
  setAvailability: (value: "in" | "out" | undefined) => void;
  resetPage: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrands, // ✅ UPDATED
  setSelectedBrands, // ✅ UPDATED
  priceRange,
  setPriceRange,
  selectedSkinTypes,
  setSelectedSkinTypes,
  availability,
  setAvailability,
  resetPage,
}) => {
  const { data: categories, loading, error } = useFetchData<Category[]>(
    `${import.meta.env.VITE_API_BACKEND_URL}/categories/`
  );

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleSkinTypeChange = (type: string) => {
    const updated = selectedSkinTypes.includes(type)
      ? selectedSkinTypes.filter((t) => t !== type)
      : [...selectedSkinTypes, type];
    setSelectedSkinTypes(updated);
    resetPage();
  };

  const handleBrandChange = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    resetPage();
  };

  return (
    <aside className="w-full md:w-1/4 p-4 border rounded-lg shadow-md bg-white space-y-4">
      <Typography variant="h6" className="font-bold mb-4">
        Filter Products
      </Typography>

      {/* Price Filter */}
      <Accordion
        expanded={expanded === "price"}
        onChange={handleAccordionChange("price")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => {
              setPriceRange(newValue as [number, number]);
              resetPage();
            }}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={1} // ✅ FIXED: smooth slider, steps of 1
          />
          <div className="flex justify-between text-xs mt-2 text-gray-600">
            <span>
              {import.meta.env.VITE_API_CURRENCY_Symbol} {priceRange[0]}
            </span>
            <span>
              {import.meta.env.VITE_API_CURRENCY_Symbol} {priceRange[1]}
            </span>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Availability */}
      <Accordion
        expanded={expanded === "availability"}
        onChange={handleAccordionChange("availability")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={availability === "in"}
                onChange={() => {
                  setAvailability(availability === "in" ? undefined : "in");
                  resetPage();
                }}
                size="small"
              />
            }
            label="In Stock"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={availability === "out"}
                onChange={() => {
                  setAvailability(availability === "out" ? undefined : "out");
                  resetPage();
                }}
                size="small"
              />
            }
            label="Out of Stock"
          />
        </AccordionDetails>
      </Accordion>

      {/* Category */}
      <Accordion
        expanded={expanded === "category"}
        onChange={handleAccordionChange("category")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-1">
          {categories?.map((cat) => (
            <FormControlLabel
              key={cat._id}
              control={
                <Checkbox
                  checked={selectedCategory === cat.name}
                  onChange={() => {
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name
                    );
                    resetPage();
                  }}
                  size="small"
                />
              }
              label={cat.name}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Skin Type */}
      <Accordion
        expanded={expanded === "skinType"}
        onChange={handleAccordionChange("skinType")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Skin Type</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-1">
          {skinTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedSkinTypes.includes(type)}
                  onChange={() => handleSkinTypeChange(type)}
                  size="small"
                />
              }
              label={type}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Brands */}
      <Accordion
        expanded={expanded === "brand"}
        onChange={handleAccordionChange("brand")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails className="space-y-1">
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands?.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  size="small"
                />
              }
              label={brand}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};

export default FilterSidebar;
