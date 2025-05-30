import React, { useState } from "react";
import { Star } from "lucide-react";
import ImagePicker from "./ImagePicker";
import usePostAuthData from "@/hooks/usePostAuthData";



const predefinedTags = [
  "excellent",
  "handy for my holiday",
  "absolutely beautiful",
  "good quality product",
  "really amazing piece",
  "gorgeous 💕",
];
interface ProductInfo {
  id: string;
  name: string;
  image: string;
  variant: string;
  quantity: number;
}

interface Props {
  product: ProductInfo;
  onSuccess: () => void;
}

export default function ProductReviewPage({ product, onSuccess }: Props) {
 const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]); // Cloudinary URLs
  const { postData, loading ,error} =                           // ✅ add
  usePostAuthData<{ message: string },                  //   (response shape)
                   { rating: number;                    //   (payload shape)
                     reviewText: string;
                     tags: string[];
                     reviewImages: string[] }>();
  const toggleTag = (tag: string) => {

    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
 
const submit = async () => {
console.log(images)
  await postData(
    `${import.meta.env.VITE_API_BACKEND_URL}/products/${product.id}/reviews`,                 // same endpoint
    {
      rating,
      reviewText: comment,
      tags: selectedTags,
      reviewImages: images,
    },
    "Review submitted successfully!"                   // toast text
  );
  if(!error){
  onSuccess();      
  }
                                   // keep your callback
};

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white rounded-md shadow-md overflow-auto">
      <h2 className="text-xl font-semibold mb-5">Leave a review</h2>

      {/* Product Summary */}
      <div className="flex gap-4 mb-6 items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded border"
        />
        <div className="flex flex-col text-sm">
          <span className="font-medium">{product.name}</span>
          <span className="text-gray-500">{product.variant}</span>
        </div>
      </div>

     

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`text-sm border px-3 py-1 rounded-full ${
              selectedTags.includes(tag)
                ? "bg-orange-100 text-orange-600 border-orange-400"
                : "text-gray-600 border-gray-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
 <ImagePicker
        productId={product.id}
        onUploaded={(urls) => {
           console.log("URLs from ImagePicker:", urls);
          setImages(urls)}}
      />
      {/* Review Text */}
      <textarea
        placeholder="Share your thought or select the brief review above."
        maxLength={3000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded p-3 mb-3 resize-none text-sm"
        rows={4}
      />
      <div className="text-right text-xs text-gray-500 mb-4">
        {comment.length}/3000
      </div>

      {/* Rating */}
      <div className="mb-6">
        <span className="block text-sm font-medium mb-1">Rating *</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              fill={
                (hovered ?? rating) >= star ? "#f59e0b" : "transparent"
              }
              stroke="#f59e0b"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setRating(star)}
              className="cursor-pointer transition-all"
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 && ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
          </span>
        </div>
      </div>

      {/* Submit */}
    <button
        onClick={submit}
        disabled={!rating}
        className="mt-4 w-full bg-orange-500 text-white py-2 rounded disabled:opacity-40"
      >
        Submit
      </button>

    
    </div>
  );
}
