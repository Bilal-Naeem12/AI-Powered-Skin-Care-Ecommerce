import React, { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  product: {
    name?: string;
    image?: string;
    variant?: string;
    quantity?: number;
  };
}

const predefinedTags = [
  "excellent",
  "handy for my holiday",
  "absolutely beautiful",
  "good quality product",
  "really amazing piece",
  "gorgeous 💕",
];

export default function ProductReviewPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  const product  = { name:"asdasdad",
    image:"asdasdad",
    variant:"123",
    quantity:"2"}
  const handleSubmit = () => {
    // send review to backend or console log
    console.log({
      rating,
      comment,
      selectedTags,
      product,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white rounded-md shadow-md">
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

      {/* Content Upload (Mock Only) */}
      <div className="flex gap-6 mb-5">
        <button className="border border-gray-300 rounded px-4 py-2 text-sm">
          📷 Photo
        </button>
        <button className="border border-gray-300 rounded px-4 py-2 text-sm">
          🎥 Video
        </button>
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
        onClick={handleSubmit}
        className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600 transition"
      >
        Submit
      </button>

      {/* Profile option */}
      <div className="mt-3 text-xs text-gray-500">
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" className="accent-orange-500" />
          Hide your profile photo and name as ma***an
        </label>
      </div>
    </div>
  );
}
