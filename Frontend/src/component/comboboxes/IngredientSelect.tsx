import React, { useMemo } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import useFetchAuthData from "@/hooks/useFetchAuthData";

/* ------------------------------------------------------- */

const URL = `${import.meta.env.VITE_API_BACKEND_URL}/products/ingredients/all-unique`;

interface Props {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  multiple?: boolean; // allow selecting multiple ingredients
}

export default function IngredientSelect({
  control,
  name,
  label = "Ingredients",
  disabled = false,
  multiple = true, // most cases: multiple ingredients
}: Props) {
  const { data: ingredients, loading } = useFetchAuthData<string[]>(URL);
const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Please select at least one ingredient" }}
      render={({ field, fieldState }) => (
        <Autocomplete
          multiple={multiple}
         options={ingredients?.data ?? []}
          loading={loading}
          value={field.value || []}
          onChange={(_, value) => field.onChange(value)}
          isOptionEqualToValue={(option, value) => option === value}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder=""
              InputLabelProps={{ shrink: true }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && (
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
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
