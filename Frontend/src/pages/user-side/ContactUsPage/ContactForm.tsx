import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Import Zod
import Button from "../../../component/UI/Button"; // Button component

// Define Zod schema for validation
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>; // Type inference from Zod schema

const ContactForm: React.FC = () => {
  // Setup react-hook-form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema), // Use Zod resolver for validation
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form Data:", data);
    // Add logic to handle form submission (e.g., send data to API)
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 border rounded-lg shadow-xs"
    >
      <h3 className="text-lg font-bold mb-4">Get in Touch</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-black"
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-black"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Phone Number"
          {...register("phone")}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 ${
            errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-black"
          }`}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <textarea
          placeholder="Message"
          rows={4}
          {...register("message")}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 ${
            errors.message ? "border-red-500 focus:ring-red-500" : "focus:ring-black"
          }`}
        ></textarea>
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="secondary"
        className="py-2"
      >
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
