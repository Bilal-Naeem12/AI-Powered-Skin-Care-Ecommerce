import React from "react";
import Breadcrumb from "../../../component/UI/Breadcrumb";
import MainLayout from "../../../component/Layout/MainLayout";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const AboutUsPage = () => {
  return (
    <MainLayout>
      <div className="px-4 sm:px-10 py-6 sm:py-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "About Us", link: "/about-us" },
          ]}
        />

        {/* About Us Section */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 sm:gap-16 mt-8"
        >
          <div className="space-y-5">
            <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
            <p className="text-gray-700 text-base leading-relaxed">
              At <strong>Skin Care Pro</strong>, we combine AI technology with expert dermatological insight to deliver
              personalized skincare solutions. Our platform analyzes your skin,
              recommends tailored routines, and ensures allergen-safe products —
              all in one seamless experience.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Empowering your skincare journey, we make healthier, glowing skin
              accessible to everyone—backed by science, supported by AI.
            </p>
          </div>
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/about-us-page.png"
              alt="AI Skincare Analysis"
              className="w-full rounded-lg shadow-md"
            />
          </motion.div>
        </motion.section>

        {/* Personal Skincare Service */}
        <motion.section
          className="mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10 sm:gap-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/about-us-page2.png"
              alt="Personalized Treatment"
              className="w-full rounded-lg shadow-md"
            />
          </motion.div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              We’re Your Personal Skincare Service
            </h2>
            <p className="text-gray-700 mt-4 text-base leading-relaxed">
              Get paired with one of our Licensed Dermatology Providers for a
              customized treatment plan tailored to your skin’s unique needs—
              whether it’s acne, dark spots, rosacea, or early signs of aging.
            </p>
            <p className="text-gray-500 text-sm mt-2 italic">
              *Subject to dermatology consultation.
            </p>
          </div>
        </motion.section>

        {/* Proven Results */}
        <motion.section
          className="mt-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-10">
            Proven Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "/assets/about-us-page6.png",
                title: "After 6 Months",
              },
              {
                img: "/assets/about-us-page3.png",
                title: "After 9 Months",
              },
              {
                img: "/assets/about-us-page5.png",
                title: "After 9 Months",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    See visible transformation with our guided routine and
                    dermatology support designed just for your skin’s evolving
                    needs.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;
