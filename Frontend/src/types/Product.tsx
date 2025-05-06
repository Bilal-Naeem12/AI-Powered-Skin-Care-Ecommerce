/* --------------------------------------------------------- */
/*  Product model (front‑end) – after category refactor      */
/* --------------------------------------------------------- */

import type { Category } from "./Category";   // new Category shape

/** Discount sub‑doc */
export interface Discount {
  percentage: number;
  discountedPrice?: number;
}

/** Variant (size / package) */
export interface ProductVariant {
  size: string;
  price: number;
  stock: number;
}

/** ★ histogram */
export interface RatingBuckets {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

/** Review (when populated) */
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

/* ------------------------------------------------------------------ */
/*  Product – API response shape                                      */
/* ------------------------------------------------------------------ */

export interface Product {
  _id: string;

  /* core data */
  name: string;
  description: string;

  /**
   * Category reference
   * – If not populated: ObjectId as string
   * – If populated   : Category object
   */
  category: Category;

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

  /* AI‑detected skin problems (array after rename) */
  skinProblem?: string[];

  /* ratings */
  averageRating?: number;
  reviewCount?: number;
  ratingBuckets?: RatingBuckets;

  /* usage info */
  usageInstructions?: string;
  precautions?: string;

  /* e‑commerce metadata */
  soldCount?: number;
  isFeatured?: boolean;

  /* soft delete & timestamps */
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;

  /* virtual populate (optional) */
  reviews?: ProductReview[];
}

/* ------------------------------------------------------------------ */
/*  Payloads – helper types for forms                                 */
/* ------------------------------------------------------------------ */

export type ProductCreatePayload = Omit<
  Product,
  "_id" | "averageRating" | "reviewCount" | "ratingBuckets" | "soldCount" |
  "isDeleted" | "createdAt" | "updatedAt" | "reviews"
>;

export type ProductUpdatePayload = Partial<ProductCreatePayload> & {
  _id: string;
};
