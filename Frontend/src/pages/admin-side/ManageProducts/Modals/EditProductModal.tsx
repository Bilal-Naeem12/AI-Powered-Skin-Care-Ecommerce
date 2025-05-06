import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductVariant } from "@/types/Product";

import EditProductModalImagesSection from "./EditProductModalImagesSection"
import CategorySelect from "@/component/comboboxes/CategorySelect";
// Zod schema


const normalise = (data: Props["initialData"]): Partial<FormData> | {} => {
  if (!data) return {};
  return {
    ...data,
    category: typeof data.category === "object" ? data.category._id : data.category ?? "",
  };
};
export type ProductFormValues = z.infer<typeof schema>;

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  category:  z.union([
   z.string(),
    z.object({
      _id : z.string(),
      name: z.string(),
      imageUrl: z.string().url().optional().nullable(),
    }),
  ]),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  discount: z
    .object({
      percentage: z.coerce.number().min(0).max(100),
      discountedPrice: z.coerce.number().min(0),
    })
    .optional(),
  stock: z.coerce.number().min(0, "Stock must be ≥ 0"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        price: z.coerce.number().min(0, "Variant price ≥ 0"),
        stock: z.coerce.number().min(0, "Variant stock ≥ 0"),
      })
    )
    .optional(),
    images:z.array(z.string()),
  ingredients: z.array(z.string()).optional(),
  aiSkinSuitability: z.array(z.string()).optional(),
  usageInstructions: z.string().optional(),
  precautions: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, newFiles: File[], removedUrls: string[]) => void;
  initialData: Product | null;
}

 function EditProductModal({
    open, onClose, onSave, initialData
  }: Props) {
    const { control, handleSubmit, reset, formState:{errors,isSubmitting} } =
      useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: normalise(initialData) || {}
      });
    const { fields, append, remove } = useFieldArray({ control, name:"variants" });
  
    // image state
 
    const [newFiles, setNewFiles]   = useState<File[]>([]);
    const [existingUrls, setExistingUrls] = useState<string[]>([])
    const [removedUrls, setRemovedUrls] = useState<string[]>([])
    
    // when initialData changes, reset form and images
    useEffect(()=>{
      if(!initialData) return;
      reset(initialData as any);
      setExistingUrls(initialData.images || []);
      setRemovedUrls([]);
      setNewFiles([]);
    },[initialData, reset]);
  
    useEffect(() => {
        if (!initialData) return
        reset(initialData as any)
        setExistingUrls(initialData.images || [])
        setRemovedUrls([])
        setNewFiles([])
      }, [initialData, reset])
    
      function handleMarkRemoved(url: string) {
        setExistingUrls(urls =>
          // only remove if it wasn't already removed
          urls.includes(url) ? urls.filter(u => u !== url) : urls
        );
        setRemovedUrls(prev =>
          // only add once
          prev.includes(url) ? prev : [...prev, url]
        );
      }
   
   
    const submit = (data:FormData)=>{
 
      onSave({...data,category : data.category ,images:existingUrls} , newFiles, removedUrls);
    };
  
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Name & Brand */}
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Brand"
                  fullWidth
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          {/* Category, Price, Stock */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <CategorySelect control={control} name="category" />

              <Typography variant="caption" color="error">
                {errors.category?.message}
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  fullWidth
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Grid>

          {/* Discount */}
          <Grid item xs={6} md={3}>
            <Controller
              name="discount.percentage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Discount %"
                  type="number"
                  fullWidth
                  error={!!errors.discount?.percentage}
                  helperText={errors.discount?.percentage?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Controller
              name="discount.discountedPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Discounted Price"
                  type="number"
                  fullWidth
                  error={!!errors.discount?.discountedPrice}
                  helperText={errors.discount?.discountedPrice?.message}
                />
              )}
            />
          </Grid>

          {/* Flags */}
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
              }
              label="Available"
            />
            <FormControlLabel
              control={
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value || false} />}
                />
              }
              label="Featured"
            />
          </Grid>

          {/* Variants */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Variants</Typography>
            {fields.map((item, idx) => (
              <Grid container spacing={1} key={item.id} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs>
                  <Controller
                    name={`variants.${idx}.size`}
                    control={control}
                    render={({ field }) => <TextField {...field} placeholder="Size" fullWidth />}
                  />
                </Grid>
                <Grid item xs>
                  <Controller
                    name={`variants.${idx}.price`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} placeholder="Price" type="number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs>
                  <Controller
                    name={`variants.${idx}.stock`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} placeholder="Stock" type="number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item>
                  <IconButton color="error" onClick={() => remove(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="text"
              onClick={() => append({ size: "", price: 0, stock: 0 })}
            >
              + Add Variant
            </Button>
          </Grid>

          {/* Ingredients & AI Tags */}
          <Grid item xs={12} md={6}>
            <Controller
              name="ingredients"
              control={control}
              render={({ field }) => {
                const val = Array.isArray(field.value) ? field.value.join(", ") : "";
                return (
                  <TextField
                    label="Ingredients (comma separated)"
                    value={val}
                    onChange={(e) =>
                      field.onChange(e.target.value.split(",").map((s) => s.trim()))
                    }
                    fullWidth
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="aiSkinSuitability"
              control={control}
              render={({ field }) => {
                const val = Array.isArray(field.value) ? field.value.join(", ") : "";
                return (
                  <TextField
                    label="AI Skin Tags (comma separated)"
                    value={val}
                    onChange={(e) =>
                      field.onChange(e.target.value.split(",").map((s) => s.trim()))
                    }
                    fullWidth
                  />
                );
              }}
            />
          </Grid>

          {/* Usage & Precautions */}
          <Grid item xs={12} md={6}>
            <Controller
              name="usageInstructions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Usage Instructions"
                  multiline
                  rows={2}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="precautions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precautions"
                  multiline
                  rows={2}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Images */}
          <EditProductModalImagesSection
  existingUrls={existingUrls}
  newFiles={newFiles}
  setNewFiles={setNewFiles}
  setExistingUrls={setExistingUrls}      // add this!
  onMarkRemoved={handleMarkRemoved}
/>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit(submit)} className={`${isSubmitting?"disabled":""}`}  variant="contained">
        {isSubmitting?"Submitting ..." :  "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
