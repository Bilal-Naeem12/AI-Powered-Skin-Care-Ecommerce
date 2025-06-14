// ----------------------------------------------
// pages/ProductDetailPage.tsx
// ----------------------------------------------
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  IconButton,
  Rating,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useFetchData from "@/hooks/useFetchData";
import useCartStore from "@/store/useCartStore";
import { Product, ProductVariant } from "@/types/Product";
import ReviewSection from "@/component/UI/ReviewSection";
import image from "@/assets/anaylsis.png"
import PageOverlay from "@/component/UI/PageOverlay";
const ProductDetailPage: React.FC = () => {
  /* ----- routing + data ----- */
  const { id } = useParams<{ id: string }>();
  const { data: product, loading, error } = useFetchData<Product>(
    `${import.meta.env.VITE_API_BACKEND_URL}/products/${id}`
  );

  /* ----- cart state (Zustand) ----- */
  const { cart, addProductToCart, updateProductQuantity } = useCartStore();

  /* ----- local UI state ----- */
  const [quantity, setQuantity] = useState<number>(1);
  const [variant, setVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [tab, setTab] = useState<0 | 1>(0); // 0 -> Details, 1 -> Reviews

  /* ----- derived ----- */
  const cartItem = cart.find((c) => c.product._id === id);
  const [mainIdx, setMainIdx] = useState(0);          // <— NEW
  /* ----- handlers ----- */
  const changeQty = (dir: "inc" | "dec") =>
    setQuantity((q) => Math.max(1, dir === "inc" ? q + 1 : q - 1));

  const addToCart = () => {
    if (!product) return;
    if (cartItem) {
      updateProductQuantity(product._id, quantity);
    } else {
      addProductToCart(product, quantity);
    }
  };

  /* ----- loading / error UI ----- */
 
  if (error || !product)
    return <p className="text-center text-red-600">{error ?? "Not found"}</p>;

  /* ----- main render ----- */
  return (

    <div className="mx-auto max-w-7xl sm:p-4 md:p-8">
     <PageOverlay show={loading} />

      {/* top section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* images */}
        <div className="space-y-3 self-start">
          <img
          src={product?.images[mainIdx]?? image}
            alt={product.name}
            className="rounded-lg w-full h-[480px] object-contain shadow-sm"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((src) => (
              <img
                key={src}
                src={src || ""
                }
                alt={product.name}
                className="w-20 h-20 object-contain rounded-sm border cursor-pointer hover:opacity-80"
                onClick={() => {
                  
                  const imgs = [...product.images];
                  const idx = imgs.indexOf(src);
                  setMainIdx(idx);
              
                }}
              />
            ))}
          </div>
        </div>

        {/* info */}
        <div className="flex flex-col gap-4">
          {/* title & rating */}
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <Rating
              value={product.averageRating ?? 0}
              precision={0.1}
              readOnly
            />
            <span className="text-sm text-gray-600">
              ({product.reviewCount ?? 0} ratings)
            </span>
          </div>

          {/* price block */}
          <div className="space-y-1">
            {product.discount?.percentage ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                {import.meta.env.VITE_API_CURRENCY_Symbol} {product.discount.discountedPrice?.toFixed(0)}
                </span>
                <span className="line-through text-gray-500 ml-2">
                {import.meta.env.VITE_API_CURRENCY_Symbol}  {product.price.toFixed(0)}
                </span>
                <span className="ml-2 text-green-600">
                  -{product.discount.percentage}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {import.meta.env.VITE_API_CURRENCY_Symbol}  {product.price.toFixed(0)}
              </span>
            )}
            <p className="text-sm text-gray-600">
              Inclusive of all taxes • Stock: {product.stock}
            </p>
          </div>

          {/* variants */}
          {product.variants && product.variants.length > 1 && (
            <div>
              <p className="font-medium mb-1">Size / Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Tooltip
                    key={v.size}
                    title={`${import.meta.env.VITE_API_CURRENCY_Symbol}  ${v.price.toFixed(0)}`}
                    arrow
                  >
                    <button
                      className={`border rounded py-1 px-3 text-sm hover:bg-gray-100 ${
                        variant?.size === v.size ? "border-black" : ""
                      }`}
                      onClick={() => setVariant(v)}
                    >
                      {v.size}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* quantity selector */}
          <div className="flex items-center gap-2">
            <IconButton onClick={() => changeQty("dec")} size="small">
              <RemoveIcon />
            </IconButton>
            <span className="border px-4 py-1 rounded-sm">{quantity}</span>
            <IconButton onClick={() => changeQty("inc")} size="small">
              <AddIcon />
            </IconButton>
            {product.isAvailable ? (
              <span className="text-sm text-green-700 flex items-center">
                <CheckCircleIcon fontSize="small" className="mr-1" /> In Stock
              </span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>

          {/* add to cart */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="w-max bg-black! hover:bg-gray-800!"
            onClick={addToCart}
            disabled={!product.isAvailable}
          >
            {cartItem ? "Update Cart" : "Add to Cart"}
          </Button>

          {/* description */}
          <p className="whitespace-pre-wrap text-gray-800">
            {product.description}
          </p>

          {/* ingredients & suitability */}
          <div className="text-sm leading-6">
            {product.ingredients && (
              <p>
                <span className="font-medium">Key ingredients:</span>{" "}
                {product.ingredients.join(", ")}
              </p>
            )}
            {product.aiSkinSuitability && (
              <p>
                <span className="font-medium">Suitable for:</span>{" "}
                {product.aiSkinSuitability.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* bottom tabs */}
      <div className="mt-12 shadow card bg-white sm:p-5">
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Details" />
          <Tab label={`Reviews (${product.reviewCount ?? 0})`} />
        </Tabs>

        {tab === 0 ? (
          <div className="px-3 py-4  sm:p-6">
            <h2 className="text-xl font-semibold mb-2">How to use</h2>
            <p className="mb-4">{product.usageInstructions ?? "—"}</p>

            <h2 className="text-xl font-semibold mb-2">Precautions</h2>
            <p className="mb-4">{product.precautions ?? "—"}</p>

            <h2 className="text-xl font-semibold mb-2">Product details</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Brand: {product.brand}</li>
              <li>Category: {product.category.name}</li>
              <li>Sold: {product.soldCount ?? 0} pcs.</li>
              <li>Created: {new Date(product.createdAt!).toLocaleDateString()}</li>
            </ul>
          </div>
        ) : (
          <ReviewSection productId={product._id} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
