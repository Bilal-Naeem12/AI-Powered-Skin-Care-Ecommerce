// src/components/AccountSettingsComponent.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";
import axios from "axios";
import { User } from "@/types/User";
import ProfilePicUploader from "@/component/UI/ProfilePicUploader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface ApiResponse {
  user: User;
  message: string;
}

/* -------------------------------------------------------------------------- */
/* 1 · Zod schema ("" allowed for selects)                                     */
/* -------------------------------------------------------------------------- */
const AccountSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .nullable()
    .optional(),
  date_of_birth: z
    .string()
    .refine((v) => !v || !isNaN(Date.parse(v)), { message: "Invalid date" })
    .optional(),
  gender: z.union([
    z.enum(["Male", "Female", "Non-binary", "Other"]),
    z.literal(""),
    z.undefined(),
  ]),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }),
  preferred_language: z.union([
    z.enum(["English", "Spanish", "French", "German", "Chinese", "Other"]),
    z.literal(""),
    z.undefined(),
  ]),
  skin_concerns: z.array(z.string()).optional(),
  lifestyle_factors: z.object({
    smoking: z.boolean().optional(),
    alcohol_consumption: z.boolean().optional(),
    diet: z.union([
      z.enum(["Vegetarian", "Vegan", "Non-Vegetarian", "Other"]),
      z.literal(""),
      z.undefined(),
    ]),
  }),
  profileImage: z.string().url().nullable().optional(),
  allergenPreferences: z.array(z.string()).optional(),
});

export type AccountFormValues = z.infer<typeof AccountSchema>;
type AddressKeys = keyof AccountFormValues["address"];

/* -------------------------------------------------------------------------- */
/* 2 · Utility data / default values                                           */
/* -------------------------------------------------------------------------- */
const EMPTY_FORM: AccountFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: null,
  date_of_birth: "",
  gender: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  },
  preferred_language: "",
  skin_concerns: [],
  lifestyle_factors: {
    smoking: false,
    alcohol_consumption: false,
    diet: "",
  },
  profileImage: null,
  allergenPreferences: [],
};

const mapUserToForm = (u: User): AccountFormValues => ({
  first_name: u.first_name ?? "",
  last_name: u.last_name ?? "",
  email: u.email ?? "",
  phone: u.phone ?? null,
  date_of_birth: u.date_of_birth
    ? new Date(u.date_of_birth).toISOString().substring(0, 10)
    : "",
  gender: u.gender ?? "",
  address: {
    street: u.address?.street ?? "",
    city: u.address?.city ?? "",
    state: u.address?.state ?? "",
    country: u.address?.country ?? "",
    postal_code: u.address?.postal_code ?? "",
  },
  preferred_language: u.preferred_language ?? "",
  skin_concerns: u.skin_concerns ?? [],
  lifestyle_factors: {
    smoking: u.lifestyle_factors?.smoking ?? false,
    alcohol_consumption: u.lifestyle_factors?.alcohol_consumption ?? false,
    diet: u.lifestyle_factors?.diet ?? "",
  },
  profileImage: u.profileImage ?? null,
  allergenPreferences: u.allergenPreferences ?? [],
});

/* -------------------------------------------------------------------------- */
/* 3 · Component                                                               */
/* -------------------------------------------------------------------------- */
const PROFILE_URL = `${import.meta.env.VITE_API_BACKEND_URL}/users/profile`;

