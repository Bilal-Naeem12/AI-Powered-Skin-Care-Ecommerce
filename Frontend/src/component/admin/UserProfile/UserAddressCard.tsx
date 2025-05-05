// src/component/admin/UserProfile/UserAddressCard.tsx
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import { Button, Input } from "@mui/material";

import Label from "../form/Label";
import useUserStore from "@/store/useUserStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormUpdateAuth } from "@/hooks/useFormUpdateAuth";
import { useEffect } from "react";
// src/schemas/address.schema.ts
import { z } from "zod";

export const addressSchema = z.object({
  country     : z.string().min(2, "Country is required"),
  state       : z.string().min(2, "State / Province is required"),
  city        : z.string().min(2, "City is required"),
  street      : z.string().optional(),
  postal_code : z.string().regex(/^\d{4,6}$/, "4‑6 digit postal code"),
  tax_id      : z.string().optional(),          // field only for UI, not DB
});
export type AddressPayload = z.infer<typeof addressSchema>;

export default function UserAddressCard() {
  const { user } = useUserStore();
  const { isOpen, openModal, closeModal } = useModal();

  /* RHF */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressPayload>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country     : user?.address.country     ?? "",
      state       : user?.address.state       ?? "",
      city        : user?.address.city        ?? "",
      street      : user?.address.street      ?? "",
      postal_code : user?.address.postal_code ?? "",
      tax_id      : "",   // optional UI field
    },
  });

  /* refill every time modal opens */
  useEffect(() => {
    if (!isOpen || !user) return;
    reset({
      country     : user.address.country     ?? "",
      state       : user.address.state       ?? "",
      city        : user.address.city        ?? "",
      street      : user.address.street      ?? "",
      postal_code : user.address.postal_code ?? "",
      tax_id      : "",
    });
  }, [isOpen, user, reset]);

  /* submit helper */
  const saveAddress = useFormUpdateAuth(
    `${import.meta.env.VITE_API_BACKEND_URL}/users/profile`,
    closeModal
  );

  const onSubmit = (values: AddressPayload) => {
    // payload matches schema of backend
    saveAddress({ address: values });
  };

  /* ---------------------------------------------------------------- */
  return (
    <>
      {/* static card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {[
                ["Country", user?.address.country],
                ["City / State", `${user?.address.city}, ${user?.address.state}`],
                ["Postal Code", user?.address.postal_code],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outlined" onClick={openModal}>
            Edit
          </Button>
        </div>
      </div>

      {/* modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11"
        >
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your address information.
          </p>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <Label>Country</Label>
              <Input {...register("country")} error={!!errors.country} />
            </div>

            <div>
              <Label>State / Province</Label>
              <Input {...register("state")} error={!!errors.state} />
            </div>

            <div>
              <Label>City</Label>
              <Input {...register("city")} error={!!errors.city} />
            </div>

            <div>
              <Label>Postal Code</Label>
              <Input {...register("postal_code")} error={!!errors.postal_code} />
            </div>

            <div className="col-span-2">
              <Label>Street (optional)</Label>
              <Input {...register("street")} />
            </div>

            {/* <div className="col-span-2">
              <Label>TAX ID (optional)</Label>
              <Input {...register("tax_id")} />
            </div> */}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
