import React from "react";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import MainLayout from "../../../component/Layout/MainLayout";

const AboutUsPage = () => {
  return (
    <MainLayout>
      <div className="p-4 sm:p-10">
        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "About Us", link: "/about-us" },
          ]}
        />

        {/* About Us Section */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20 mt-4">
         
          <div className="space-y-5">
          <h1 className="text-3xl font-bold ">About Us</h1>
            <p className="text-gray-700 text-lg ">
              At Skin Care Pro, we combine AI technology with skincare expertise
              to deliver personalized solutions. Our platform analyzes your
              skin, recommends tailored routines, and ensures allergen-safe
              products—all in one seamless experience. Empowering your skincare
              journey, we make healthier, glowing skin accessible for everyone.
            </p>
            </div> 
    <div className="  h-full">       <img  
            
              src="/assets/about-us-page.png"
              alt="AI Skincare Analysis"
              className="w-full md:w-4/6 rounded-lg mx-auto"
            />
         
          </div>
        </div>

        {/* Skincare Service Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 rounded-lg">
        <div className="  h-full">       <img  
            
            src="/assets/about-us-page2.png"
            alt="AI Skincare Analysis"
            className="w-full md:w-4/6 rounded-lg "
          />
       
        </div>
     <div className="">     <h2 className="text-2xl font-semibold">We’re your personal skincare service</h2>
          <p className="text-gray-700 mt-2 text-xl">
            Get paired with one of our Licensed Dermatology Providers for a
            personalized treatment plan that’s based on your skin’s unique
            needs—whether that’s acne, dark spots, rosacea, or early signs of
            aging.
          </p>
          <p className="text-gray-600 text-sm mt-1">*Subject to consultation</p>
          </div>  </div>

        {/* Proven Results Section */}
        <div className="my-12">
          <h2 className="text-2xl font-semibold">Proven Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <img
              src="/assets/about-us-page6.png"
                alt="Before and After 6 Months"
                className="w-full sm:h-[400px] rounded-lg"
              />
              <h3 className="mt-2 font-semibold">After 6 Months</h3>
              <p className="text-gray-700">
                Get paired with one of our Licensed Dermatology Providers for a
                personalized treatment plan that’s based on your skin’s unique
                needs.
              </p>
            </div>
            <div>
              <img
               src="/assets/about-us-page3.png"
                alt="Before and After 9 Months"
                className="w-full sm:h-[400px] rounded-lg"
              />
              <h3 className="mt-2 font-semibold">After 9 Months</h3>
              <p className="text-gray-700">
                Get paired with one of our Licensed Dermatology Providers for a
                personalized treatment plan that’s based on your skin’s unique
                needs.
              </p>
            </div>
            <div>
              <img
               src="/assets/about-us-page5.png"
                alt="Before and After 9 Months"
                className="w-full sm:h-[400px]  rounded-lg"
              />
              <h3 className="mt-2 font-semibold">After 9 Months</h3>
              <p className="text-gray-700">
                Get paired with one of our Licensed Dermatology Providers for a
                personalized treatment plan that’s based on your skin’s unique
                needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;
