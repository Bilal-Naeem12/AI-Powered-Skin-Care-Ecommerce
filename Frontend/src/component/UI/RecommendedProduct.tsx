import React from "react";
import Button from "./Button";
import useCartStore from "@/store/useCartStore";
import { RecommendedProduct, RoutineStep } from "@/types/Recommendation";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: RecommendedProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addProductToCart } = useCartStore();

  return (
    <Link to={`/product/${product._id}`}>
    <div className="p-4 border rounded-xl shadow-sm flex gap-4 hover:shadow-md transition">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-28 h-28 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-2 text-sm font-medium text-black">
          {import.meta.env.VITE_API_CURRENCY_Symbol} {product.price.toFixed(2)}
        </div>
        <p className="text-xs text-primary uppercase mt-1">{product.category}</p>
        <Button variant="black" className="mt-3 px-3 py-1 text-sm" onClick={() => addProductToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
    </Link>

  );
};

interface RoutineSectionProps {
  stepKey: string;
  step: RoutineStep;
}

const RoutineSection: React.FC<RoutineSectionProps> = ({ stepKey, step }) => (
  <div className="mb-8">
    {/* <h3 className="text-xl font-bold text-gray-800 mb-4">{stepKey.toUpperCase()}: {step.title}</h3> */}
    <div className="space-y-4">
      {step.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </div>
);

export default RoutineSection;
