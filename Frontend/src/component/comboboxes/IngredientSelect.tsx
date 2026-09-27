import React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import useFetchAuthData from "@/hooks/useFetchAuthData";

/* ------------------------------------------------------- */

const URL = `${import.meta.env.VITE_API_BACKEND_URL}/products/ingredients/all-unique`;

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export default function IngredientSelect<T extends FieldValues>({
  control,
  name,
  label = "Ingredients",
  disabled = false,
  multiple = true,
}: Props<T>) {
  const { data: ingredients, loading } =
    useFetchAuthData<string[] | { data: string[] }>(URL);

  const safeIngredients = Array.isArray(ingredients)
    ? ingredients
    : Array.isArray(ingredients?.data)
      ? ingredients.data
      : [];

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Please select at least one ingredient",
      }}
      render={({ field, fieldState }) => (
        <Autocomplete
          multiple={multiple}
          options={safeIngredients}
          loading={loading}
          value={field.value ?? (multiple ? [] : null)}
          onChange={(_, value) => field.onChange(value)}
          isOptionEqualToValue={(option, value) => option === value}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {option}
            </Box>
          )}
        />
      )}
    />
  );
}