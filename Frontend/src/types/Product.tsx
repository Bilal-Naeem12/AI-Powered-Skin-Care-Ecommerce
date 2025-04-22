// Define types for the Product Variant
interface ProductVariant {
    size: string;
    price: number;
    stock: number;
  }
  
  // Define types for Customer Review
  interface Review {
    userId: string;  // The user ID is a string, as it will be a reference to the User model.
    rating: number;
    comment: string;
    createdAt: string; // Date in string format (ISO 8601)
  }
  
  // Interface for the Product
  interface Product {
    _id: string;  // Unique identifier for the product
    name: string;
    description: string;
    category: "Moisturizer" | "Cleanser" | "Serum" | "Sunscreen" | "Exfoliator" | "Toner" | "Mask" | "Other";
    brand: string;
    price: number;
    discount: {
      percentage: number;  // Discount percentage
      discountedPrice: number | null; // Final price after discount
    };
    stock: number;
    isAvailable: boolean;
    variants: ProductVariant[]; // Array of product variants (sizes, packaging, etc.)
    images: string[];  // Array of image URLs
    ingredients: string[];  // Ingredients list
    allergens: string[];  // Allergen list
    aiSkinSuitability: string[];  // AI recommendations for skin suitability (e.g., "Oily Skin", "Sensitive Skin")
    averageRating: number;  // Average rating of the product
    reviews: Review[];  // Array of reviews
    usageInstructions: string;
    precautions: string;
    soldCount: number;  // Number of items sold
    isFeatured: boolean;  // Whether the product is featured
    isDeleted: boolean;  // Soft delete flag
    createdAt: string;  // Creation timestamp (ISO 8601)
    updatedAt: string;  // Last update timestamp (ISO 8601)
  }
  
  export default Product;
  