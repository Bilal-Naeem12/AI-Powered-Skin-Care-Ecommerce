import React from "react";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";
import MainLayout from "../../../component/Layout/MainLayout";

const ContactUsPage = () => {
  return (
    <MainLayout>
    <div className="sm:p-6 w-3/4 mx-auto py-6">


      <h2 className="text-2xl font-bold text-center sm:text-left mt-4 mb-6">Contact Us for any Question</h2>

      {/* Contact Details */}
      <ContactDetails />

      {/* Contact Form */}
      <ContactForm />
    </div>

    </MainLayout>
  );
};

export default ContactUsPage;
