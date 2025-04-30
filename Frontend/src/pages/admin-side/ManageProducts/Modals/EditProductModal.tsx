import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductVariant } from "@/types/Product";
import ProductImageUploader from "@/component/UI/ProductImageUploader";

// Zod schema for product update
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  category: z.enum([
    "Moisturizer",
    "Cleanser",
    "Serum",
    "Sunscreen",
    "Exfoliator",
    "Toner",
    "Mask",
    "Other",
  ]),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  discount: z
    .object({
      percentage: z.coerce.number().min(0).max(100),
      discountedPrice: z.coerce.number().min(0),
    })
    .optional(),
  stock: z.coerce.number().min(0, "Stock must be >= 0"),
  isAvailable: z.boolean(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        price: z.coerce.number().min(0, "Price must be >= 0"),
        stock: z.coerce.number().min(0, "Stock must be >= 0"),
      })
    )
    .optional(),
  ingredients: z.array(z.string()).optional(),
  aiSkinSuitability: z.array(z.string()).optional(),
  usageInstructions: z.string().optional(),
  precautions: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, images: File[]) => void;
  initialData: Product | null;
}

const EditProductModal: React.FC<Props> = ({ open, onClose, onSave, initialData }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [images, setImages] = useState<File[]>([]);

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Reset form fields
      reset({
        ...initialData,
        discount: initialData.discount,
        variants: initialData.variants as ProductVariant[],
        ingredients: initialData.ingredients,
        aiSkinSuitability: initialData.aiSkinSuitability,
        usageInstructions: initialData.usageInstructions,
        precautions: initialData.precautions,
        isAvailable: initialData.isAvailable,
        isFeatured: initialData.isFeatured,
      } as any);
    }
  }, [initialData, reset]);

  // Handle local image files
  const handleSelectImages: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const submitHandler = (data: FormData) => {
    onSave(data, images);
  };

  return (
    <Dialog open={open} onClose={onClose} className=" w-full" fullWidth>
      <DialogTitle>Edit Product Details</DialogTitle>
      <DialogContent className="space-y-6 w-full">
        {/* Core Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register("name")}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              {...register("brand")}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.brand && <p className="text-red-500 text-xs">{errors.brand.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full border rounded p-2"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              {...register("category")}
              className="mt-1 block w-full border rounded p-2"
            >
              {[
                "Moisturizer",
                "Cleanser",
                "Serum",
                "Sunscreen",
                "Exfoliator",
                "Toner",
                "Mask",
                "Other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Discount %</label>
            <input
              type="number"
              {...register("discount.percentage", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.discount?.percentage && (
              <p className="text-red-500 text-xs">{errors.discount.percentage.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Discounted Price</label>
            <input
              type="number"
              {...register("discount.discountedPrice", { valueAsNumber: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.discount?.discountedPrice && (
              <p className="text-red-500 text-xs">{errors.discount.discountedPrice.message}</p>
            )}
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <input type="checkbox" {...register("isAvailable")} className="mr-2" />
            <label>Available</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" {...register("isFeatured")} className="mr-2" />
            <label>Featured</label>
          </div>
        </div>

        {/* Variants */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Variants</span>
            <button
              type="button"
              onClick={() => append({ size: "", price: 0, stock: 0 })}
              className="text-sm text-brand-500 hover:underline"
            >
              + Add Variant
            </button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 mb-2">
              <input
                placeholder="Size"
                {...register(`variants.${index}.size` as const)}
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Price"
                {...register(`variants.${index}.price`, { valueAsNumber: true })}
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Stock"
                {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                className="border rounded p-2"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm mt-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Ingredients & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Ingredients (comma separated)</label>
            <input
  {...register("ingredients", {
    setValueAs: (val) =>
      typeof val === "string"
        ? val.split(",").map((s) => s.trim())
        : val,
  })}
  className="mt-1 block w-full border rounded p-2"
/>
          </div>
          <div>
            <label className="block text-sm font-medium">AI Skin Tags (comma separated)</label>
            <input
  {...register("aiSkinSuitability", {
    setValueAs: (val) =>
      typeof val === "string"
        ? val.split(",").map((s) => s.trim())
        : val,
  })}
  className="mt-1 block w-full border rounded p-2"
/>
          </div>
        </div>

        {/* Usage & Precautions */}
        <div>
          <label className="block text-sm font-medium">Usage Instructions</label>
          <textarea
            {...register("usageInstructions")}
            rows={2}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Precautions</label>
          <textarea
            {...register("precautions")}
            rows={2}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {/* Image Uploader
        {initialData?._id && (
          <ProductImageUploader productId={initialData._id} />
        )} */}
      </DialogContent>
      <DialogActions className="px-4 pb-4">
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          className="bg-brand-500 hover:bg-brand-600"
        >
          Save All Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
