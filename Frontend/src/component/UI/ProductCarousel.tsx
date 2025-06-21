import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/index.css";

interface Product {
  _id: string;
  name: string;
  image: string;
}

interface Props {
  products: Product[];
  onProductSelect: (productName: string) => void;
  width?: string;
}

export default function ProductCarousel({
  products,
  onProductSelect,
  width = "max-w-[500px]",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtonVisibility = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const itemWidth = el.clientWidth * 0.75;
      el.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateButtonVisibility();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtonVisibility);
    return () => el.removeEventListener("scroll", updateButtonVisibility);
  }, []);

  return (
    <div className={`relative ${width} mx-auto`}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 bg-white p-2 rounded-md border"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((item) => (
          <div
            key={item._id}
            onClick={() => onProductSelect(item.name)}
            className="min-w-[120px] cursor-pointer flex-shrink-0 scroll-snap-start text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded border shadow-sm mx-auto"
            />
            <p className="text-xs mt-1 font-medium line-clamp-2">{item.name}</p>
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
