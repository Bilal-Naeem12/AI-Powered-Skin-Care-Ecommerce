import React from "react";
import Button from "../../../component/UI/Button";
import { MdArrowForward } from "react-icons/md";

const HeroSection = () => {
  const heroImage = "/assets/Hero-Section-Image.jpg";

  return (
    <section
      className="relative bg-cover bg-center h-screen text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="container text-black mx-auto h-full flex items-center justify-start px-6 md:px-12">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Highly Effective Skin Care
          </h1>
          <p className="my-4 text-lg md:text-xl">
            A combination of nature and advanced technology. Vegan, natural,
            skin-friendly, and rich in effective biotechnological ingredients.
          </p>
          <Button variant="white" className="mt-10">
            Discover More <MdArrowForward />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
