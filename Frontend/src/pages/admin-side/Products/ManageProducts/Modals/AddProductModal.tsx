// src/components/Modals/AddProductModal.tsx
import React, { useState } from "react"
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
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


// ─────────────────────────────────────────────────────────────────────────────
// Zod schema for *new* product (no `images` field here)
const addSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.enum([
    "Moisturizer","Cleanser","Serum","Sunscreen",
    "Exfoliator","Toner","Mask","Other",
  ]),
  brand: z.string().min(1),
  price: z.coerce.number().min(0),
  discount: z.object({
      percentage: z.coerce.number().min(0).max(100),
      discountedPrice: z.coerce.number().min(0),
    })
    .optional(),
  stock: z.coerce.number().min(0),
  isAvailable: z.boolean(),
  isFeatured: z.boolean().optional(),
  variants: z
    .array(z.object({
      size: z.string().min(1),
      price: z.coerce.number().min(0),
      stock: z.coerce.number().min(0),
    }))
    .optional(),
  ingredients: z.array(z.string()).optional(),
  aiSkinSuitability: z.array(z.string()).optional(),
  usageInstructions: z.string().optional(),
  precautions: z.string().optional(),
})

type AddFormData = z.infer<typeof addSchema>

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (data: AddFormData, images: File[]) => void
}

type ImageItem =
  | { id: string; src: string; file: File }

