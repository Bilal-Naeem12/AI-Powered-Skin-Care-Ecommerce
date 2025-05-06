/* src/components/form/CategorySelect.tsx
   -------------------------------------------------------------- */
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
   
   /* narrow helper */
   const isCategory = (v: unknown): v is Category =>
     !!v && typeof v === "object" && "_id" in (v as any);
   
   interface Props {
     control:   Control<any>;
     name:      string;
     label?:    string;
     disabled?: boolean;
   }
   
   export default function CategorySelect({
     control,
     name,
     label = "Category",
     disabled = false,
   }: Props) {
     /* fetch once */
     const { data: cats, loading } = useFetchAuthData<Category[]>(URL);
   
     /* id → object lookup */
     const findById = useMemo(() => {
       if (!cats) return () => null;
       const map = new Map(cats.map(c => [c._id, c]));
       return (id?: string | null) => (id ? map.get(id) ?? null : null);
     }, [cats]);
   
     return (
       <Controller
         name={name}
         control={control}
         /* ► required ◄ */
         rules={{ required: "Please select a category" }}
         render={({ field, fieldState }) => {
           /* normalise value (either id or object) */
           const selected: Category | null = isCategory(field.value)
             ? field.value
             : findById(field.value as string | undefined);
   
           /* propagate in the same shape we received */
           const handleChange = (_: any, option: Category | null) => {
             if (!option) return field.onChange("");
             field.onChange(isCategory(field.value) ? option : option._id);
           };
   
           return (
             <Autocomplete
               options={cats ?? []}
               loading={loading}
               value={selected}
               onChange={handleChange}
               getOptionLabel={(o) => o.name}
               isOptionEqualToValue={(o, v) => o._id === v._id}
               disabled={disabled}
               /* keep label out of the way, kill placeholder */
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label={label}
                   placeholder=""                         /* ← always blank   */
                   InputLabelProps={{ shrink: !!selected }} /* float on select */
                   error={!!fieldState.error}
                   helperText={fieldState.error?.message}
                   /* ---- little spinner in the Input end‑adornment ---- */
                   InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                       <>
                         {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                         {params.InputProps.endAdornment}
                       </>
                     ),
                   }}
                   /* hide default placeholder that MUI adds internally */
                   inputProps={{
                     ...params.inputProps,
                     ...(!selected && { style: { opacity: 0 } }), /* hide ghost */
                   }}
                 />
               )}
               /* option with optional thumbnail  */
               renderOption={(props, opt) => (
                 <Box
                   component="li"
                   {...props}
                   key={opt._id}
                   sx={{ display: "flex", alignItems: "center", gap: 1 }}
                 >
                   {opt.imageUrl && (
                     <Avatar src={opt.imageUrl} sx={{ width: 24, height: 24 }} />
                   )}
                   {opt.name}
                 </Box>
               )}
             />
           );
         }}
       />
     );
   }
   