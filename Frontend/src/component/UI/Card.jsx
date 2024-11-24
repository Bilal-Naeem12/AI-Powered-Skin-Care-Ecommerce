import React from "react";

const Card = ({ title, description, price, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4">
          <span className="text-blue-600 font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
