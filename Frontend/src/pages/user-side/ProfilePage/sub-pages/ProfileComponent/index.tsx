// src/components/ProfileComponent.tsx
import React from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineGlobe,
  HiOutlineCog,
} from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import useUserStore from "@/store/useUserStore";
import { Detail } from "./Detail";

const heading = "text-lg font-semibold text-primary";
const label   = "text-sm font-medium text-gray-600 dark:text-gray-400";
const value   = "text-sm";

const ProfileComponent: React.FC = () => {
  const { user } = useUserStore();

  if (!user)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const {
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    gender,
    preferred_language,
    profileImage,
    address,
    skin_concerns,
    lifestyle_factors,
    allergenPreferences,
  } = user;

  return (
    <section className="max-w-7xl mx-auto  md:p-8">
      {/* Card */}
      <div className="rounded-xl shadow-lg bg-white dark:bg-neutral-800 overflow-hidden">
        {/* Header */}
        <div className=" bg-[#75abd8] text-white p-6 flex flex-col md:flex-row items-center gap-4">
          <img
            src={profileImage || "/assets/default-profile.png"}
            alt={`${first_name} ${last_name}`}
            className="w-28 h-28 rounded-full bg-white object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {first_name} {last_name}
            </h2>
            <p className="flex items-center gap-1 mt-1">
              <HiOutlineMail /> {email}
            </p>
            {phone && (
              <p className="flex items-center gap-1">
                <HiOutlinePhone /> {phone}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 bg-white">

          {/* Personal Details */}
          <div>
            <h3 className={heading}>Personal details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Detail label="Date of birth">
                <HiOutlineCalendar className="inline-block mr-1" />
                {date_of_birth
                  ? new Date(date_of_birth).toLocaleDateString()
                  : "—"}
              </Detail>
              <Detail label="Gender">{gender || "—"}</Detail>
              <Detail label="Preferred language">
                {preferred_language || "—"}
              </Detail>
              <Detail label="Allergens">
                {allergenPreferences?.length
                  ? allergenPreferences.join(", ")
                  : "—"}
              </Detail>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className={heading}>Address</h3>
            <p className="mt-2 flex items-start gap-1">
              <MdLocationOn className="mt-0.5 shrink-0" />
              {address?.street || ""} {address?.city || ""},{" "}
              {address?.state || ""} {address?.country || ""}{" "}
              {address?.postal_code || ""}
            </p>
          </div>

          {/* Skin Concerns */}
          <div>
            <h3 className={heading}>Skin concerns</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {skin_concerns?.length ? (
                skin_concerns.map((c) => (
                  <span
                    key={c}
                    className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <p className={value}>None listed</p>
              )}
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <h3 className={heading}>Lifestyle factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Detail label="Smoking">
                {lifestyle_factors?.smoking ? "Yes" : "No"}
              </Detail>
              <Detail label="Alcohol consumption">
                {lifestyle_factors?.alcohol_consumption ? "Yes" : "No"}
              </Detail>
              <Detail label="Diet">{lifestyle_factors?.diet || "—"}</Detail>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Re-usable small component */


export default ProfileComponent;
