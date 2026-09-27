import { categoryName } from "@/utils/product";
import React from "react";
import Button from "./Button";
import useCartStore from "@/store/CartStore";
import { RecommendedProduct, RoutineStep } from "@/types/Recommendation";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: RecommendedProduct;
  isAdded: boolean;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdded, onAdd }) => {
  const { addProductToCart } = useCartStore();
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (!isAdded) navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`relative p-4 border rounded-xl shadow-sm flex gap-4 transition cursor-pointer ${
        isAdded ? "opacity-60 pointer-events-none" : "hover:shadow-md"
      }`}
    >
      {isAdded && (
        <div className="absolute -top-2 -right-12 transform rotate-45 bg-black text-white text-xs px-8 py-1 font-semibold z-10 shadow-md">
          Added to Cart
        </div>
      )}

      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-28 h-28 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-2 text-sm font-medium text-black">
          {import.meta.env.VITE_API_CURRENCY_Symbol} {product.price.toFixed(2)}
        </div>
        <p className="text-xs text-primary uppercase mt-1">{categoryName(product.category)}</p>
        <Button
          variant="black"
          className="mt-3 px-3 py-1 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            addProductToCart(product);
            onAdd();
          }}
          disabled={isAdded}
        >
          {isAdded ? "Added" : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
};

interface RoutineSectionProps {
  stepKey: string;
  step: RoutineStep;
}

const RoutineSection: React.FC<RoutineSectionProps> = ({ stepKey, step }) => {
  const { isProductInCart } = useCartStore();

  return (
    <div className="mb-8">
      <AnimatePresence>
        {step.products.map((product) => {
          const alreadyInCart = isProductInCart(product._id);
          return (
            <ProductCard
              key={product._id}
              product={product}
              isAdded={alreadyInCart}
              onAdd={() => {
                // No need to manually track added IDs, Zustand store handles state globally.
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RoutineSection;
