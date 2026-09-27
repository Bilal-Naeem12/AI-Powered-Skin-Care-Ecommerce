/* src/pages/CategoryPage.tsx */
import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import ProductGrid from "../ProductGrid";
import { CircularProgress, Breadcrumbs, Typography, Avatar } from "@mui/material";
import MainLayout from "@/component/Layout/MainLayout";
import CategoryImage from "@/component/UI/CategoryImage";

export default function CategoryPage() {
  const { id = "" } = useParams<{ id: string }>();

  /* fetch category info */
  const { data: category, loading: catLoading, error: catError } =
    useFetchData<Category>(
      `${import.meta.env.VITE_API_BACKEND_URL}/categories/${id}`
    );

  /* fetch products in category */
 const {
  data: prodData,
  loading: prodLoading,
  error: prodError,
} = useFetchData<{ success: boolean; products: Product[] }>(
  `${import.meta.env.VITE_API_BACKEND_URL}/products/category/${id}`
);

  if (catLoading || prodLoading)
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    );

  if (catError || !category)
    return <div className="text-center py-16">Category not found.</div>;

  return (
    <MainLayout>
      
    <div className=" md:max-w-[1500px] md:mx-auto my-8  p-4">
       {/* breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Typography>{category.name}</Typography>
      </Breadcrumbs>
      <div className="flex flex-col lg:flex-row">
        <CategoryImage
          src={category.imageUrl}
          name={category.name}
          className="lg:w-fit sm:max-h-[300px] object-contain  rounded-lg mb-6"
        />
      {category.bannerUrl && (
        <img
          src={category.bannerUrl}
          alt={`${category.name} banner`}
          className="w-full sm:max-h-[300px] object-cover rounded-lg mb-6"
        />
      )}
          
      </div>
     

      {/* hero banner if provided */}
    

      {/* <Typography variant="h4" gutterBottom>
        {category.name}
      </Typography>
      {category.description && (
        <Typography variant="body1" sx={{ mb: 4 }}>
          {category.description}
        </Typography>
      )} */}

      {prodError ? (
        <Typography color="error">{prodError}</Typography>
      ) : (
        <ProductGrid products={prodData?.products ?? []} />
      )}
    </div></MainLayout>
  );
}
