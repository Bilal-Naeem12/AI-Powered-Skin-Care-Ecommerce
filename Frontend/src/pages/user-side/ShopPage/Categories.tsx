import React from "react";

const Categories = () => {
  const categories = [
    {
        id: 4,
        name: "Seerum",
        image: "/assets/product_images/niacinamide-serum.jpg",
      },
 
    {
      id: 2,
      name: "Moisturizer",
      image: "/assets/product_images/moisturizer.jpg",
    },
    {
      id: 3,
      name: "Sun Screen",
      image: "/assets/product_images/sun-screen.jpg",
    },
    {
      id: 4,
      name: "Seerum",
      image: "/assets/product_images/niacinamide-serum.jpg",
    },
    {
      id: 5,
      name: "Vitamin C",
      image: "/assets/product_images/vitamin-c-serum.jpg",
    },
    {
        id: 5,
        name: "Vitamin C",
        image: "/assets/product_images/vitamin-c-serum.jpg",
      },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4 py-6 ">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="overflow-hidden rounded-lg shadow-md">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-32 object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="mt-2 text-sm font-bold border-b-2 border-transparent group-hover:border-black transition-all duration-300">
            {category.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default Categories;
