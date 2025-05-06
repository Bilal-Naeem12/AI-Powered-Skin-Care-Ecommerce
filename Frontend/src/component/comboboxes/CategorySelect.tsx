/* src/components/form/CategorySelect.tsx
   ---------------------------------------------------------------- */
   import React, { useMemo } from "react";
   import {
     Autocomplete,
     Avatar,
     Box,
     CircularProgress,
     TextField,
   } from "@mui/material";
   import { Controller, Control } from "react-hook-form";
   import useFetchAuthData from "@/hooks/useFetchAuthData";
   import { Category } from "@/types/Category";
   
   const URL = `${import.meta.env.VITE_API_BACKEND_URL}/categories`;
   
   interface Props {
     control:  Control<any>;
     name:     string;          // e.g. "category"
     label?:   string;          // floating label
     disabled?: boolean;
   }
   
   /* helper – type‑guard */
   const isCategory = (v: unknown): v is Category =>
     !!v && typeof v === "object" && "_id" in (v as any);
   
   export default function CategorySelect({
     control,
     name,
     label = "Category",
     disabled = false,
   }: Props) {
     /* 1️⃣  fetch once – no re‑render storms ---------------------- */
     const { data: categories, loading } = useFetchAuthData<Category[]>(URL);
   
     /* 2️⃣  quick lookup {id → Category} -------------------------- */
     const findById = useMemo(() => {
       if (!categories) return () => null;
       const map = new Map(categories.map(c => [c._id, c]));
       return (id?: string | null) => (id ? map.get(id) ?? null : null);
     }, [categories]);
   
     /* 3️⃣  rhf controller --------------------------------------- */
     return (
       <Controller
         name={name}
         control={control}
         render={({ field, fieldState }) => {
           /* normalise rhf value (it can be id *or* object) */
           const selected: Category | null = isCategory(field.value)
             ? field.value
             : findById(field.value as string | undefined);
   
           /* when user picks another value we send back the *same shape* */
           const handleChange = (_: any, option: Category | null) => {
             if (!option) return field.onChange("");
             field.onChange(isCategory(field.value) ? option : option._id);
           };
   
           return (
             <Autocomplete
               options={categories ?? []}
               loading={loading}
               value={selected}
               onChange={handleChange}
               /* text shown in the pop‑up list */
               getOptionLabel={(o) => o.name}
               isOptionEqualToValue={(o, v) => o._id === v._id}
               disabled={disabled}
   
               /* --- option template -------------------------------- */
               renderOption={(props, opt) => (
                 <Box component="li" {...props} key={opt._id} sx={{ display:"flex", alignItems:"center", gap:1 }}>
                   {opt.imageUrl && (
                     <Avatar src={opt.imageUrl} sx={{ width:24, height:24 }} />
                   )}
                   {opt.name}
                 </Box>
               )}
   
               /* --- input template --------------------------------- */
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label={label}
                   placeholder=""                   /* never show grey placeholder */
                   InputLabelProps={{ shrink: !!selected }}
                   error={!!fieldState.error}
                   helperText={fieldState.error?.message}
                   InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                       <>
                         {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                         {params.InputProps.endAdornment}
                       </>
                     ),
                   }}
                 />
               )}
             />
           );
         }}
       />
     );
   }
   