const AccountSettingsComponent: React.FC = () => {
  const { user, setUser, checkLogin } = useUserStore();

  // hydrate on mount
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const defaultValues = useMemo<AccountFormValues>(
    () => (user ? mapUserToForm(user) : EMPTY_FORM),
    [user]
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(AccountSchema),
    defaultValues,
  });

  /* When the user object arrives (or changes), reset the form */
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  /* ----- Chip helpers ----------------------------------------------------- */
  const [skinInput, setSkinInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");

  const handleAddChip = (
    field: "skin_concerns" | "allergenPreferences",
    value: string
  ) => {
    if (!value.trim()) return;
    const current = getValues(field) ?? [];
    setValue(field, [...current, value.trim()]);
    field === "skin_concerns" ? setSkinInput("") : setAllergenInput("");
  };

  const handleDeleteChip = (
    field: "skin_concerns" | "allergenPreferences",
    idx: number
  ) => {
    const current = getValues(field) ?? [];
    const next = current.filter((_, i) => i !== idx);   // immutable copy
    setValue(field, next, { shouldDirty: true });       // ⬅️ trigger rerender
  };
  const skinConcerns      = watch("skin_concerns");
const allergenPrefs     = watch("allergenPreferences");

  /* ----- Submit ----------------------------------------------------------- */
  const onSubmit = async (data: AccountFormValues) => {
    try {
      const res = await axios.put<ApiResponse>(PROFILE_URL, data, {
        withCredentials: true,
      });
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (err) {
     
      toast.error(err as String);
    }
  };

  /* ----- Prevent Enter-to-submit (except in chip inputs) ------------------ */
  const suppressEnterSubmit: React.KeyboardEventHandler<HTMLFormElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  /* Show skeleton while loading first time */
  if (!user) return <Skeleton variant="rectangular" height={300} />;

  /* ----------------------------- JSX ------------------------------------- */
  return (
    <Card sx={{ maxWidth: 900, mx: "auto" }}>

  
      <CardHeader title="Account Settings" />
           <ProfilePicUploader
                  profilePic={watch("profileImage") || ""}
                  onChange={(url) =>setValue("profileImage", url)}
                />
      <CardContent
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={suppressEnterSubmit}
      >
        <Grid container spacing={2}>
          {/* ---------- basic fields ---------- */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First name"
              fullWidth
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              {...register("first_name")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last name"
              fullWidth
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              {...register("last_name")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
          </Grid>

          {/* ---------- phone / dob ---------- */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register("phone")}
            />
          </Grid>
        <Grid item xs={12} sm={6}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopDatePicker
      label="Date of birth"
      inputFormat="yyyy-MM-dd"
      value={watch("date_of_birth") ? new Date(watch("date_of_birth")) : null}
      onChange={(newValue) =>
        setValue("date_of_birth", newValue ? newValue.toISOString().slice(0, 10) : "")
      }
      renderInput={(params:any) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          error={!!errors.date_of_birth}
          helperText={errors.date_of_birth?.message}
          sx={{
            "& .MuiInputBase-root": {
              height: "40px",
            },
            "& .MuiInputBase-input": {
              padding: "10px 14px",
            },
            "& .MuiInputAdornment-root": {
              marginRight: "8px",
            },
          }}
        />
      )}
    />
  </LocalizationProvider>
</Grid>

          {/* ---------- selects ---------- */}
          {/* ---------- gender ---------- */}
<Grid item xs={12} sm={6}>
  <Controller
    name="gender"
    control={control}
    defaultValue={getValues("gender") ?? ""}   // "" on first render
    render={({ field }) => (
      <TextField select label="Gender" fullWidth {...field}>
        <MenuItem value="">—</MenuItem>
        {["Male", "Female", "Non-binary", "Other"].map((g) => (
          <MenuItem key={g} value={g}>
            {g}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
</Grid>

{/* ---------- preferred language ---------- */}
<Grid item xs={12} sm={6}>
  <Controller
    name="preferred_language"
    control={control}
    defaultValue={getValues("preferred_language") ?? ""}
    render={({ field }) => (
      <TextField select label="Preferred language" fullWidth {...field}>
        <MenuItem value="">—</MenuItem>
        {["English", "Spanish", "French", "German", "Chinese", "Other"].map(
          (lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          )
        )}
      </TextField>
    )}
  />
</Grid>

{/* ---------- diet ---------- */}
<Grid item xs={12} sm={6}>
  <Controller
    name="lifestyle_factors.diet"
    control={control}
    defaultValue={getValues("lifestyle_factors.diet") ?? ""}
    render={({ field }) => (
      <TextField select label="Diet" fullWidth {...field}>
        <MenuItem value="">—</MenuItem>
        {["Vegetarian", "Vegan", "Non-Vegetarian", "Other"].map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
</Grid>


          {/* ---------- checkboxes ---------- */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Controller
                  name="lifestyle_factors.smoking"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value || false} />
                  )}
                />
              }
              label="Smoking"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Controller
                  name="lifestyle_factors.alcohol_consumption"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value || false} />
                  )}
                />
              }
              label="Alcohol consumption"
            />
          </Grid>

          {/* ---------- address ---------- */}
          {(
            [
              ["street", "Street"],
              ["city", "City"],
              ["state", "State"],
              ["country", "Country"],
              ["postal_code", "Postal code"],
            ] as [AddressKeys, string][]
          ).map(([key, label]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Controller
                name={`address.${key}` as const}
                control={control}
                render={({ field }) => (
                  <TextField
                    label={label}
                    fullWidth
                    {...field}
                    error={!!errors.address?.[key]}
                    helperText={errors.address?.[key]?.message ?? ""}
                  />
                )}
              />
            </Grid>
          ))}

          {/* ---------- chip fields ---------- */}
          <Grid item xs={12}>
  <TextField
    label="Add skin concern & press Enter"
    fullWidth
    value={skinInput}
    onChange={(e) => setSkinInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddChip("skin_concerns", skinInput);
      }
    }}
  />
  {(skinConcerns ?? []).map((c, i) => (
    <Chip
      key={i}
      label={c}
      sx={{ m: 0.5 }}
      onDelete={() => handleDeleteChip("skin_concerns", i)}
    />
  ))}
</Grid>

<Grid item xs={12}>
  <TextField
    label="Add allergen preference & press Enter"
    fullWidth
    value={allergenInput}
    onChange={(e) => setAllergenInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddChip("allergenPreferences", allergenInput);
      }
    }}
  />
  {(allergenPrefs ?? []).map((c, i) => (
    <Chip
      key={i}
      label={c}
      sx={{ m: 0.5 }}
      onDelete={() => handleDeleteChip("allergenPreferences", i)}
    />
  ))}
</Grid>


          {/* ---------- submit ---------- */}
          <Grid item xs={12}>
           <Button
  variant="contained"
  type="submit"
  fullWidth
  disabled={isSubmitting}
  sx={{
    py: 1.5,
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "black",
    },
  }}
>
  {isSubmitting ? (
    <CircularProgress size={24} sx={{ color: "white" }} />
  ) : (
    "Update"
  )}
</Button>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsComponent;
