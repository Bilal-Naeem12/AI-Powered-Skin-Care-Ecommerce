// src/components/Home/Categories.tsx
import React from "react";

const categories = [
  { id: 1, name: "Moisturizer", image: "/assets/product_images/moisturizer.jpg" },
  { id: 2, name: "Cleanser", image: "/assets/product_images/cleanser.png" },
  { id: 3, name: "Serum", image: "/assets/product_images/niacinamide-serum.jpg" },
  { id: 4, name: "Sunscreen", image: "/assets/product_images/sun-screen.jpg" },
  { id: 5, name: "Exfoliator", image: "/assets/product_images/exfoliator.webp" },
  { id: 6, name: "Toner", image: "/assets/product_images/toner.webp" },
  { id: 7, name: "Mask", image: "/assets/product_images/mask.jpg" },
  { id: 8, name: "Other", image: "/assets/product_images/other.webp" },
];

const Categories: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8 px-4 ">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-gray-800 leading-tight group-hover:text-primary transition-all">
            {category.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Categories;
