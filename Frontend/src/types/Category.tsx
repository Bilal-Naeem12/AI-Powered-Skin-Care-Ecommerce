/* src/types/Category.ts
 * ------------------------------------------------------------------ */

export interface Category {
    /** MongoDB ObjectId as string */
    _id: string;
  
    /** Display name – max 40 chars, unique */
    name: string;
  
    /** Short description – max 200 chars (optional) */
    description?: string;
  
    /** Full https://… URL (or relative path) of hero/thumbnail image */
    imageUrl?: string ;
  bannerUrl?: string ;
    /** Soft‑delete flag (true = hidden from catalogue) */
    isDeleted: boolean;
  
    /** ISO‑8601 timestamp strings from Mongoose */
    createdAt: string;
    updatedAt: string;
  }
  
  /* convenience type for a create / update form payload */
  export type CategoryPayload = Pick<
    Category,
    "name" | "description" | "imageUrl" | "bannerUrl"
  >;
  