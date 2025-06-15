import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import"@/index.css"
interface Props {
  cartItems: any[];
  width?: string
}

export default function OrderImageCarousel({ cartItems ,width = "max-w-[500px]"}: Props) {
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
      const itemWidth = el.clientWidth * 0.75; // Scroll approx 3.5 images
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
    <div className={`relative ${width}   bg-black`}>
      {/* Scrollable Image Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 bg-gray-100"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {cartItems?.map((item, i) => (
          <img
            key={i}
            src={item.productId?.images?.[0]}
            alt="Product"
            className="h-30 w-30 rounded object-fit flex-shrink-0 border border-gray-200 scroll-snap-start bg-white shadow-lg"
            style={{ scrollSnapAlign: "start" }}
          />
        ))}
      </div>

      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
