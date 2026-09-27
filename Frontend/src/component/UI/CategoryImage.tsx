import { useState } from "react";

const fallbackImages: Record<string, string> = {
  cleanser: "cleanser.png",
  cream: "moisturizer.jpg",
  moisturizer: "moisturizer.jpg",
  gel: "moisturizer.jpg",
  serum: "vitamin-c-serum.jpg",
  toner: "toner.webp",
  sunscreen: "sun-screen.jpg",
  mask: "mask.jpg",
  exfoliator: "exfoliator.webp",
};

export default function CategoryImage({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const fallback = `/assets/product_images/${fallbackImages[name.trim().toLowerCase()] ?? "other.webp"}`;
  const source = src?.trim();
  const image = source && !failedSources.includes(source) ? source : fallback;

  if (failedSources.includes(image)) {
    return <span role="img" aria-label={name} className={`inline-flex items-center justify-center bg-pink-50 text-pink-700 ${className ?? ""}`}>
      {name.trim().charAt(0).toUpperCase()}
    </span>;
  }

  return <img
    src={image}
    alt={name}
    className={className}
    onError={() => setFailedSources((failed) => [...failed, image])}
  />;
}
