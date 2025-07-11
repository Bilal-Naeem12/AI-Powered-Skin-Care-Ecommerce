// src/types/User.ts

import { CartItem } from "./CartItem";

export interface SkinAnalysisHistory {
    imageUrl: string; // Link to uploaded skin image
    analysisResults: string; // AI-based results
    severityFlag: boolean; // Indicates if condition is severe
    recommendations: string[]; // Product recommendations
    analyzedAt: Date; // When analysis was made
  }
  
  export interface ProgressTracking {
    uploadedImage: string; // Image for tracking progress
    analysisResult: string; // AI's results at that time
    comparedToPrevious: string; // Improvement or worsening
    uploadedAt: Date; // When progress was tracked
  }
  
 
  
  export interface WishlistItem {
    productId: string; // Product reference
  }
  
  export interface OrderHistoryItem {
    orderId: string; // Order reference
    orderedAt: Date; // When the order was made
  }
  
  export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    walkThroughCompleted:boolean;
    password: string;
    phone: string;
    date_of_birth: Date;
    gender: "Male" | "Female" | "Non-binary" | "Other";
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    preferred_language: "English" | "Spanish" | "French" | "German" | "Chinese" | "Other";
    skin_concerns: string[]; // E.g. ["Acne", "Wrinkles"]
    lifestyle_factors: {
      smoking: boolean;
      alcohol_consumption: boolean;
      diet: "Vegetarian" | "Vegan" | "Non-Vegetarian" | "Other";
    };
      consent: {
    termsAccepted: boolean;
    faceScanConsent: boolean;
    agreedAt: Date | null;
  };
    role: "user" | "admin";
    profileImage: string | null;
    isVerified: boolean;
    allergenPreferences: string[]; // E.g. ["Fragrance", "Alcohol"]
    skinAnalysisHistory: SkinAnalysisHistory[];
    progressTracking: ProgressTracking[];
    cart: CartItem[];
    wishlist: WishlistItem[];
    orderHistory: OrderHistoryItem[];
    verificationToken: string | null;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  