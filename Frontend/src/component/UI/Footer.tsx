import React from "react";
import { FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Logo and Social Media */}
          <div className="mb-6 md:mb-0">
            <img src="/assets/footer.png" alt="Skin Care Pro" className="h-10 mb-4" />
            <p className="font-bold">FOLLOW US</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-pink-500">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-500">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-pink-500">
                <FaFacebookF size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="font-bold mb-4">Products</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-500">Inner Care</a></li>
                <li><a href="#" className="hover:text-pink-500">Skin Care</a></li>
                <li><a href="#" className="hover:text-pink-500">Scalp Care</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Guides</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-500">News</a></li>
                <li><a href="#" className="hover:text-pink-500">Vision</a></li>
                <li><a href="#" className="hover:text-pink-500">Q&A</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Service</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-500">About Concierge</a></li>
                <li><a href="#" className="hover:text-pink-500">Online Consultation</a></li>
                <li><a href="#" className="hover:text-pink-500">Market</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Contact</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-pink-500">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>SKIN CARE PRO. 2024 KINS All rights reserved.</p>
          <p className="mt-4 space-x-6">
            <a href="#" className="hover:text-pink-500">Company Profile</a>
            <a href="#" className="hover:text-pink-500">Privacy policy</a>
            <a href="#" className="hover:text-pink-500">Cancellation policy</a>
            <a href="#" className="hover:text-pink-500">Terms of service</a>
            <a href="#" className="hover:text-pink-500">Refund/Return Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