export default function AddProductModal({ open, onClose, onAdd }: Props) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<AddFormData>({ resolver: zodResolver(addSchema) })

  const { fields, append, remove } = useFieldArray({ control, name: "variants" })

  // new‐only images
  const [images, setImages] = useState<File[]>([])
  const [items, setItems] = useState<ImageItem[]>([])

  // sync preview items whenever `images` changes
  React.useEffect(() => {
    setItems(images.map((f,i) => ({
      id: `${f.name}-${f.lastModified}-${i}`,
      src: URL.createObjectURL(f),
      file: f,
    })))
  }, [images])

  // DnD-kit
  const sensors = useSensors(useSensor(PointerSensor))
  function onDragEnd(evt: DragEndEvent) {
    const { active, over } = evt
    if (!over || active.id === over.id) return
    setItems(cur => {
      const oldIdx = cur.findIndex(i => i.id === active.id)
      const newIdx = cur.findIndex(i => i.id === over.id)
      return arrayMove(cur, oldIdx, newIdx)
    })
    setImages(curImgs => {
      // reorder the File[] to match items[]
      return arrayMove(curImgs, 
        curImgs.findIndex(f=>`${f.name}-${f.lastModified}-${curImgs.indexOf(f)}`===active.id),
        curImgs.findIndex(f=>`${f.name}-${f.lastModified}-${curImgs.indexOf(f)}`===over.id)
      )
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setImages(cur => [...cur, ...Array.from(files)])
  }
  const handleRemoveImage = (id: string) => {
    setItems(cur => cur.filter(i=>i.id!==id))
    setImages(cur => cur.filter(f=>`${f.name}-${f.lastModified}-${cur.indexOf(f)}`!==id))
  }

  const onSubmit = (data: AddFormData) => {
    onAdd(data, images)
    reset()
    setImages([])
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <Divider/>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt:1 }}>

          {/* Name & Brand */}
          <Grid item xs={12} md={6}>
            <Controller name="name" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Name" fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller name="brand" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Brand" fullWidth
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
                />
              }
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller name="description" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Description"
                  multiline rows={3} fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              }
            />
          </Grid>

          {/* Category / Price / Stock */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Controller name="category" control={control}
                render={({ field })=>
                  <Select {...field} label="Category">
                    {addSchema.shape.category.options.map(opt=>
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    )}
                  </Select>
                }
              />
              <Typography variant="caption" color="error">
                {errors.category?.message}
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <Controller name="price" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Price" type="number" fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              }
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Controller name="stock" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Stock" type="number" fullWidth
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              }
            />
          </Grid>

          {/* Discount */}
          <Grid item xs={6} md={3}>
            <Controller name="discount.percentage" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Discount %" type="number" fullWidth
                  error={!!errors.discount?.percentage}
                  helperText={errors.discount?.percentage?.message}
                />
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Controller name="discount.discountedPrice" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Discounted Price" type="number" fullWidth
                  error={!!errors.discount?.discountedPrice}
                  helperText={errors.discount?.discountedPrice?.message}
                />
              }
            />
          </Grid>

          {/* Flags */}
          <Grid item xs={12} md={4}>
            <FormControlLabel control={
              <Controller name="isAvailable" control={control}
                render={({ field })=><Checkbox {...field} checked={field.value} />}
              />
            } label="Available"/>
            <FormControlLabel control={
              <Controller name="isFeatured" control={control}
                render={({ field })=><Checkbox {...field} checked={field.value||false} />}
              />
            } label="Featured"/>
          </Grid>

          {/* Variants */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Variants</Typography>
            {fields.map((f, i)=>(
              <Grid container spacing={1} key={f.id} alignItems="center" sx={{ mb:1 }}>
                <Grid item xs>
                  <Controller name={`variants.${i}.size`} control={control}
                    render={({ field })=> <TextField {...field} placeholder="Size" fullWidth /> }
                  />
                </Grid>
                <Grid item xs>
                  <Controller name={`variants.${i}.price`} control={control}
                    render={({ field })=> <TextField {...field} placeholder="Price" type="number" fullWidth /> }
                  />
                </Grid>
                <Grid item xs>
                  <Controller name={`variants.${i}.stock`} control={control}
                    render={({ field })=> <TextField {...field} placeholder="Stock" type="number" fullWidth /> }
                  />
                </Grid>
                <Grid item>
                  <IconButton color="error" onClick={()=>remove(i)}>
                    <DeleteIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button variant="text" onClick={()=>append({size:"",price:0,stock:0})}>
              + Add Variant
            </Button>
          </Grid>

          {/* Ingredients & Tags */}
          <Grid item xs={12} md={6}>
            <Controller name="ingredients" control={control}
              render={({ field })=>{
                const val = Array.isArray(field.value) ? field.value.join(", ") : ""
                return <TextField
                  label="Ingredients (comma separated)"
                  value={val}
                  onChange={e=>field.onChange(e.target.value.split(",").map(s=>s.trim()))}
                  fullWidth
                />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller name="aiSkinSuitability" control={control}
              render={({ field })=>{
                const val = Array.isArray(field.value) ? field.value.join(", ") : ""
                return <TextField
                  label="AI Skin Tags (comma separated)"
                  value={val}
                  onChange={e=>field.onChange(e.target.value.split(",").map(s=>s.trim()))}
                  fullWidth
                />
              }}
            />
          </Grid>

          {/* Usage & Precautions */}
          <Grid item xs={12} md={6}>
            <Controller name="usageInstructions" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Usage Instructions" multiline rows={2} fullWidth
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller name="precautions" control={control}
              render={({ field })=>
                <TextField {...field}
                  label="Precautions" multiline rows={2} fullWidth
                />
              }
            />
          </Grid>

          {/* Image uploader + DnD preview */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Images</Typography>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map(i=>i.id)} strategy={rectSortingStrategy}>
                <Grid container spacing={1}>
                  {items.map(item=>(
                    <SortableCard key={item.id} item={item} onRemove={()=>handleRemoveImage(item.id)}/>
                  ))}
                </Grid>
              </SortableContext>
            </DndContext>
            <Button variant="outlined" component="label" sx={{ mt:1 }}>
              Upload Images
              <input hidden type="file" multiple accept="image/*" onChange={handleFileChange}/>
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          {isSubmitting?"Adding...":"Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


// helper sort-able thumbnail
function SortableCard({
  item,
  onRemove,
}: {
  item: ImageItem
  onRemove: ()=>void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        width: 96,
        height: 96,
        margin: 4,
      }}
      {...attributes}
      {...listeners}
    >
      <img
        src={item.src}
        alt=""
        style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:4 }}
      />
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{ position:"absolute",top:0,right:0 }}
      >
        <DeleteIcon fontSize="small"/>
      </IconButton>
    </div>
  )
}
