import React from "react";
import useFetchData from "@/hooks/useFetchData"; // Update this path if your hook is in a different folder
import { Category } from "@/types/Category";
import { useNavigate } from "react-router-dom";
import CategoryImage from "@/component/UI/CategoryImage";



const Categories: React.FC = () => {

  const navigate = useNavigate();
  const { data: categories, loading, error } = useFetchData<Category[]>(`${import.meta.env.VITE_API_BACKEND_URL}/categories/`);

  if (loading) return <div className="text-center py-8">Loading categories...</div>;
  if (error)   return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!categories || !categories.length) return <div className="text-center py-8 text-gray-400">No categories found.</div>;

  return (
    <div className="flex flex-wrap justify-center gap-8 px-4">
      {categories?.map((category) => (
        <div
          key={category._id}
          className="flex flex-col items-center text-center group cursor-pointer"
           onClick={() => navigate(`category/${category._id}`)}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
            <CategoryImage
              src={category.imageUrl}
              name={category.name}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-2 text-xs capitalize font-medium text-gray-800 leading-tight group-hover:text-primary transition-all">
            {category.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Categories;
