/* --------------------------------------------------------- */
/*  Product model — keep in one place and re-use everywhere  */
/* --------------------------------------------------------- */

/** Allowed categories (keeps typo-free code) */
export type ProductCategory =
  | "Moisturizer"
  | "Cleanser"
  | "Serum"
  | "Sunscreen"
  | "Exfoliator"
  | "Toner"
  | "Mask"
  | "Gel"
  | "Cream"
  | "Other";

/** Discount sub-document */
export interface Discount {
  percentage: number;      // e.g. 10 → 10 %
  discountedPrice?: number; // optional, shown only when > 0
}

/** Variant (size / package) */
export interface ProductVariant {
  size: string;            // "50 ml", "100 g", …
  price: number;
  stock: number;
}

/** ★ buckets = histogram */
export interface RatingBuckets {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/** Review (if you .populate("reviews")) */
export interface ProductReview {
  _id: string;
  userId: {
    _id: string;
    first_name?: string;
    last_name?: string;
    profileImage?: string;
  };
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText?: string;
  reviewImages?: string[];
  pros?: string[];
  cons?: string[];
  isVerifiedPurchase?: boolean;
  status?: "Pending" | "Approved" | "Rejected";
  upvotes?: number;
  downvotes?: number;
  replies?: {
    userId: string;
    comment: string;
    createdAt: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

/** Full product object returned by your API */
export interface Product {
  _id: string;

  /* core data */
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;

  /* pricing & stock */
  price: number;
  discount?: Discount;
  stock: number;
  isAvailable: boolean;

  /* variants & media */
  variants?: ProductVariant[];
  images: string[];

  /* ingredients & AI tags */
  ingredients?: string[];
  aiSkinSuitability?: string[];

  /* ratings */
  averageRating?: number;
  reviewCount?: number;
  ratingBuckets?: RatingBuckets;

  /* usage info */
  usageInstructions?: string;
  precautions?: string;

  /* e-commerce metadata */
  soldCount?: number;
  isFeatured?: boolean;

  /* soft deletion & timestamps */
  isDeleted?: boolean;
  createdAt?: string;   // ISO strings for JSON
  updatedAt?: string;
 
  /* virtual populate (optional) */
  reviews?: ProductReview[];
}

