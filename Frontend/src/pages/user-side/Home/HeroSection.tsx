import React from "react";
import Button from "../../../component/UI/Button";
import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const heroImage = "/assets/Hero-Section-Image.jpg";

  return (
    <section
      className="relative bg-cover bg-center p-5 lg:h-screen text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="container text-black mx-auto h-full flex items-center justify-start sm:px-6 md:px-12">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Highly Effective Skin Care
          </h1>
          <p className="my-4 text-lg md:text-xl">
          Discover your best skin with AI-driven analysis that identifies key concerns and recommends tailored solutions — all designed to enhance your natural glow.
       
          </p>
          <p className=" italic my-4">   We analyze. You glow. Simple, intelligent skincare starts here.</p>
         <Link to={"/ai-tools-page"}>  <Button  variant="white" className="mt-10">
            Discover More <MdArrowForward />
          </Button></Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
