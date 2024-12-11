import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../component/UI/Button";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Add logic to handle form submission (e.g., send data to API)
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 border rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-bold mb-4">Get in Touch</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: "Invalid phone number",
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
          rows="4"
          {...register("message", { required: "Message is required" })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
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
        className=" py-2"
      >
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
