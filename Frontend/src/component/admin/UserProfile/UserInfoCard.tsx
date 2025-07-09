// src/component/admin/UserProfile/UserInfoCard.tsx
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";

import Label from "../form/Label";
import useUserStore from "@/store/UserStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormUpdateAuth } from "@/hooks/useFormUpdateAuth";
import { Button, Input } from "@mui/material";
import { useEffect } from "react";
import ProfilePicUploader from "@/component/UI/ProfilePicUploader";



export const userInfoSchema = z.object({
  profileImage:z.string(),
  first_name: z.string().min(2, "First name required"),
  last_name : z.string().min(2, "Last name required"),
  email     : z.string().email("Invalid e‑mail"),
  phone     : z.string().optional(),
  bio       : z.string().optional(),       // you stored role here before
});
export type UserInfoPayload = z.infer<typeof userInfoSchema>;
export default function UserInfoCard() {
  const { user,checkLogin } = useUserStore();
  const { isOpen, openModal, closeModal } = useModal();


  /* ——— RHF + Zod ——— */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
       setValue,
    watch
  } = useForm<UserInfoPayload>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      profileImage:user?.profileImage?? "",
      first_name: user?.first_name ?? "",
      last_name : user?.last_name ?? "",
      email     : user?.email ?? "",
      phone     : user?.phone ?? "",
      bio       : "",           // optional field
    },
  });

  /* ——— submit helper (PUT /users/profile) ——— */
  const updateProfile = useFormUpdateAuth(
    `${import.meta.env.VITE_API_BACKEND_URL}/users/profile`,
    () => {
      closeModal();
      reset(undefined, { keepValues: true });
    }
  );
  useEffect(() => {
    if (!isOpen || !user) return;
  
    reset({
       profileImage:user?.profileImage?? "",
      first_name: user.first_name,
      last_name : user.last_name,
      email     : user.email,
      phone     : user.phone ?? "",
    });
  }, [isOpen, user, reset]);
  /* ——— UI ——— */
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/* STATIC CARD */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* left column */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
           
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {[
              ["First Name", user?.first_name],
              ["Last Name", user?.last_name],
              ["Email", user?.email],
              ["Phone", user?.phone ?? "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outlined"  onClick={openModal}>
          Edit
        </Button>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px]">
        <form
          onSubmit={handleSubmit(updateProfile)}
          className="no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
           <ProfilePicUploader
                            profilePic={watch("profileImage") || ""}
                            onChange={(url) =>setValue("profileImage", url)}
                          />
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input {...register("first_name")} error={!!errors.first_name} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input {...register("last_name")} error={!!errors.last_name} />
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register("email")} error={!!errors.email} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phone")} error={!!errors.phone} />
            </div>
            
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
