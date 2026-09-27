/* src/components/form/CategorySelect.tsx
   -------------------------------------------------------------- */

import React, { useMemo } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
} from "@mui/material";

import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import useFetchAuthData from "@/hooks/useFetchAuthData";
import { Category } from "@/types/Category";

const URL = `${import.meta.env.VITE_API_BACKEND_URL}/categories`;

const isCategory = (value: unknown): value is Category =>
  !!value &&
  typeof value === "object" &&
  "_id" in value;

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
}

export default function CategorySelect<T extends FieldValues>({
  control,
  name,
  label = "Category",
  disabled = false,
}: Props<T>) {
  const { data: response, loading } =
    useFetchAuthData<Category[] | { categories: Category[] }>(URL);

  const cats = useMemo(
    () =>
      Array.isArray(response)
        ? response
        : response?.categories ?? [],
    [response]
  );

  const findById = useMemo(() => {
    const map = new Map(cats.map((category) => [category._id, category]));

    return (id?: string | null) =>
      id ? map.get(id) ?? null : null;
  }, [cats]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Please select a category",
      }}
      render={({ field, fieldState }) => {
        const selected: Category | null = isCategory(field.value)
          ? field.value
          : findById(field.value as string | undefined);

        const handleChange = (
          _: React.SyntheticEvent,
          option: Category | null
        ) => {
          if (!option) {
            field.onChange("");
            return;
          }

          field.onChange(
            isCategory(field.value)
              ? option
              : option._id
          );
        };

        return (
          <Autocomplete
            options={cats}
            loading={loading}
            value={selected}
            onChange={handleChange}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) =>
              option._id === value._id
            }
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {option.imageUrl && (
                  <Avatar
                    src={option.imageUrl}
                    sx={{
                      width: 24,
                      height: 24,
                    }}
                  />
                )}

                {option.name}
              </Box>
            )}
          />
        );
      }}
    />
  );
}