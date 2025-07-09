import React from "react";
import Button from "../../../component/UI/Button";
import { MdArrowForward } from "react-icons/md";
import useFaceScanStore from "@/store/FaceScanStore";
import { Link } from "react-router-dom";

const AISection = () => {
  const {
    isModalOpen,   // ← renamed for clarity in store
    openModal,
    closeModal,
    isLoading,
  } = useFaceScanStore();
  return (<>
    <section className=" p-6 sm:py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Image Section */}
        <div className="md:w-2/5 flex justify-center">
          <img
            src="/assets/AI_Section_Image2.png"
            alt="AI Detection"
            className="max-w-full md:w-3/4"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Reveal Your Skin’s Needs with AI</h2>
          <p className="text-gray-400 mb-6">
            Our AI-powered detection tool will analyze your skin for concerns like dryness, acne,
            and pigmentation, providing a personalized skincare plan to address your unique needs
            and enhance your skin’s natural glow.
          </p>
          <Button variant="black" onClick={openModal}>
            Start Detection <MdArrowForward />
          </Button>
        </div>
      </div>
    </section>
    <section className="p-6 sm:py-16 border border-y-black">
  <div className="container mx-auto flex flex-col md:flex-row-reverse items-center">
    {/* Image Section */}
    <div className="md:w-2/5 flex justify-center">
      <img
        src="/assets/Shop-Image.avif"
        alt="Explore Shop"
        className="max-w-full h-60 md:w-4/5 rounded-3xl"
      />
    </div>

    {/* Text Section */}
    <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12 text-center md:text-left">
      <h2 className="text-3xl font-bold mb-4">Explore Our Skincare Shop</h2>
      <p className="text-gray-400  mb-6">
        Discover dermatologist-approved skincare essentials designed for every skin type. 
        From cleansers to serums — shop trusted, effective products that deliver real results.
      </p>
      <Link to={"/shop"}><Button variant="black">
        Explore Shop <MdArrowForward />
      </Button>
      </Link>
    </div>
  </div>
</section>

    </>
  );
};

export default AISection;
